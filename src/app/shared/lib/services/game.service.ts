import { inject, Injectable } from '@angular/core';
import { IUser } from '../../../entities/user';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { upgrades } from '../../../entities/types';
import { ITokens } from '../../../entities/tokens';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerXP: number = 0;
  public playerLvl: number = 0;
  public moneyCount: number = 0;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;

  selectedMenuType: BehaviorSubject<upgrades> = new BehaviorSubject<upgrades>(
    'menu',
  );

  private readonly api = import.meta.env.NG_APP_API;
  private httpClient = inject(HttpClient);

  private tokenSubject = new BehaviorSubject<{
    status: number;
    tokens: ITokens;
  } | null>(null);

  loadData() {
    this.getGameInit().subscribe((response) => {
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

  getGameInit(): Observable<{
    session: { ID: number; Money: number; Dishes: []; UserID: number };
    status: number;
  }> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.httpClient.get<{
          session: { ID: number; Money: number; Dishes: []; UserID: number };
          status: number;
        }>(this.api + 'game/init', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });
      }),
    );
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
