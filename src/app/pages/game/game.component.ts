import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game.service';
import { TrackComponent } from '../../shared/ui/locations/track/track.component';
import { NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';
import { CafeComponent } from '../../shared/ui/locations/cafe/cafe.component';
import { RestaurantComponent } from '../../shared/ui/locations/restaurant/restaurant.component';
import { GastroRestaurantComponent } from '../../shared/ui/locations/gastro-restaurant/gastro-restaurant.component';
import { PrestigeWindowComponent } from '../../widgets/prestige-window/prestige-window.component';
import { FinalComponent } from '../../shared/ui/locations/final/final.component';
import { GameSessionService } from '../../shared/lib/services/game-session.service';
import { GameSoundService } from '../../shared/lib/services/game-sound.service';
import { ProfileComponent } from '../../widgets/profile/profile.component';

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
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  protected gameService = inject(GameService);
  protected session = inject(GameSessionService);
  protected logoutWindowToggle: boolean = false;
  protected showResolutionWarning: boolean = false;
  protected prestigeWindowToggle: boolean = false;
  protected profileWindowToggle: boolean = false;
  protected sound = inject(GameSoundService);
  protected showLevelUpNotification: boolean = false;
  protected showVolumeSlider = false;

  protected get playerLvlPercentage(): number {
    let percentage = parseFloat(
      (
        (this.session.levelSignal().xp / this.session.nextLevelXp) *
        100
      ).toFixed(1),
    );

    return percentage > 0 ? percentage : 0;
  }

  protected get prestige(): string {
    return formatNumber(this.session.prestigeSignal());
  }

  protected get locationConfig(): {
    component: string;
    imgSrc?: string;
    imgClass?: string;
  } {
    const rank = this.levelRank;
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

  protected get levelRank(): number {
    return this.session.levelSignal().rank;
  }

  protected get isGameLoaded(): boolean {
    return this.gameService.isLoaded;
  }

  ngOnInit(): void {
    this.gameService.loadData().then(() => {
      this.onResize();

      this.session.levelUp$.subscribe(() => {
        this.showLevelUpNotification = true;

        setTimeout(() => {
          this.showLevelUpNotification = false;
        }, 3000);
      });
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

  protected handleCook(): void {
    if (!this.session.upgradesSignal().find((u) => u.upgrade_type === 'dish'))
      return;

    this.gameService.handleCook();
  }

  protected handleSell(): void {
    if (this.session.dishesSignal() <= 0) return;

    this.gameService.handleSell();
  }

  protected toggleVolumeSlider() {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  protected onVolumeChange(event: any) {
    const volume = +event.target.value;
    this.sound.setVolume(volume);
  }

  protected logout() {
    this.gameService.handleLogout();
  }

  @HostListener('window:load', ['$event'])
  @HostListener('window:resize', ['$event'])
  protected onResize(event?: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    this.showResolutionWarning =
      width < 1024 || height < 768 || aspectRatio < 16 / 10;
  }
}
