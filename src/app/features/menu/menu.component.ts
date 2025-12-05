import {Component, EventEmitter, Input, Output} from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import {MenuButtonComponent} from '../../shared/ui/menu-button/menu-button.component';
import {UpgradeWindowComponent} from '../../widgets/upgrade-window/upgrade-window.component';
import {GameService} from '../../shared/lib/services/game/game.service';
import {Upgrade} from '../../entities/types';
import {NgForOf, NgIf} from '@angular/common';
import {GameStore} from '../../shared/lib/stores/gameStore';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuButtonComponent, UpgradeWindowComponent, NgForOf, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() showCloseButton = false;
  @Output() close = new EventEmitter<void>();

  protected menuButtons: {
    type: Upgrade;
    icon: string;
    requiredRank: number;
    disabled?: boolean;
  }[] = [
    {type: 'dish', icon: '/icons/fondue.svg', requiredRank: 0},
    {type: 'equipment', icon: '/icons/table.svg', requiredRank: 3},
    {type: 'global', icon: '/icons/upgrades.svg', requiredRank: 10},
    {type: 'staff', icon: '/icons/person.svg', requiredRank: 20},
    {
      type: 'recipe',
      icon: '/icons/menu.svg',
      requiredRank: 999,
      disabled: true,
    },
    {type: 'point', icon: '/icons/map.svg', requiredRank: 70},
  ];

  constructor(protected store: GameStore, protected gameService: GameService) {
  }

  get dishCount() {
    return formatNumber(this.store.session()?.dishes ?? 0);
  }

  get cashCount() {
    return formatNumber(this.store.session()?.money ?? 0);
  }

  selectMenu(value: Upgrade) {
    this.gameService.selectMenuType(value);
  }

  onClose() {
    this.close.emit();
  }
}
