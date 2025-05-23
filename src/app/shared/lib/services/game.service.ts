import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, firstValueFrom, of } from 'rxjs';
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

  async loadData() {
    this.isLoaded = false;

    try {
      const response = await firstValueFrom(this.apiService.getGameInit());

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

      await this.getLevelInfoAsync();
      await this.getAvailableUpgradesAsync();
      await this.connectToWebSocketAsync();

      this.isLoaded = true;
    } catch (error) {
      if (this.isHttpError(error))
        this.handleServerError(error, 'Ошибка загрузки данных');
      else {
        console.error('[ERROR]: ', error);
        this.authService.logout('Непредвиденная ошибка');
      }
    }
  }

  handleCook() {
    this.apiService.cook().subscribe(
      (response) => {
        this.dishesCount = response.dishes;
        this.updatePlayerXP(response.xp);
        this.playSound('cook');
      },
      (error) => {
        if (error.status != 400 && error.status != 403) {
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
        this.updatePlayerXP(response.xp);
        this.playSound('sell');
      },
      (error) => {
        if (error.status != 400 && error.status != 409) {
          this.handleServerError(error, 'Серверная ошибка');
        }
      },
    );
  }

  async handleBuy(upgrade: IUpgrade) {
    if (!upgrade || upgrade.id < 0) return;

    try {
      const response = await firstValueFrom(this.apiService.buy(upgrade.id));

      this.moneyCount = response.money;
      await this.getAvailableUpgradesAsync();
      this.userUpgrades.push(upgrade);

      this.playSound('buy');

      await this.connectToWebSocketAsync();
    } catch (error) {
      if (this.isHttpError(error)) {
        if (error.status === 404) {
          this.handleServerError(error, 'Ошибка синхронизации данных');
        }
      } else {
        console.error('[ERROR]: ', error);
        this.authService.logout('Непредвиденная ошибка');
      }
    }
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

  handleLogout() {
    if (this.webSocketService.isConnected) this.webSocketService.close();
    this.authService.logout();
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

    if (this.playerLvl.value.xp >= this.nextLvlXp) this.levelUp();
  }

  private async connectToWebSocketAsync() {
    if (this.webSocketService.isConnected) return;

    if (this.userUpgrades.find((u) => u.upgrade_type === 'staff')) {
      try {
        await this.webSocketService.connect();
        this.webSocketService.data$.subscribe((value) => {
          this.updateData(value);
        });
      } catch (error) {
        if (this.isHttpError(error))
          this.handleServerError(error, 'Ошибка подключения к серверу');
        else {
          console.error('[ERROR]: ', error);
          this.authService.logout('Непредвиденная ошибка');
        }
      }
    }
  }

  private async getAvailableUpgradesAsync() {
    try {
      const response = await firstValueFrom(this.apiService.getUpgrades());
      await this.sessionUpgrades.next(response.upgrades);
    } catch (error) {
      if (this.isHttpError(error))
        this.handleServerError(error, 'Серверная ошибка');
      else {
        console.error('[ERROR]: ', error);
        this.authService.logout('Непредвиденная ошибка');
      }
    }
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
    if (this.playerLvl.value.rank === 100) return;

    this.apiService.levelUp().subscribe(
      (response) => {
        if (this.playerLvl.value.rank < response.current_rank)
          this.playSound('level-up');

        this.playerLvl.next({
          rank: response.current_rank,
          xp: response.current_xp,
        });

        this.nextLvlXp = response.next_xp;
      },
      (error) => {
        this.handleServerError(error, 'Серверная ошибка');
      },
    );
  }

  private async getLevelInfoAsync() {
    try {
      const response = await firstValueFrom(this.apiService.getLevelInfo());
      this.playerLvl.next({
        rank: response.current_rank,
        xp: response.current_xp,
      });
      this.nextLvlXp = response.needed_xp;
    } catch (error) {
      if (this.isHttpError(error)) {
        this.handleServerError(error, 'Серверная ошибка');
      } else {
        console.error('[ERROR]: ', error);
        this.authService.logout('Непредвиденная ошибка');
      }
    }
  }

  private isHttpError(
    error: unknown,
  ): error is { status: number; error: { message: string } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as any).status === 'number'
    );
  }
}
