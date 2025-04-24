import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import { AuthService } from '../../shared/lib/services/auth.service';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game.service';
import { TrackComponent } from '../../shared/ui/locations/track/track.component';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MenuComponent,
    ModalComponent,
    TrackComponent,
    NgIf,
    LoadingComponent,
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
  private cookClickCount = 0;
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
    if (!this.gameService.userUpgrades.find((u) => u.upgrade_type === 'dish'))
      return;

    let totalDishesCount = 1;
    this.gameService.userUpgrades
      ?.filter((u) => u.boost.boost_type === 'dPc')
      ?.forEach((u) => (totalDishesCount += u.boost.value));
    let totalDishesMultiplier = 0;
    this.gameService.userUpgrades
      ?.filter((u) => u.boost.boost_type === 'dM')
      ?.forEach((u) => (totalDishesMultiplier += u.boost.value));

    if (totalDishesCount > 0) {
      this.cookClickCount++;
      if (totalDishesMultiplier == 0) totalDishesMultiplier = 1;
      this.gameService.dishesCount += totalDishesCount * totalDishesMultiplier;
    }

    if (this.cookClickCount >= 5) {
      this.gameService.handleCook();
      this.cookClickCount = 0;
    }
  }

  handleSell(): void {
    if (this.gameService.dishesCount <= 0) return;

    let totalMoneyCount = 0;
    this.gameService.userUpgrades
      ?.filter((u) => u.boost.boost_type === 'mPc')
      ?.forEach((u) => (totalMoneyCount += u.boost.value));
    let totalMoneyMultiplier = 0;
    this.gameService.userUpgrades
      ?.filter((u) => u.boost.boost_type === 'mM')
      ?.forEach((u) => (totalMoneyMultiplier += u.boost.value));

    if (totalMoneyCount > 0) {
      this.sellClickCount++;
      this.gameService.dishesCount--;
      this.gameService.moneyCount += totalMoneyCount * totalMoneyMultiplier;
    }

    if (this.sellClickCount >= 5) {
      this.gameService.handleSell();
      this.sellClickCount = 0;
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
