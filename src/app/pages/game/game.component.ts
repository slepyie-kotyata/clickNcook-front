import {Component, inject} from '@angular/core';
import {MenuComponent} from '../../features/menu/menu.component';
import formatNumber from '../../shared/lib/formatNumber';
import {AuthService} from '../../shared/lib/services/auth.service';
import {ModalComponent} from '../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MenuComponent, ModalComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  prestigeLvl: number = 0; //TODO: get from api
  playerLvl: number = 15; //TODO: get from api

  dishesCount: number = 0; //TODO: get from api
  moneyCount: number = 0; //TODO: get from api
  authService = inject(AuthService);
  prestigeWindowToggle: boolean = false;
  prestigeProgressCount: number = 0;
  private cookClickCount = 0;
  private sellClickCount = 0;

  getPrestigeMultiplier(): number {
    return 1 + this.prestigeProgressCount * 0.5;
  }

  openPrestigeWindow() {
    this.prestigeWindowToggle = true;
  }

  handlePrestigeWindowClose() {
    this.prestigeWindowToggle = false;
  }


  handleCook(): void {
    this.cookClickCount++;
    this.dishesCount++;

    if (this.cookClickCount > 5) {
      //TODO: api post/cook
      this.cookClickCount = 0;
      return;
    }
  }

  handleSell(): void {
    if (this.dishesCount <= 0) return;

    this.sellClickCount++;
    this.dishesCount--;
    this.moneyCount++; //заглушка
    if (this.sellClickCount > 5) {
      //TODO: api post/cook
      this.sellClickCount = 0;
      return;
    }
  }

  logout() {
    this.authService.logout();
  }

  protected getPrestigeLvl(): string {
    return formatNumber(this.prestigeLvl);
  }

  protected getPlayerLvlPercentage(): number {
    let nextLvl = 100; //TODO: get from api
    return (this.playerLvl / nextLvl) * 100;
  }
}
