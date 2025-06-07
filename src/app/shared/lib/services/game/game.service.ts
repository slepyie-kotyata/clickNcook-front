import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Upgrade } from '../../../../entities/types';
import { AuthService } from '../auth.service';
import { LogicService } from './logic.service';
import { SessionService } from './session.service';
import { SoundService } from './sound.service';
import { ErrorService } from './error.service';
import { PassiveLogicService } from './passive-logic.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private selectedMenuType: BehaviorSubject<Upgrade> =
    new BehaviorSubject<Upgrade>('dish');
  private authService = inject(AuthService);
  private loaded = signal(false);

  constructor(
    private logic: LogicService,
    private session: SessionService,
    private passive: PassiveLogicService,
    private sound: SoundService,
    private error: ErrorService,
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
      await this.passive.connectToWebSocketAsync();
      this.session.levelUp$.subscribe(() => {
        this.sound.play('level-up');
      });
      this.sound.load();
      this.loaded.set(true);
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
    if (this.passive.connectedToSocket) this.passive.closeSocket();
    this.authService.logout();
  }

  selectMenuType(type: Upgrade) {
    if (type === this.selectedMenuType.value) return;

    this.sound.play('click');
    this.selectedMenuType.next(type);
  }
}
