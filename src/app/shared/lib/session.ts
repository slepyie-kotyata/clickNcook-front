import {Injectable, signal} from '@angular/core';
import {ILevel, IUpgrade} from '../../entities/game';

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

  get money(){
    return this.moneySignal;
  }

  get dishes(){
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
}
