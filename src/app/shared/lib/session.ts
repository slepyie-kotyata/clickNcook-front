import {Injectable, signal} from '@angular/core';
import {ILevel, ISession, IUpgrade} from '../../entities/game';

@Injectable({
  providedIn: 'root',
})
export class Session {
  private moneySignal = signal(0);
  private dishesSignal = signal(0);
  private xpSignal = signal(0);
  private levelSignal = signal<ILevel>({rank: 0, xp: 0});
  private prestigeLevelSignal = signal(0);
  private accumulatedPrestigeLvlSignal = signal(0);
  private userUpgradesSignal = signal<IUpgrade[]>([]);
  private sessionUpgradesSignal = signal<IUpgrade[]>([]);

  get money() {
    return this.moneySignal;
  }

  get dishes() {
    return this.dishesSignal;
  }

  get upgrades() {
    return this.userUpgradesSignal;
  }

  get sessionUpgrades() {
    return this.sessionUpgradesSignal;
  }

  get level() {
    return this.levelSignal;
  }

  get prestige() {
    return this.prestigeLevelSignal;
  }

  get accumulatedPrestige() {
    return this.accumulatedPrestigeLvlSignal;
  }

  setupSession(data: ISession) {
    this.moneySignal.set(data.money);
    this.dishesSignal.set(data.dishes);
    this.xpSignal.set(data.prestige_value);
    this.levelSignal.set(data.level);
    this.prestigeLevelSignal.set(data.prestige.current_value);
    this.accumulatedPrestigeLvlSignal.set(0); // This value is not provided in ISession, set to 0 or modify as needed
    this.userUpgradesSignal.set([]); // This value is not provided in ISession, set to empty array or modify as needed
    this.sessionUpgradesSignal.set([]); // This value is not provided in ISession, set to empty array or modify as needed
  }
}
