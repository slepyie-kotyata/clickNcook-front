import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { GameApiService } from './game-api.service';
import { ILevel, IUpgrade } from '../../../entities/game';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  private money = signal(0);
  private dishes = signal(0);
  private xp = signal(0);
  private level = signal<ILevel>({ rank: 0, xp: 0 });
  private prestigeLevel = signal(0);
  private accumulatedPrestigeLvl = signal(0);
  private userUpgrades = signal<IUpgrade[]>([]);
  private sessionUpgrades = signal<IUpgrade[]>([]);

  constructor(
    private auth: AuthService,
    private api: GameApiService,
  ) {}

  get moneySignal() {
    return this.money;
  }

  get dishesSignal() {
    return this.dishes;
  }

  get upgradesSignal() {
    return this.userUpgrades;
  }

  get sessionUpgradesSignal() {
    return this.sessionUpgrades;
  }

  get levelSignal() {
    return this.level;
  }

  get nextLevelSignal() {
    return this.xp();
  }

  get prestigeSignal() {
    return this.prestigeLevel;
  }

  get accumulatedPrestigeSignal() {
    return this.accumulatedPrestigeLvl;
  }

  async loadData() {
    try {
      const response = await firstValueFrom(this.api.init);

      this.money.set(response.session.money);
      this.dishes.set(response.session.dishes);
      this.userUpgrades.set(response.upgrades);
      this.level.set(response.session.level);
      this.prestigeLevel.set(response.session.prestige_value);
      this.accumulatedPrestigeLvl.set(response.session.prestige.current_value);

      await this.getLevelInfoAsync();
      await this.getAvailableUpgradesAsync();

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async handleBuy(upgrade: IUpgrade) {
    if (!upgrade || upgrade.id < 0) return;

    try {
      const response = await firstValueFrom(this.api.buy(upgrade.id));

      this.money.set(response.money);
      await this.getAvailableUpgradesAsync();
      this.userUpgrades.update((u) => [...u, upgrade]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updatePlayerXP(xp: number) {
    if (xp >= this.xp()) {
      await this.levelUp();
      return Promise.resolve();
    }

    this.level.set({
      rank: this.level().rank,
      xp: xp,
    });
    return Promise.resolve();
  }

  async levelUp() {
    if (this.level().rank === 100) return;

    this.api.levelUp().subscribe(
      (response) => {
        this.level.set({
          rank: response.current_rank,
          xp: response.current_xp,
        });

        this.xp.set(response.next_xp);
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async getLevelInfoAsync() {
    try {
      const response = await firstValueFrom(this.api.level);
      this.level.set({
        rank: response.current_rank,
        xp: response.current_xp,
      });
      this.xp.set(response.needed_xp);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async getAvailableUpgradesAsync() {
    try {
      const response = await firstValueFrom(this.api.upgrades);
      this.sessionUpgrades.set(response.upgrades);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
