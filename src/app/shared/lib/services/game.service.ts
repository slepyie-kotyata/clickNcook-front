import { inject, Injectable } from '@angular/core';
import { IUser } from '../../../entities/user';
import { BehaviorSubject } from 'rxjs';
import { upgrades } from '../../../entities/types';
import { GameApiService } from './game-api.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerXP: number = 0;
  public playerLvl: number = 120;
  public moneyCount: number = 0;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;

  selectedMenuType: BehaviorSubject<upgrades> = new BehaviorSubject<upgrades>(
    'menu',
  );

  private apiService = inject(GameApiService);

  loadData() {
    this.apiService.getGameInit().subscribe((response) => {
      this.moneyCount = response.session.Money;
      console.log(response.session);
    });

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
