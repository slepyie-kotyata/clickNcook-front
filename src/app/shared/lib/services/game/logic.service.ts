import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {delay} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для игровой логики, такой как готовка, продажа и престиж
 * @deprecated будет удален в пользу ApiService и WebSocket
 */
export class LogicService {
  constructor(
    private api: ApiService,
    private session: SessionService,
  ) {
  }

  /**
   Оповещает сервер о готовке блюд, чтобы начислить награды
   @returns Promise<void>
   @deprecated будет удален в пользу ApiService и WebSocket
   */
  async cook() {
    try {
      // const response = await firstValueFrom(this.api.cook());
      // this.session.dishesSignal.set(response.dishes);
      // await this.session.updatePlayerXP(response.xp);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   Сообщает серверу о продаже блюд и синхронизирует ресурсы
   @returns Promise<void>
   @deprecated будет удален в пользу ApiService и WebSocket
   */
  async sell() {
    try {
      // const response = await firstValueFrom(this.api.sell());
      // this.session.moneySignal.set(response.money);
      // this.session.dishesSignal.set(response.dishes);
      // await this.session.updatePlayerXP(response.xp);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   Инициирует процедуру престижа и перезагружает окно игры
   @returns Promise<void>
   @deprecated будет удален в пользу ApiService и WebSocket
   */
  async prestige() {
    try {
      // await firstValueFrom(this.api.reset());
      await delay(1100);
      window.location.reload();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
