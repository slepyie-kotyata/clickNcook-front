import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import { AuthService } from '../../shared/lib/services/auth.service';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game.service';
import { TrackComponent } from '../../shared/ui/locations/track/track.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MenuComponent, ModalComponent, TrackComponent, NgIf],
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
  private sellClickCount = 0;

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
    this.cookClickCount++;
    this.gameService.dishesCount++;

    if (this.cookClickCount > 5) {
      //TODO: api post/cook
      this.cookClickCount = 0;
      return;
    }
  }

  handleSell(): void {
    if (this.gameService.dishesCount <= 0) return;

    this.sellClickCount++;
    this.gameService.dishesCount--;
    this.gameService.moneyCount++; //заглушка
    if (this.sellClickCount > 5) {
      //TODO: api post/cook
      this.sellClickCount = 0;
      return;
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.gameService.loadData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.showResolutionWarning = width < 1024 || height < 768;
  }

  protected getPrestigeLvl(): string {
    return formatNumber(this.gameService.prestigeLvl);
  }

  protected getPlayerLvlPercentage(): number {
    let neededXP = 100; //TODO: get from api
    return (this.gameService.playerXP / neededXP) * 100;
  }
}
