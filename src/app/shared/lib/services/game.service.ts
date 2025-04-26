import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Upgrade } from '../../../entities/types';
import { GameApiService } from './game-api.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { IUpgrade } from '../../../entities/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public playerXP: number = 0;
  public moneyCount: number = 0;
  public dishesCount: number = 0;
  public prestigeLvl: number = 0;
  public sessionUpgrades: IUpgrade[] = [];
  public userUpgrades: IUpgrade[] = [];
  selectedMenuType: BehaviorSubject<Upgrade> = new BehaviorSubject<Upgrade>(
    'dish',
  );
  playerLvl: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private isLoaded = false;

  private apiService = inject(GameApiService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  loadData() {
    this.isLoaded = false;
    this.apiService.getGameInit().subscribe(
      (response) => {
        this.moneyCount = response.session.money;
        this.dishesCount = response.session.dishes;
        this.userUpgrades = response.session.upgrades;
        let user = {
          id: response.session.user_id,
          lvl: this.playerLvl.value,
          money: response.session.money,
          dishes: response.session.dishes,
          prestige: this.prestigeLvl,
        };
        let userJSON = JSON.stringify(user);
        localStorage.setItem('user', userJSON);
        of(true)
          .pipe(delay(1000))
          .subscribe(() => {
            this.isLoaded = true;
          });
      },
      (error) => {
        this.handleServerError(error, 'Ошибка загрузки данных');
      },
    );
    this.sessionUpgrades = [];
  }

  handleCook(count: number) {
    this.apiService.cook(count).subscribe(
      (response) => {
        this.dishesCount = response.dishes;
      },
      (error) => {
        if (error.error.code != 400 && error.error.code != 403) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleSell(count: number) {
    this.apiService.sell(count).subscribe(
      (response) => {
        this.moneyCount = response.money;
        this.dishesCount = response.dishes;
      },
      (error) => {
        if (error.error.code != 400) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleBuy(id: number) {
    if (id < 0) return;
    this.apiService.buy(id).subscribe(
      (response) => {
        if (response.status === 0) {
          let new_upgrade = this.sessionUpgrades.find((u) => u.id === id);
          if (new_upgrade) {
            this.userUpgrades.push(new_upgrade);
            this.sessionUpgrades = this.sessionUpgrades.filter(
              (u) => u.id != id,
            );
            this.decreaseMoney(new_upgrade.price);
          }
        }
      },
      (error) => {
        if (error.error.code === 404) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleServerError(error: any, message?: string) {
    if (message) this.toastr.error(message);
    console.error('[ERROR ', error.error.code, ']: ', error.error.message);
    this.authService.logout();
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

  isGameLoaded(): boolean {
    return this.isLoaded;
  }
}
