import { Injectable } from '@angular/core';
import { IUser } from '../../../entities/user';
import { BehaviorSubject } from 'rxjs';
import { upgrades } from '../../../entities/types';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerXP: number = 0;
  public playerLvl: number = 5;
  public moneyCount: number = 1000;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;

  selectedMenuType: BehaviorSubject<upgrades> = new BehaviorSubject<upgrades>(
    'menu',
  );

  loadData() {
    //TODO: from api

    this.localSave();
  }

  decreaseMoney(value: number) {
    if (value > this.moneyCount) return;
    //TODO: api
    this.moneyCount -= value;
  }

  selectMenuType(type: upgrades) {
    this.selectedMenuType.next(type);
  }

  private localSave() {
    let userData: IUser = {
      lvl: this.playerLvl,
      money: this.moneyCount,
      dishes: this.dishesCount,
      prestige: this.prestigeLvl,
    };
    let userDataJson = JSON.stringify(userData);
    localStorage.setItem('user', userDataJson);
  }
}
