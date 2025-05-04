import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import formatNumber from '../../lib/formatNumber';
import getIcon from '../../lib/icons';
import { boostTooltip } from '../../lib/boostTooltip';
import { IBoost, IUpgrade } from '../../../entities/game';
import { Upgrade } from '../../../entities/types';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input({ required: true }) upgrade: IUpgrade;
  @Input({ required: true }) blocked: boolean;
  @Output() buyEvent: EventEmitter<number> = new EventEmitter();

  priceString(): string {
    return formatNumber(
      this.upgrade.times_bought > 0
        ? this.upgrade.price *
            this.upgrade.price_factor *
            this.upgrade.times_bought
        : this.upgrade.price
    );
  }

  handleBuy() {
    this.buyEvent.emit(this.upgrade.id);
  }

  icon(): string {
    return getIcon(
      this.upgrade.upgrade_type as Upgrade,
      this.upgrade.icon_name
    );
  }

  showTooltip = false;
  tooltipVisible = false;

  boostDisplay(): string {
    return boostTooltip(
      this.upgrade.boost.value,
      this.upgrade.boost.boost_type
    );
  }
}
