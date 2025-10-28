import { Component, computed, HostListener, OnInit } from '@angular/core';
import { MenuComponent } from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game/game.service';
import { TrackComponent } from '../../shared/ui/locations/track/track.component';
import { NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';
import { CafeComponent } from '../../shared/ui/locations/cafe/cafe.component';
import { RestaurantComponent } from '../../shared/ui/locations/restaurant/restaurant.component';
import { GastroRestaurantComponent } from '../../shared/ui/locations/gastro-restaurant/gastro-restaurant.component';
import { PrestigeWindowComponent } from '../../widgets/prestige-window/prestige-window.component';
import { FinalComponent } from '../../shared/ui/locations/final/final.component';
import { SessionService } from '../../shared/lib/services/game/session.service';
import { SoundService } from '../../shared/lib/services/game/sound.service';
import { ProfileComponent } from '../../widgets/profile/profile.component';
import { GameHeaderComponent } from '../../widgets/game-header/game-header.component';
import { GameButtonsComponent } from '../../widgets/game-buttons/game-buttons.component';
import { LogicService } from '../../shared/lib/services/game/logic.service';
import { ErrorService } from '../../shared/lib/services/game/error.service';
import {ApiService} from '../../shared/lib/services/api.service';
import {AuthService} from '../../shared/lib/services/auth.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MenuComponent,
    ModalComponent,
    TrackComponent,
    NgIf,
    LoadingComponent,
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
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  protected logoutWindowToggle: boolean = false;
  protected showResolutionWarning: boolean = false;
  protected prestigeWindowToggle: boolean = false;
  protected profileWindowToggle: boolean = false;
  protected showLevelUpNotification: boolean = false;
  protected showVolumeSlider = false;
  protected isCooking = false;
  protected isSelling = false;
  protected readonly prestige = computed(() =>
    formatNumber(this.api.Session.prestige()),
  );
  protected readonly playerLvlPercentage = computed(() => {
    const xp = this.api.Session.level().xp;
    // const next = this.api.Session.nextLevelXp;
    return +Math.max((xp / 100) * 100, 0).toFixed(1);
  });

  constructor(
    protected sound: SoundService,
    protected api: ApiService,
    private auth: AuthService,
    private error: ErrorService,
  ) {}

  protected get locationConfig(): {
    component: string;
    imgSrc?: string;
    imgClass?: string;
  } {
    const rank = this.api.Session.level().rank;
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
      return { component: 'restaurant' };
    }
    if (rank < 70) {
      return { component: 'gastro' };
    }
    return { component: 'final' };
  }

  ngOnInit(): void {
    this.api.loadData().then(() => {
      this.onResize();

      // this.api.Session.levelUp$.subscribe(() => {
      //   this.showLevelUpNotification = true;
      //
      //   setTimeout(() => {
      //     this.showLevelUpNotification = false;
      //   }, 3000);
      // });
    });
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
    if (!this.api.Session.upgrades().find((u) => u.upgrade_type === 'dish'))
      return;

    this.isCooking = true;
    try {
      this.api.cook();
      this.sound.play('cook');
    } catch (error) {
      this.error.handle(error);
    }
    this.isCooking = false;
  }

  protected async handleSell() {
    if (this.api.Session.dishes() <= 0) return;

    this.isSelling = true;
    try {
      this.api.sell();
      this.sound.play('sell');
    } catch (error) {
      this.error.handle(error);
    }
    this.isSelling = false;
  }

  protected toggleVolumeSlider() {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  protected onVolumeChange(event: any) {
    const volume = +event.target.value;
    this.sound.setVolume(volume);
  }

  protected logout() {
    this.auth.logout();
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
