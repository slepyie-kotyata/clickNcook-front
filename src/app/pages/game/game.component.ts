import {Component, effect, HostListener, OnInit} from '@angular/core';
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
import {TutorialAnchorDirective} from '../../shared/lib/tutorial-anchor.directive';
import {TutorialService} from '../../shared/lib/services/tutorial.service';
import {TutorialOverlayComponent} from '../../widgets/tutorial-overlay/tutorial-overlay.component';
import {TutorialAnchorRegistry} from '../../shared/lib/tutorial-anchor.registry';
import {GameService} from '../../shared/lib/services/game/game.service';

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
    TutorialAnchorDirective,
    TutorialOverlayComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  protected logoutWindowToggle: boolean = false;
  protected showResolutionWarning: boolean = false;
  protected showVolumeSlider = false;
  protected showMobileUpgrades = false;
  protected volumeHideTimeout: any = null;
  protected isClosingVolumeSlider = false;

  protected tutorialOverlayX = 0;
  protected tutorialOverlayY = 0;
  protected highlightX = 0;
  protected highlightY = 0
  protected highlightW = 0;
  protected highlightH = 0;
  private lastStepId: string | null = null;

  constructor(
    protected sound: SoundService,
    protected api: ApiService,
    protected gameService: GameService,
    protected store: GameStore,
    protected tutorial: TutorialService,
    private anchorRegistry: TutorialAnchorRegistry,
  ) {
    effect(() => {
      const step = this.tutorial.currentStep();
      if (!step) return;

      if (this.lastStepId !== step.id) {
        this.lastStepId = step.id;

        this.highlightX = 0;
        this.highlightY = 0;
        this.highlightW = 0;
        this.highlightH = 0;

        this.tutorialOverlayX = 0;
        this.tutorialOverlayY = 0;
      }

      if (!step.anchor) return;

      const anchor = this.anchorRegistry.get(step.anchor);
      if (!anchor) {
        setTimeout(() => this.tutorial.bump(), 50);
        return;
      }

      const el = anchor.nativeElement as HTMLElement;

      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();

          if (rect.width === 0 || rect.height === 0) {
            setTimeout(() => this.tutorial.bump(), 50);
            return;
          }

          this.highlightX = rect.left - 8;
          this.highlightY = rect.top - 8;
          this.highlightW = rect.width + 16;
          this.highlightH = rect.height + 16;

          const centerX = rect.left + rect.width / 2;

          this.tutorialOverlayX = Math.min(
            Math.max(16, centerX - 160),
            window.innerWidth - 320
          );

          const PADDING = 12;
          const overlayHeight = 64;

          const above = rect.top - overlayHeight - PADDING;
          const below = rect.bottom + PADDING;

          this.tutorialOverlayY =
            above > 16
              ? above
              : below;
        });
      });
    });

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
    this.tutorial.init();
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
        this.gameService.prestigeWindowOpen.set(value);
        this.tutorial.tryAdvance();
        break;
      case 'profile':
        this.gameService.profileWindowOpen.set(value);
        this.tutorial.tryAdvance();
        break;
    }
  }

  protected async handleCook() {
    if (!this.store.canCook()) return;

    this.api.cook()

    this.tutorial.tryAdvance();
  }

  protected async handleSell() {
    if (!this.store.canSell()) return;

    this.api.sell();
    this.tutorial.tryAdvance();
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

    queueMicrotask(() => {
      this.tutorial.tryAdvance();
    });
  }

  protected nextTutorialStep() {
    switch (this.tutorial.currentStep()?.id) {
      case 'xp':
        this.tutorial.tryAdvance();
        break;
      case 'profile-exit':
        this.toggleModal('profile', false);
        break;
      case 'prestige-exit':
        this.toggleModal('prestige', false);
        break;
      default:
        this.tutorial.tryAdvance();
        break;
    }
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
