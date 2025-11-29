import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import {MenuButtonComponent} from '../../shared/ui/menu-button/menu-button.component';
import {UpgradeWindowComponent} from '../../widgets/upgrade-window/upgrade-window.component';
import {GameService} from '../../shared/lib/services/game/game.service';
import {Upgrade} from '../../entities/types';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from '../../shared/lib/services/api.service';
import {ISession} from '../../entities/game';

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
  protected gameService = inject(GameService);
  protected session: ISession;

  constructor(private api: ApiService) {
    this.session = this.api.Session;
  }

  get dishCount() {
    return formatNumber(this.session.dishes);
  }

  get cashCount() {
    return formatNumber(this.session.money);
  }

  selectMenu(value: Upgrade) {
    this.gameService.selectMenuType(value);
  }

  onClose() {
    this.close.emit();
  }
}
