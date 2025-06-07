import { Injectable } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { SessionService } from './session.service';
import { IData } from '../../../../entities/api';

@Injectable({
  providedIn: 'root',
})
export class PassiveLogicService {
  constructor(
    private ws: WebSocketService,
    private session: SessionService,
  ) {}

  get connectedToSocket() {
    return this.ws.connected;
  }

  async connectToWebSocketAsync() {
    if (this.connectedToSocket) return;

    try {
      await this.ws.connect();
      this.ws.data.subscribe((value) => {
        this.updateData(value);
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateData(data: IData) {
    this.session.moneySignal.set(data.money);
    this.session.dishesSignal.set(data.dishes);
    await this.session.updatePlayerXP(data.xp);
    this.session.accumulatedPrestigeSignal.set(data.prestige_current);
  }

  closeSocket() {
    this.ws.close();
  }
}
