import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import { AuthService } from '../../shared/lib/services/auth.service';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game.service';
import { TrackComponent } from '../../shared/ui/locations/track/track.component';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';
import { CafeComponent } from '../../shared/ui/locations/cafe/cafe.component';
import { RestaurantComponent } from '../../shared/ui/locations/restaurant/restaurant.component';
import { GastroRestaurantComponent } from '../../shared/ui/locations/gastro-restaurant/gastro-restaurant.component';
import { PrestigeWindowComponent } from '../../widgets/prestige-window/prestige-window.component';

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
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  authService = inject(AuthService);
  gameService = inject(GameService);

  logoutWindowToggle: boolean = false;
  showResolutionWarning: boolean = false;
  prestigeWindowToggle: boolean = false;

  setPrestigeWindow(value: boolean) {
    this.gameService.playSound('click');
    this.prestigeWindowToggle = value;
  }

  setLogoutWindow(value: boolean) {
    this.gameService.playSound('click');
    this.logoutWindowToggle = value;
  }

  handleCook(): void {
    if (!this.gameService.userUpgrades.find((u) => u.upgrade_type === 'dish'))
      return;

    this.gameService.handleCook();
  }

  handleSell(): void {
    if (this.gameService.dishesCount <= 0) return;

    this.gameService.handleSell();
  }

  toggleSound() {
    this.gameService.setSoundSettings(!this.gameService.soundEnabled);
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.gameService.loadData();
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    this.showResolutionWarning =
      width < 1024 || height < 768 || aspectRatio < 16 / 10;
  }

  protected getPrestigeLvl(): string {
    return formatNumber(this.gameService.currentPrestigeLvl);
  }

  protected getPlayerLvlPercentage(): number {
    let percentage = parseFloat(
      (
        (this.gameService.playerLvl.value.xp /
          this.gameService.getNextLevelXp()) *
        100
      ).toFixed(1),
    );

    return percentage > 0 ? percentage : 0;
  }
}
