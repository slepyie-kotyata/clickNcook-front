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
/** API сервис для общения с бэкендом */
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

  /** Возвращает текущую сессию пользователя или заглушку по умолчанию */
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

  /** Флаг загрузки данных, чтобы UI мог реагировать на состояние */
  get isLoaded() {
    return this.loaded();
  }

  /** Токен доступа из локального хранилища */
  private get token(): string {
    return localStorage.getItem("accessToken") || "";
  }

  /**
   Загружает пользовательские данные и открывает WebSocket соединение
   */
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

  /**
   Логирует новое сообщение из WS для отладки
   @param msg - ответ сервера, пришедший по сокету
   */
  async newMessage(msg: IMessage) {
    console.log("Response from WS:");
    console.log("Action: " + msg.message_type);
    console.log("Data: " + JSON.stringify(msg.data));
  }

  /**
   Отправляет событие приготовления блюда на сервер, чтобы обновить прогресс
   */
  async cook() {
    await this.sendWithAuthRetry(
      this.buildRequest("cook")
    )
  }

  /**
   Сообщает серверу о продаже текущих блюд и ожидает обновлённый баланс
   */
  async sell() {
    await this.sendWithAuthRetry(
      this.buildRequest("sell")
    )
  }

  /**
   Покупает улучшение у бэкенда
   @param id - идентификатор апгрейда, который нужно приобрести
   */
  async buy(id: number) {
    await this.sendWithAuthRetry(
      this.buildRequest("upgrade_buy", {upgrade_id: id})
    )
  }

  /**
   Получает свежий список доступных улучшений для отображения в UI
   */
  async list() {
    await this.sendWithAuthRetry(
      this.buildRequest("upgrade_list")
    )
  }

  /**
   Обнуляет локальный кеш сессии и повторно загружает данные у сервера
   */
  async update_session() {
    this._session = undefined;
    await this.sendWithAuthRetry(
      this.buildRequest("session")
    )
  }

  /**
   Запрашивает повышение уровня у сервера и синхронизирует состояние
   */
  async levelUp() {
    await this.sendWithAuthRetry(
      this.buildRequest("level_up")
    )
  }

  /**
   Запускает процедуру престижа с полной синхронизацией прогресса
   */
  async prestige() {
    await this.sendWithAuthRetry(
      this.buildRequest("session_reset")
    )
  }

  /** Выход пользователя из системы */
  logout() {
    this.ws.close();
    this.auth.logout();
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
