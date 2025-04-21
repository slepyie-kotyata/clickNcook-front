import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Upgrade} from '../../../entities/types';
import {GameApiService} from './game-api.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerXP: number = 0;
  public moneyCount: number = 0;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;

  selectedMenuType: BehaviorSubject<Upgrade> = new BehaviorSubject<Upgrade>(
    'dish',
  );

  playerLvl: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
    });
  }

  decreaseMoney(value: number) {
    if (value > this.moneyCount) return;
    //TODO: api
    this.moneyCount -= value;
  }

  selectMenuType(type: Upgrade) {
    this.selectedMenuType.next(type);
  }

  levelUp() {
    //TODO: get from API
    this.playerLvl.next(this.playerLvl.getValue() + 1);
  }
}
