import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import formatNumber from '../../lib/formatNumber';
import getIcon from '../../lib/icons';
import {boostTooltip} from '../../lib/boostTooltip';
import {IUpgrade} from '../../../entities/game';
import {Upgrade} from '../../../entities/types';
import {GameStore} from '../../lib/stores/gameStore';
import {TutorialAnchorDirective} from '../../lib/tutorial-anchor.directive';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgClass, TutorialAnchorDirective],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input({required: true}) type: 'shop' | 'profile';
  @Input({required: true}) upgrade: IUpgrade;
  @Input({required: true}) blocked: boolean;
  @Output() buyEvent: EventEmitter<number> = new EventEmitter();

  protected showTooltip = false;
  protected gameStore = inject(GameStore);

  protected get tutorialAnchorName(): string | null {
    if (this.type !== 'shop') return null;

    if (this.upgrade.id === 1) {
      return 'upgrade-sandwich';
    }

    return null;
  }

  protected priceString(): string {
    return formatNumber(
      this.upgrade.times_bought > 0
        ? this.upgrade.price *
        Math.pow(this.upgrade.price_factor, this.upgrade.times_bought)
        : this.upgrade.price,
    );
  }

  protected handleBuy() {
    this.buyEvent.emit(this.upgrade.id);
  }

  protected icon(): string {
    return getIcon(
      this.upgrade.upgrade_type as Upgrade,
      this.upgrade.icon_name,
    );
  }

  protected boostDisplay(): string {
    return boostTooltip(
      this.upgrade.boost.value,
      this.upgrade.boost.boost_type,
    );
  }

}
