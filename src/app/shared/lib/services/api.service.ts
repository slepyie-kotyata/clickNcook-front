import {Injectable} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {SoundService} from './game/sound.service';
import {ErrorService} from './game/error.service';
import {IMessage} from '../../../entities/api';
import {AuthService} from './auth.service';
import {firstValueFrom, takeUntil} from 'rxjs';
import {RequestType} from '../../../entities/types';
import {GameStore} from '../stores/gameStore';

@Injectable({
  providedIn: 'root',
})
/** API сервис для общения с бэкендом */
export class ApiService {
  constructor(
    private ws: WebSocketService,
    private auth: AuthService,
    private sound: SoundService,
    private error: ErrorService,
    private store: GameStore
  ) {
  }

  /** Токен доступа из локального хранилища */
  private get token(): string {
    return localStorage.getItem("accessToken") || "";
  }

  /**
   Загружает пользовательские данные и открывает WebSocket соединение
   */
  async loadData() {
    this.store.isLoaded.set(false);

    await new Promise(res => setTimeout(res, 30));

    try {
      if (this.ws.connected)
        this.ws.close();
      await this.ws.connect()
        .then(() => {
          this.ws.message
            .pipe(takeUntil(this.store.destroy$))
            .subscribe(msg => this.newMessage(msg));
        })
        .then(() => this.level_check())
        .then(() => this.sound.load());

    } catch (error) {
      this.error.handle(error);
    }
  }

  /**
   Обрабатывает новое сообщение от сервера
   @param msg - сообщение
   */
  async newMessage(msg: IMessage) {
    switch (msg.request_type) {
      case "error":
        if (msg.data?.['message'] && (msg.data?.['message'] === "token invalid" || msg.data?.['message'] === "missing token")) {
          await this.tryRefreshAndRetry(msg);
        }
        break;
      case "session":
        if (msg.data?.['session']) {
          this.store.session.set(msg.data['session']);
        }
        if (!this.store.isLoaded()) {
          this.store.isLoaded.set(true);
        }
        break;
      case "cook":
        if (msg.data?.['message']) {
          let session = this.store.session();
          if (session) {
            session.dishes = msg.data['message'].dishes;
            session.level.xp = msg.data['message'].xp;
            this.store.session.set(session);
            this.sound.play('cook');
          } else {
            this.error.handle('No session data');
          }
        } else {
          this.error.handle('No cook data');
        }
        break;
      case "sell":
        if (msg.data?.['message']) {
          let session = this.store.session();
          if (session) {
            session.dishes = msg.data['message'].dishes;
            session.money = msg.data['message'].money;
            session.level.xp = msg.data['message'].xp;
            this.store.session.set(session);
            this.sound.play('sell');
          } else {
            this.error.handle('No session data');
          }
        } else {
          this.error.handle('No sell data');
        }
        break;
      case "level_check":
        if (msg.data?.['message']) {
          this.store.neededXp.set(msg.data['message'].needed_xp);
          if (msg.data?.['message'].current_xp > msg.data?.['message'].needed_xp) {
            this.level_up();
          }
        }
        break;
      case "level_up":
        if (msg.data?.['message']) {
          let session = this.store.session();
          if (session) {
            session.level.rank = msg.data['message'].current_rank;
            session.level.xp = msg.data['message'].current_xp;
            this.store.session.set(session);
            this.sound.play('level-up');
          } else {
            this.error.handle('No session data');
          }
        } else {
          this.error.handle('No level data');
        }
        break;
      case "passive":
      case "session_reset":
      case "upgrade_buy":
      case "upgrade_list":
      default:
        console.log(msg.data);
    }
  }

  /** Выход пользователя из системы */
  logout() {
    this.store.isLoaded.set(false);
    this.ws.close();
    this.auth.logout();
  }

  cook() {
    let request = this.buildRequest("cook");
    this.sendWithAuthRetry(request).then(() => this.level_check());
  }

  sell() {
    let request = this.buildRequest("sell");
    this.sendWithAuthRetry(request).then(() => this.level_check());
  }

  upgrade_buy(id: number) {
    let request = this.buildRequest("upgrade_buy", {id: id});
    this.sendWithAuthRetry(request);
  }

  upgrade_list() {
    let request = this.buildRequest("upgrade_list");
    this.sendWithAuthRetry(request);
  }

  level_up() {
    let request = this.buildRequest("level_up");
    this.sendWithAuthRetry(request);
  }

  level_check() {
    let request = this.buildRequest("level_check");
    this.sendWithAuthRetry(request);
  }

  session_reset() {
    let request = this.buildRequest("session_reset");
    this.sendWithAuthRetry(request);
  }

  private async tryRefreshAndRetry(msg: IMessage) {
    const failedId = msg.request_id;
    if (!failedId) return;

    const pending = this.ws.pendingMap.get(failedId);
    if (!pending) return;

    try {
      const data = await firstValueFrom(this.auth.refreshToken());
      localStorage.setItem("accessToken", data.tokens.access_token);
      localStorage.setItem("refreshToken", data.tokens.refresh_token);

      pending.payload.data.token = data.tokens.access_token;

      const result = await this.ws.sendRequest(pending.payload);

      pending.resolve(result);

    } catch (err) {
      pending.reject("Refresh failed");
      this.logout();
    } finally {
      this.ws.pendingMap.delete(failedId);
    }
  }


  /**
   Построение запроса с типом и данными
   @param type - тип запроса
   @param data - дополнительные данные для запроса
   */
  private buildRequest(type: RequestType, data: any = {}): IMessage {
    return {
      message_type: "request",
      request_type: type,
      data: {
        token: this.token,
        ...data
      }
    };
  }

  /**
   Отправка запроса с повторной аутентификацией при необходимости
   @param request - запрос для отправки
   @returns ответ на запрос
   */
  private async sendWithAuthRetry(request: IMessage): Promise<IMessage> {
    try {
      return await this.ws.sendRequest(request);
    } catch (error) {
      try {
        const data = await firstValueFrom(this.auth.refreshToken());

        localStorage.setItem("accessToken", data.tokens.access_token);
        localStorage.setItem("refreshToken", data.tokens.refresh_token);

        request.data.token = data.tokens.access_token;

        return await this.ws.sendRequest(request);

      } catch (refreshErr) {
        this.logout();
        throw refreshErr;
      }
    }
  }

}
