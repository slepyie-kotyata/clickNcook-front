import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {filter, firstValueFrom, ReplaySubject} from 'rxjs';
import {IMessage} from '../../../entities/api';
import {AuthService} from './auth.service';
import {ErrorService} from './game/error.service';

@Injectable({
  providedIn: 'root',
})
/** WebSocket сервис для общения с бэкендом */
export class WebSocketService {
  pendingMap = new Map<string, { payload: any, resolve: (v: any) => void, reject: (e: any) => void }>();
  private socket$!: WebSocketSubject<IMessage>;
  private isConnected = false;
  private msg$ = new ReplaySubject<IMessage>(1);
  private readonly maxReconnectAttempts = 3;
  private reconnectAttempts = 0;

  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;

  constructor(private auth: AuthService, private error: ErrorService) {
    this.auth.onLogout$.subscribe(() => {
      this.shutdown();
    });
  }

  get connected() {
    return this.isConnected;
  }

  get message() {
    return this.msg$.asObservable();
  }

  get sessionRequest(): IMessage {
    return {
      message_type: "request",
      request_type: "session",
      data: {token: localStorage.getItem("accessToken") ?? ""}
    }
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    if (!this.auth.isAuthenticated) return;

    return new Promise((resolve, reject) => {
      this.socket$ = webSocket<IMessage>({
        url: this.socketURL,
        openObserver: {
          next: () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            resolve();
          }
        },
        closeObserver: {
          next: (event) => {
            this.error.handle(event);
            this.isConnected = false;

            if (event.code !== 1000) {
              this.reconnect();
            }
          }
        }
      });

      this.socket$.subscribe({
        next: msg => this.msg$.next(msg),
        error: err => {
          this.error.handle(err);
        },
        complete: () => this.isConnected = false
      });
    });
  }

  /**
   Отправка запроса на сервер и ожидание ответа
   @param payload - данные запроса
   @returns Promise с ответными данными
   @template T - тип данных ответа
   */
  sendRequest<T = any>(payload: any): Promise<{ response: T; requestId: string }> {
    if (!this.isConnected) {
      this.reconnect();
    }

    const requestId = crypto.randomUUID();
    payload.request_id = requestId;

    return new Promise(async (resolve, reject) => {
      this.pendingMap.set(requestId, {payload, resolve, reject});

      try {
        this.socket$.next(payload);

        const msg = await firstValueFrom(
          this.message.pipe(
            filter(m => m.request_id === requestId)
          )
        );

        this.pendingMap.delete(requestId);

        if (msg.request_type === 'error') {
          reject(msg.data?.['message']);
          return;
        }

        resolve({response: msg as T, requestId});
      } catch (e) {
        this.pendingMap.delete(requestId);
        reject(e);
      }
    });
  }

  /**
   Корректно закрывает текущее WebSocket соединение и очищает очередь сообщений
   */
  close() {
    if (!this.socket$) return;

    try {
      const raw = (this.socket$ as any)._socket as WebSocket;

      raw?.close(1000, "User logout");

      this.socket$.complete();
      this.socket$.unsubscribe();
    } catch (e) {
      this.error.handle(e);
    }

    this.isConnected = false;
    this.msg$ = new ReplaySubject<IMessage>(1);
  }

  reconnect() {
    if (!this.auth.isAuthenticated) return;

    let reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect()
          .then(() => this.sendRequest(this.sessionRequest))
          .catch(() => null);
      } catch (err) {
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          if (this.auth.isAuthenticated) {
            this.auth.logout("Сессия истекла");
          }
          clearTimeout(reconnectTimeout);
          return;
        }
      }
    }, 1000);
  }

  private shutdown() {
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.pendingMap.clear();
    this.close();
  }

}
