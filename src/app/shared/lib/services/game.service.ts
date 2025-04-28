import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Upgrade } from '../../../entities/types';
import { GameApiService } from './game-api.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { ILevel, IUpgrade } from '../../../entities/game';

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
  playerLvl: BehaviorSubject<ILevel> = new BehaviorSubject<ILevel>({
    rank: 0,
    xp: 0,
  });
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
        this.userUpgrades = response.upgrades;
        this.playerLvl.next(response.session.level);
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
        this.sessionUpgrades.next(response.upgrades);
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
        this.moneyCount = response.money;
        this.getAvailableUpgrades();
        this.userUpgrades.push(upgrade);
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

  selectMenuType(type: Upgrade) {
    this.selectedMenuType.next(type);
  }

  isGameLoaded(): boolean {
    return this.isLoaded;
  }
}
