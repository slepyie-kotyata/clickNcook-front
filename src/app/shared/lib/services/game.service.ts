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
  public userUpgrades: IUpgrade[] = [];
  public sessionUpgrades: BehaviorSubject<IUpgrade[]> = new BehaviorSubject<
    IUpgrade[]
  >([]);
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
        this.userUpgrades = [];
        response.upgrades?.forEach((u) => this.userUpgrades.push(u.upgrade));
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
    this.getAvailableUpgrades();
  }

  getAvailableUpgrades() {
    this.apiService.getUpgrades().subscribe(
      (response) => {
        let upgrades: IUpgrade[] = [];
        response.upgrades.forEach((u) => upgrades.push(u.upgrade));
        this.sessionUpgrades.next(upgrades);
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
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

  handleBuy(upgrade: IUpgrade) {
    if (!upgrade || upgrade.id < 0) return;
    this.apiService.buy(upgrade.id).subscribe(
      (response) => {
        if (response.status === 0) {
          this.userUpgrades.push(upgrade);
          this.getAvailableUpgrades();
          this.decreaseMoney(upgrade.price * upgrade.price_factor);
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
