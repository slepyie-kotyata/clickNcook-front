import { Component, inject } from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import { MenuButtonComponent } from '../../shared/ui/menu-button/menu-button.component';
import { NgIf } from '@angular/common';
import { UpgradeWindowComponent } from '../../shared/ui/upgrade-window/upgrade-window.component';
import { GameService } from '../../shared/lib/services/game.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuButtonComponent, NgIf, UpgradeWindowComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  gameService = inject(GameService);
  isOpen: boolean = false;
  protected readonly window = window;

  getDishCount(): string {
    return formatNumber(this.gameService.dishesCount);
  }

  getCashCount(): string {
    return formatNumber(this.gameService.moneyCount);
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
}
