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
      if (!this.ws.connected) {
        this.subscribeToWS();
        await this.ws.connect();
      }
      this.store.session.set(null);
      await this.sendWithAuthRetry(this.ws.sessionRequest);
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
        if (msg.data?.['message'] && (msg.data?.['message'] != "token invalid" || msg.data?.['message'] != "missing token")) {
          this.error.handle(msg.data ? msg.data['message'] : 'Unknown error from server');
        }
        break;
      case "session":
        if (!msg.data?.['session']) {
          this.error.handle('No session data');
          break;
        }
        this.store.session.set(msg.data['session']);
        await this.level_check().then(() => {
          this.store.isLoaded.set(true);
        });
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
        await this.level_check();
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
        await this.level_check();
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
        await this.level_check();
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
        await this.level_check();
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
        this.store.awaitingListSync.set(new Set());
        break;
      case "session_reset":
        if (!msg.data?.['message']) {
          this.error.handle('No reset data');
          break;
        }
        if (msg.data['message'] === 'success') {
          setTimeout(() => {
          }, 1000);
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
        await this.level_check();
        break;
      default:
        console.warn('Unknown message data:\n', msg.data);
    }
  }

  /** Выход пользователя из системы */
  logout(reason?: string) {
    this.store.isLoaded.set(false);
    this.ws.close();
    this.auth.logout(reason);
  }

  cook() {
    const request = this.buildRequest("cook");
    this.sendWithAuthRetry(request);
  }

  sell() {
    const request = this.buildRequest("sell");
    this.sendWithAuthRetry(request);
  }

  async upgrade_buy(id: number) {
    if (this.store.isUpgradeBlocked(id)) return;

    this.store.buyInFlight.update(s => new Set(s).add(id));

    try {
      await this.sendWithAuthRetry(this.buildRequest("upgrade_buy", {id}));

      this.store.buyInFlight.update(s => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });

      this.store.awaitingListSync.update(s => new Set(s).add(id));

    } catch (e) {
      this.store.buyInFlight.update(s => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      throw e;
    }
  }

  upgrade_list() {
    const request = this.buildRequest("upgrade_list");
    this.sendWithAuthRetry(request);
  }

  level_up() {
    const request = this.buildRequest("level_up");
    this.sendWithAuthRetry(request);
  }

  async level_check() {
    if (this.store.session()?.level.rank === 100) {
      console.warn("Max level reached, skipping level check");
      return;
    }
    const request = this.buildRequest("level_check");
    return await this.sendWithAuthRetry(request);
  }

  async session_reset() {
    const request = this.buildRequest("session_reset");
    this.store.startPending("session_reset");
    try {
      await this.sendWithAuthRetry(request);
    } finally {
      this.store.stopPending("session_reset");
    }
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

  private async tryRefreshAndRetry<T = any>(
    request: IMessage
  ): Promise<{ response: T; requestId: string }> {
    try {
      const data = await firstValueFrom(this.auth.refreshToken());

      localStorage.setItem("accessToken", data.tokens.access_token);
      localStorage.setItem("refreshToken", data.tokens.refresh_token);

      request.data.token = data.tokens.access_token;

      return await this.ws.sendRequest<T>(request);

    } catch (err) {
      throw err;
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
  private async sendWithAuthRetry(request: IMessage): Promise<{ response: IMessage; requestId: string }> {
    try {
      return await this.ws.sendRequest(request);

    } catch (error: any) {
      if (error !== 'token invalid' && error !== 'missing token') {
        throw error;
      }

      try {
        return await this.tryRefreshAndRetry(request);

      } catch (refreshErr) {
        this.logout("Время сессии истекло");
        throw refreshErr;
      }
    }
  }

}
