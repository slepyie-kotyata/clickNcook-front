import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {ReplaySubject} from 'rxjs';
import {IMessage} from '../../../entities/api';

@Injectable({
  providedIn: 'root',
})
// WebSocket сервис для общения с бэкендом
export class WebSocketService {
  private socket$!: WebSocketSubject<IMessage>;
  private isConnected = false;
  private msg$ = new ReplaySubject<IMessage>(1);

  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;

  get connected() {
    return this.isConnected;
  }

  get message() {
    return this.msg$.asObservable();
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    return new Promise((resolve, reject) => {
      this.socket$ = webSocket<IMessage>({
        url: this.socketURL,
        openObserver: {
          next: () => {
            this.isConnected = true;
            resolve();
          }
        },
        closeObserver: {
          next: () => {
            this.isConnected = false;
          }
        },
      });

      this.socket$.subscribe({
        next: (msg) => this.msg$.next(msg),
        error: (err) => {
          this.isConnected = false;
          reject(err);
        },
        complete: () => {
          this.isConnected = false;
        }
      });
    });
  }

  sendRequest<T = any>(payload: any): Promise<T> {
    return new Promise(async (resolve, reject) => {
      if (!this.isConnected) {
        try {
          await this.connect();
        } catch (e) {
          return reject(e);
        }
      }

      const requestId = crypto.randomUUID();
      payload.request_id = requestId;

      const sub = this.message.subscribe((msg: any) => {
        if (msg.request_id === requestId) {
          sub.unsubscribe();

          if (msg.request_type === 'error') {
            return reject(msg.data.error);
          }

          resolve(msg.data);
        }
      });

      this.socket$.next(payload);
    });
  }


  close() {
    if (!this.socket$) return;

    try {
      const raw = (this.socket$ as any)._socket as WebSocket;

      raw?.close(1000, "User logout");

      this.socket$.complete();
      this.socket$.unsubscribe();
    } catch (e) {
      console.error("WS close error:", e);
    }

    this.isConnected = false;
    this.msg$ = new ReplaySubject<IMessage>(1);
  }
}
