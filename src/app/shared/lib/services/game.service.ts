import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Upgrade } from '../../../entities/types';
import { GameApiService } from './game-api.service';
import { AuthService } from './auth.service';
import { ILevel, IUpgrade } from '../../../entities/game';
import { WebSocketService } from './web-socket.service';
import { IData } from '../../../entities/api';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public moneyCount: number = 0;
  public dishesCount: number = 0;
  public currentPrestigeLvl: number = 0;
  public accumulatedPrestigeLvl: number = 0;
  public userUpgrades: IUpgrade[] = [];
  public soundEnabled: boolean = true;
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
  private nextLvlXp: number = 0;
  private isLoaded = false;

  private webSocketService = inject(WebSocketService);
  private apiService = inject(GameApiService);
  private authService = inject(AuthService);

  loadData() {
    this.isLoaded = false;
    this.apiService.getGameInit().subscribe(
      (response) => {
        this.moneyCount = response.session.money;
        this.dishesCount = response.session.dishes;
        this.userUpgrades = [];
        this.userUpgrades = response.upgrades;
        this.playerLvl.next(response.session.level);
        this.currentPrestigeLvl = response.session.prestige_value;
        this.accumulatedPrestigeLvl = response.session.prestige.current_value;
        this.soundEnabled = localStorage.getItem('sound')
          ? localStorage.getItem('sound') === 'true'
          : true;
        of(true).subscribe(() => {
          this.getLevelInfo();
          this.getAvailableUpgrades();
          of(true).subscribe(() => {
            this.connect();
            of(true)
              .pipe(delay(500))
              .subscribe(() => {
                this.isLoaded = true;
              });
          });
        });
      },
      (error) => {
        this.handleServerError(error, 'Ошибка загрузки данных');
      },
    );
  }

  handleCook() {
    this.playSound('cook');
    this.apiService.cook().subscribe(
      (response) => {
        this.dishesCount = response.dishes;
        this.updatePlayerXP(response.xp);
      },
      (error) => {
        if (error.status != 400 && error.status != 403) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleSell() {
    this.playSound('sell');
    this.apiService.sell().subscribe(
      (response) => {
        this.moneyCount = response.money;
        this.dishesCount = response.dishes;
        this.updatePlayerXP(response.xp);
      },
      (error) => {
        if (error.status != 400 && error.status != 409) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  handleBuy(upgrade: IUpgrade) {
    if (!upgrade || upgrade.id < 0) return;

    this.playSound('buy');
    this.apiService.buy(upgrade.id).subscribe(
      (response) => {
        this.moneyCount = response.money;
        this.getAvailableUpgrades();
        this.userUpgrades.push(upgrade);
        this.connect();
      },
      (error) => {
        if (error.status === 404) {
          this.handleServerError(error, 'Ошибка синхронизации данных');
        }
      },
    );
  }

  handlePrestige() {
    if (this.accumulatedPrestigeLvl < 1) return;

    this.isLoaded = false;
    this.playSound('prestige');

    of(true)
      .pipe(delay(1100))
      .subscribe(() => {
        this.apiService.prestige().subscribe(
          (response) => {
            window.location.reload();
          },
          (error) => {
            if (error.status != 400) {
              this.handleServerError(error, 'Серверная ошибка');
            }
          },
        );
      });
  }

  setSoundSettings(value: boolean) {
    this.soundEnabled = value;
    localStorage.setItem('sound', value.toString());
  }

  playSound(name: string) {
    if (!this.soundEnabled) return;

    let sound = new Audio('/sounds/' + name + '.mp3');
    sound.load();
    sound.play();
  }

  selectMenuType(type: Upgrade) {
    this.playSound('click');
    this.selectedMenuType.next(type);
  }

  getNextLevelXp() {
    return this.nextLvlXp;
  }

  isGameLoaded(): boolean {
    return this.isLoaded;
  }

  private updateData(data: IData) {
    this.moneyCount = data.money;
    this.dishesCount = data.dishes;
    this.accumulatedPrestigeLvl = data.prestige_current;

    if (this.playerLvl.value.rank === 100) {
      return;
    }

    this.apiService.levelUp().subscribe((response) => {
      this.playerLvl.next({
        rank: response.current_rank,
        xp: response.current_xp,
      });
    });
  }

  private connect() {
    if (this.webSocketService.isConnected) return;

    if (this.userUpgrades.find((u) => u.upgrade_type === 'staff')) {
      this.webSocketService.connect();
      this.webSocketService.data$.subscribe((value) => {
        this.updateData(value);
      });
    }
  }

  private getAvailableUpgrades() {
    this.apiService.getUpgrades().subscribe(
      (response) => {
        this.sessionUpgrades.next(response.upgrades);
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
  }

  private handleServerError(error: any, message?: string) {
    console.error(`[ERROR ${error.status}]: ${error.error.message}`);
    this.authService.logout(message);
  }

  private updatePlayerXP(xp: number) {
    if (xp >= this.nextLvlXp) {
      this.levelUp();
      return;
    }

    this.playerLvl.next({
      rank: this.playerLvl.value.rank,
      xp: xp,
    });
  }

  private levelUp() {
    if (this.playerLvl.value.rank === 100) {
      return;
    }

    this.apiService.levelUp().subscribe(
      (response) => {
        if (this.playerLvl.value.rank < response.current_rank)
          this.playSound('level-up');

        this.playerLvl.next({
          rank: response.current_rank,
          xp: response.current_xp,
        });
        this.getLevelInfo();
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
  }

  private getLevelInfo() {
    this.apiService.getLevelInfo().subscribe(
      (response) => {
        this.playerLvl.next({
          rank: response.current_rank,
          xp: response.current_xp,
        });
        this.nextLvlXp = response.needed_xp;
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
  }
}
