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

  menuButtons: {
    type: Upgrade;
    icon: string;
    requiredRank: number;
    disabled?: boolean;
  }[] = [
    {type: 'dish', icon: '/icons/menu/grill.svg', requiredRank: 999},
    {type: 'equipment', icon: '/icons/menu/table.svg', requiredRank: 999},
    {type: 'global', icon: '/icons/menu/up.svg', requiredRank: 999},
    {type: 'staff', icon: '/icons/menu/stuff.svg', requiredRank: 999},
    {
      type: 'recipe',
      icon: '/icons/menu/menu.svg',
      requiredRank: 999,
      disabled: true,
    },
    {type: 'point', icon: '/icons/menu/map.svg', requiredRank: 999}
  ]

  constructor(protected store: GameStore, protected gameService: GameService) {
    let s = this.store.session();
    if (!s) return;
    this.menuButtons.forEach(button => {
      button.requiredRank = s.upgrades.available
        .filter(u => u.upgrade_type === button.type)
        .sort((a, b) => a.access_level - b.access_level)[0]?.access_level ?? 999;
    });
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
