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
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  authService = inject(AuthService);
  gameService = inject(GameService);

  logoutWindowToggle: boolean = false;
  prestigeWindowToggle: boolean = false;

  prestigeProgressCount: number = 0;
  showResolutionWarning: boolean = false;

  getPrestigeMultiplier(): number {
    return 1 + this.prestigeProgressCount * 0.5;
  }

  setPrestigeWindow(value: boolean) {
    this.prestigeWindowToggle = value;
  }

  setLogoutWindow(value: boolean) {
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
    return formatNumber(this.gameService.prestigeLvl);
  }

  protected getPlayerLvlPercentage(): number {
    let neededXP = 100; //TODO: get from api
    return (this.gameService.playerLvl.value.xp / neededXP) * 100;
  }
}
