import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Upgrade } from '../../../entities/types';
import { AuthService } from './auth.service';
import { IUpgrade } from '../../../entities/game';
import { GameLogicService } from './game-logic.service';
import { GameSessionService } from './game-session.service';
import { GameSoundService } from './game-sound.service';
import { GameErrorService } from './game-error.service';
import { GameWebSocketService } from './game-web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private selectedMenuType: BehaviorSubject<Upgrade> =
    new BehaviorSubject<Upgrade>('dish');
  private authService = inject(AuthService);
  private loaded = signal(false);

  constructor(
    private logic: GameLogicService,
    private session: GameSessionService,
    private ws: GameWebSocketService,
    private sound: GameSoundService,
    private error: GameErrorService,
  ) {}

  get menu() {
    return this.selectedMenuType;
  }

  get isLoaded() {
    return this.loaded();
  }

  async loadData() {
    this.loaded.set(false);
    try {
      await this.session.loadData();
      await this.ws.connectToWebSocketAsync();
      this.session.levelUp$.subscribe(() => {
        this.sound.play('level-up');
      });
      this.sound.load();
      this.loaded.set(true);
    } catch (error) {
      this.error.handle(error);
    }
  }

  async handleCook() {
    try {
      await this.logic.cook();
      this.sound.play('cook');
    } catch (error) {
      this.error.handle(error);
    }
  }

  async handleSell() {
    try {
      await this.logic.sell();
      this.sound.play('sell');
    } catch (error) {
      this.error.handle(error);
    }
  }

  async handleBuy(upgrade: IUpgrade) {
    try {
      await this.session.handleBuy(upgrade);
      this.sound.play('buy');
    } catch (error) {
      this.error.handle(error);
    }
  }

  async handlePrestige() {
    if (this.session.accumulatedPrestigeSignal() < 1) return;

    try {
      this.sound.play('prestige');
      this.loaded.set(false);
      await this.logic.prestige();
    } catch (error) {
      this.error.handle(error);
    }
  }

  handleLogout() {
    if (this.ws.connected) this.ws.close();
    this.authService.logout();
  }

  selectMenuType(type: Upgrade) {
    if (type === this.selectedMenuType.value) return;

    this.sound.play('click');
    this.selectedMenuType.next(type);
  }
}
