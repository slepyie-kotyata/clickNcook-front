import {Injectable, signal} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {SoundService} from './game/sound.service';
import {ErrorService} from './game/error.service';
import {IMessage} from '../../../entities/api';
import {AuthService} from './auth.service';
import {ISession} from '../../../entities/game';
import {firstValueFrom} from 'rxjs';
import {RequestType} from '../../../entities/types';

@Injectable({
  providedIn: 'root',
})
// API сервис для общения с бэкендом
export class ApiService {
  private loaded = signal(false);
  private _session?: ISession;

  constructor(
    private ws: WebSocketService,
    private auth: AuthService,
    private sound: SoundService,
    private error: ErrorService,
  ) {
  }

  // Текущая сессия пользователя
  get Session() {
    return this._session ?? {
      money: 0,
      dishes: 0,
      prestige_value: 0,
      user_id: -1,
      level: {
        rank: 0,
        xp: 0
      },
      prestige: {
        current_value: 0
      },
      user_email: ""
    };
  }

  get isLoaded() {
    return this.loaded();
  }

  // Токен доступа из локального хранилища
  private get token(): string {
    return localStorage.getItem("accessToken") || "";
  }

  // Загрузка данных пользователя и установка соединения по WebSocket
  async loadData() {
    this.loaded.set(false);

    await new Promise(res => setTimeout(res, 30));

    try {
      if (this.ws.connected)
        this.ws.close();

      await this.ws.connect().then(() => {
        this.ws.message.subscribe((msg) => {
          this.newMessage(msg);
        });

        this.update_session();

        this.sound.load();
        this.loaded.set(true);
      });

    } catch (error) {
      this.error.handle(error);
      console.log("error by api service");
    }
  }

  async newMessage(msg: IMessage) {
    console.log("Response from WS:");
    console.log("Action: " + msg.message_type);
    console.log("Data: " + JSON.stringify(msg.data));
  }

  async cook() {
    await this.sendWithAuthRetry(
      this.buildRequest("cook")
    )
  }

  async sell() {
    await this.sendWithAuthRetry(
      this.buildRequest("sell")
    )
  }

  async buy(id: number) {
    await this.sendWithAuthRetry(
      this.buildRequest("upgrade_buy", {upgrade_id: id})
    )
  }

  async list() {
    await this.sendWithAuthRetry(
      this.buildRequest("upgrade_list")
    )
  }

  async update_session() {
    this._session = undefined;
    await this.sendWithAuthRetry(
      this.buildRequest("session")
    )
  }

  async levelUp() {
    await this.sendWithAuthRetry(
      this.buildRequest("level_up")
    )
  }

  async prestige() {
    await this.sendWithAuthRetry(
      this.buildRequest("session_reset")
    )
  }

  // Выход пользователя из системы
  logout() {
    this.ws.close();
    this.auth.logout();
  }

  /* Построение запроса с типом и данными
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

  /* Отправка запроса с повторной аутентификацией при необходимости
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
