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
        this.userUpgrades.push({
          id: 0,
          name: 'Сэндвич',
          icon_name: 'sandwich',
          upgrade_type: 'dish',
          price: 0,
          access_level: 0,
          boost: {
            id: 0,
            boost_type: 'mPc',
            value: 1,
          },
        });
        let user = {
          id: response.session.user_id,
          lvl: this.playerLvl.value,
          money: response.session.money,
          dishes: response.session.dishes,
          prestige: this.prestigeLvl,
        };
        let userJSON = JSON.stringify(user);
        localStorage.setItem('user', userJSON);
        console.log(this.userUpgrades);
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
  }

  handleCook() {
    this.apiService.cook().subscribe(
      (response) => {
        this.dishesCount = response.dishes;
      },
      (error) => {
        if (error.error.code != 400) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleSell() {
    this.apiService.sell().subscribe(
      (response) => {
        this.moneyCount = response.money;
        this.dishesCount = response.dishes;
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
  }

  handleServerError(error: any, message?: string) {
    if (message) this.toastr.error(message);
    console.error(error.error.message);
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
