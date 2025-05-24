import { Component, inject } from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import { MenuButtonComponent } from '../../shared/ui/menu-button/menu-button.component';
import { UpgradeWindowComponent } from '../../widgets/upgrade-window/upgrade-window.component';
import { GameService } from '../../shared/lib/services/game.service';
import { Upgrade } from '../../entities/types';
import { NgForOf } from '@angular/common';
import { GameSessionService } from '../../shared/lib/services/game-session.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuButtonComponent, UpgradeWindowComponent, NgForOf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  protected menuButtons: {
    type: Upgrade;
    icon: string;
    requiredRank: number;
    disabled?: boolean;
  }[] = [
    { type: 'dish', icon: '/icons/fondue.svg', requiredRank: 0 },
    { type: 'equipment', icon: '/icons/table.svg', requiredRank: 3 },
    { type: 'global', icon: '/icons/upgrades.svg', requiredRank: 10 },
    { type: 'staff', icon: '/icons/person.svg', requiredRank: 20 },
    {
      type: 'recipe',
      icon: '/icons/menu.svg',
      requiredRank: 999,
      disabled: true,
    },
    { type: 'point', icon: '/icons/map.svg', requiredRank: 70 },
  ];
  protected gameService = inject(GameService);
  protected session = inject(GameSessionService);

  get dishCount() {
    return formatNumber(this.session.dishesSignal());
  }

  get cashCount() {
    return formatNumber(this.session.moneySignal());
  }

  selectMenu(value: Upgrade) {
    this.gameService.selectMenuType(value);
  }
}
