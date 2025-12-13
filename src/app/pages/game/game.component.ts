import {Component, HostListener, OnInit} from '@angular/core';
import {MenuComponent} from '../../features/menu/menu.component';
import {ModalComponent} from '../../shared/ui/modal/modal.component';
import {TrackComponent} from '../../shared/ui/locations/track/track.component';
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {CafeComponent} from '../../shared/ui/locations/cafe/cafe.component';
import {RestaurantComponent} from '../../shared/ui/locations/restaurant/restaurant.component';
import {GastroRestaurantComponent} from '../../shared/ui/locations/gastro-restaurant/gastro-restaurant.component';
import {PrestigeWindowComponent} from '../../widgets/prestige-window/prestige-window.component';
import {FinalComponent} from '../../shared/ui/locations/final/final.component';
import {SoundService} from '../../shared/lib/services/game/sound.service';
import {ProfileComponent} from '../../widgets/profile/profile.component';
import {GameHeaderComponent} from '../../widgets/game-header/game-header.component';
import {GameButtonsComponent} from '../../widgets/game-buttons/game-buttons.component';
import {ApiService} from '../../shared/lib/services/api.service';
import {GameStore} from '../../shared/lib/stores/gameStore';
import {LoadingComponent} from '../../shared/ui/loading/loading.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MenuComponent,
    ModalComponent,
    TrackComponent,
    NgIf,
    CafeComponent,
    RestaurantComponent,
    GastroRestaurantComponent,
    PrestigeWindowComponent,
    FinalComponent,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    ProfileComponent,
    GameHeaderComponent,
    GameButtonsComponent,
    LoadingComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  protected logoutWindowToggle: boolean = false;
  protected showResolutionWarning: boolean = false;
  protected prestigeWindowToggle: boolean = false;
  protected profileWindowToggle: boolean = false;
  protected showVolumeSlider = false;
  protected showMobileUpgrades = false;
  protected volumeHideTimeout: any = null;
  protected isClosingVolumeSlider = false;

  constructor(
    protected sound: SoundService,
    protected api: ApiService,
    protected store: GameStore,
  ) {
  }

  protected get locationConfig(): {
    component: string;
    imgSrc?: string;
    imgClass?: string;
  } {
    const rank = this.store.session()?.level.rank ?? 0;
    if (rank < 10) {
      return {
        component: 'track',
        imgSrc: '/locations/track/sauces.svg',
        imgClass: 'w-[312px]',
      };
    }
    if (rank < 20) {
      return {
        component: 'cafe',
        imgSrc: '/locations/cafe/Cat.svg',
        imgClass: 'w-[350px]',
      };
    }
    if (rank < 40) {
      return {component: 'restaurant'};
    }
    if (rank < 70) {
      return {component: 'gastro'};
    }
    return {component: 'final'};
  }

  ngOnInit(): void {
    this.api.loadData();
  }

  protected toggleModal(
    type: 'profile' | 'logout' | 'prestige',
    value: boolean,
  ): void {
    this.sound.play('click');
    switch (type) {
      case 'logout':
        this.logoutWindowToggle = value;
        break;
      case 'prestige':
        this.prestigeWindowToggle = value;
        break;
      case 'profile':
        this.profileWindowToggle = value;
        break;
    }
  }

  protected async handleCook() {
    if (!this.store.session()?.upgrades.current.find((u) => u.upgrade_type === 'dish'))
      return;

    this.api.cook();
  }

  protected async handleSell() {
    if ((this.store.session()?.dishes ?? 0) <= 0) return;

    this.api.sell();
  }

  protected toggleVolumeSlider() {
    this.sound.play('click');

    if (this.showVolumeSlider && !this.isClosingVolumeSlider) {
      this.isClosingVolumeSlider = true;
      clearTimeout(this.volumeHideTimeout);
      setTimeout(() => {
        this.showVolumeSlider = false;
        this.isClosingVolumeSlider = false;
      }, 180);
      return;
    }

    this.showVolumeSlider = true;
    this.isClosingVolumeSlider = false;
    this.resetVolumeCloseTimer();
  }

  protected resetVolumeCloseTimer() {
    clearTimeout(this.volumeHideTimeout);
    this.volumeHideTimeout = setTimeout(() => {
      this.isClosingVolumeSlider = true;
      setTimeout(() => {
        this.showVolumeSlider = false;
        this.isClosingVolumeSlider = false;
      }, 180);
    }, 2500);
  }

  protected onVolumeChange(event: any) {
    const volume = +event.target.value;
    this.sound.setVolume(volume);
  }

  protected toggleMobileUpgrades(value: boolean) {
    this.sound.play('click');
    this.showMobileUpgrades = value;
  }

  protected logout() {
    this.sound.play('click');
    this.api.logout();
  }

  @HostListener('window:load', ['$event'])
  @HostListener('window:resize', ['$event'])
  protected onResize(event?: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    this.showResolutionWarning =
      width < 1524 || height < 768 || aspectRatio < 16 / 10;
  }
}
