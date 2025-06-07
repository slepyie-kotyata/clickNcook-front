import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { delay, firstValueFrom } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  constructor(
    private api: ApiService,
    private session: SessionService,
  ) {}

  async cook() {
    try {
      const response = await firstValueFrom(this.api.cook());
      this.session.dishesSignal.set(response.dishes);
      await this.session.updatePlayerXP(response.xp);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sell() {
    try {
      const response = await firstValueFrom(this.api.sell());
      this.session.moneySignal.set(response.money);
      this.session.dishesSignal.set(response.dishes);
      await this.session.updatePlayerXP(response.xp);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async prestige() {
    try {
      await firstValueFrom(this.api.prestige());
      await delay(1100);
      window.location.reload();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
