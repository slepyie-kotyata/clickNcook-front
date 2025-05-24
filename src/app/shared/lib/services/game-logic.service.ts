import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';
import { delay, of } from 'rxjs';
import { GameApiService } from './game-api.service';

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  constructor(
    private api: GameApiService,
    private session: GameSessionService,
  ) {}

  async cook() {
    this.api.cook().subscribe(
      (response) => {
        this.session.dishesSignal.set(response.dishes);
        this.session.updatePlayerXP(response.xp);
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async sell() {
    this.api.sell().subscribe(
      (response) => {
        this.session.moneySignal.set(response.money);
        this.session.dishesSignal.set(response.dishes);
        this.session.updatePlayerXP(response.xp);
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async prestige() {
    of(true)
      .pipe(delay(1100))
      .subscribe(() => {
        this.api.prestige().subscribe(
          () => {
            window.location.reload();
            return Promise.resolve();
          },
          (error) => {
            return Promise.reject(error);
          },
        );
      });
  }
}
