import { inject, Injectable } from '@angular/core';
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
    'dish',
  );

  private apiService = inject(GameApiService);

  loadData() {
    this.apiService.getGameInit().subscribe((response) => {
      this.moneyCount = response.session.money;
      let user = {
        id: response.session.id,
        user_id: response.session.user_id,
        lvl: this.playerLvl,
        money: this.moneyCount,
        dishes: this.dishesCount,
        prestige: this.prestigeLvl,
      };
      let userJSON = JSON.stringify(user);
      localStorage.setItem('user', userJSON);
      console.log(response.session);
    });
  }

  decreaseMoney(value: number) {
    if (value > this.moneyCount) return;
    //TODO: api
    this.moneyCount -= value;
  }

  selectMenuType(type: upgrades) {
    this.selectedMenuType.next(type);
  }
}
