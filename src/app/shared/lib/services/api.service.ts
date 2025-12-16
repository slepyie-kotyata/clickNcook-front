import {Injectable} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {SoundService} from './game/sound.service';
import {ErrorService} from './game/error.service';
import {IMessage} from '../../../entities/api';
import {AuthService} from './auth.service';
import {firstValueFrom, Subscription, takeUntil} from 'rxjs';
import {RequestType} from '../../../entities/types';
import {GameStore} from '../stores/gameStore';
import {ISession} from '../../../entities/game';

@Injectable({
  providedIn: 'root',
})
/** API сервис для общения с бэкендом */
export class ApiService {
  private wsSub?: Subscription;

  constructor(
    private ws: WebSocketService,
    private auth: AuthService,
    private sound: SoundService,
    private error: ErrorService,
    private store: GameStore,
  ) {
    this.auth.onLogout$.subscribe(() => {
      this.store.destroy$.next();
      this.store.destroy$.complete();
    });
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

    try {
      if (this.ws.connected) this.ws.close();

      this.subscribeToWS();

      await this.ws.connect();
      this.sound.load();

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
          break;
        }
        this.error.handle(msg.data ? msg.data['message'] : 'Unknown error from server');
        break;
      case "session":
        if (!msg.data?.['session']) {
          this.error.handle('No session data');
          break;
        }
        this.level_check();
        this.store.session.set(msg.data['session']);
        this.store.isLoaded.set(true);
        break;
      case "cook":
        if (!msg.data?.['dishes'] && !msg.data?.['xp']) {
          this.error.handle('No cook data');
          break;
        }
        this.updateSession(session => ({
          ...session,
          dishes: msg.data['dishes'],
          level: {
            ...session.level,
            xp: msg.data['xp'],
          }
        }));
        this.sound.play('cook');
        this.level_check();
        break;
      case "sell":
        if (!msg.data?.['dishes'] && !msg.data?.['money']) {
          this.error.handle('No sell data');
          break;
        }
        this.updateSession(session => ({
          ...session,
          dishes: msg.data['dishes'],
          money: msg.data['money'],
          level: {
            ...session.level,
            xp: msg.data['xp'],
          }
        }));
        this.sound.play('sell');
        this.level_check();
        break;
      case "level_check":
        if (!msg.data?.['current_rank'] && !msg.data?.['current_xp'] && !msg.data?.['needed_xp']) {
          this.error.handle('No level data');
          break;
        }
        this.store.neededXp.set(msg.data['needed_xp']);
        if (msg.data?.['current_xp'] > msg.data?.['needed_xp']) {
          this.level_up();
        }
        break;
      case "level_up":
        if (!msg.data?.['current_rank']) {
          this.error.handle('No level data');
          break;
        }
        this.updateSession(session => ({
          ...session,
          level: {
            rank: msg.data['current_rank'],
            xp: msg.data['current_xp'],
          }
        }));
        this.sound.play('level-up');
        this.level_check();
        break;
      case "upgrade_buy":
        if (!msg.data?.['money'] && !msg.data?.['xp']) {
          this.error.handle('No upgrade buy data');
          break;
        }
        this.updateSession(session => ({
          ...session,
          money: msg.data['money'],
          level: {
            ...session.level,
            xp: msg.data['xp'],
          }
        }));
        this.sound.play('buy');
        this.level_check();
        this.upgrade_list();
        break;
      case "upgrade_list":
        if (!msg.data?.['available']) {
          this.error.handle('No upgrade list data');
          break;
        }
        this.updateSession(session => ({
          ...session,
          upgrades: {
            available: msg.data['available'],
            current: msg.data['current'],
          }
        }));
        break;
      case "session_reset":
        if (!msg.data?.['message']) {
          this.error.handle('No reset data');
          break;
        }
        if (msg.data['message'] === 'success') {
          await this.loadData();
          break;
        }
        this.error.handle('Reset error');
        break;
      case "passive":
        if (!msg.data) {
          this.error.handle('No passive data');
        }
        this.updateSession(session => ({
          ...session,
          dishes: msg.data['dishes'],
          level: {
            rank: msg.data['level_rank'],
            xp: msg.data['level_xp'],
          },
          money: msg.data['money'],
          prestige: {
            ...session.prestige,
            accumulated_value: msg.data['prestige_accumulated']
          }
        }));
        this.level_check();
        break;
      default:
        console.warn('Unknown message data:\n', msg.data);
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
    this.sendWithAuthRetry(request);
  }

  sell() {
    let request = this.buildRequest("sell");
    this.sendWithAuthRetry(request);
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
    if (this.store.session()?.level.rank === 100) {
      return;
    }
    let request = this.buildRequest("level_check");
    this.sendWithAuthRetry(request);
  }

  session_reset() {
    let request = this.buildRequest("session_reset");
    this.sendWithAuthRetry(request);
  }

  private subscribeToWS() {
    this.wsSub?.unsubscribe();

    this.wsSub = this.ws.message
      .pipe(takeUntil(this.store.destroy$))
      .subscribe(msg => this.newMessage(msg));
  }

  private updateSession(
    updater: (session: ISession) => ISession
  ) {
    const session = this.store.session();
    if (!session) {
      this.error.handle('No session data');
      return;
    }

    this.store.session.set(updater(session));
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
