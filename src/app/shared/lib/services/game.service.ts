import { Injectable } from '@angular/core';
import { IUser } from '../../../entities/user';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerLvl: number = 0;
  public moneyCount: number = 1000;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;

  loadData() {
    //TODO: from api

    this.localSave();
  }

  decreaseMoney(value: number) {
    if (value > this.moneyCount) return;
    //TODO: api
    this.moneyCount -= value;
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
