import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
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
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs'; 

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
  protected sound = inject(GameSoundService);
  private levelSub?: Subscription;
  private previousLevel: number = 0;
  protected showLevelUpNotification: boolean = false;

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

  protected levelSignal = this.session.levelSignal(); 

ngOnInit(): void {
  this.gameService.loadData().then(() => {
    this.onResize();

    this.previousLevel = this.session.levelSignal().rank; 

    setInterval(() => {
      const currentLevel = this.session.levelSignal().rank;
      if (currentLevel > this.previousLevel) {
        this.checkLevelIncrease();
        this.previousLevel = currentLevel;
      }
    }, 500);
  });
}


ngOnDestroy(): void {
  this.levelSub?.unsubscribe();
}

  protected toggleModal(type: 'logout' | 'prestige', value: boolean): void {
    this.sound.play('click');
    if (type === 'logout') this.logoutWindowToggle = value;
    else this.prestigeWindowToggle = value;
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

  protected toggleSound() {
    this.sound.toggle();
  }

  protected logout() {
    this.gameService.handleLogout();
  }

  private checkLevelIncrease(): void {
  this.showLevelUpNotification = true;

  setTimeout(() => {
    this.showLevelUpNotification = false;
  }, 3000);
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
