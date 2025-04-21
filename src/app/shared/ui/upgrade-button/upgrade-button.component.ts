import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import formatNumber from '../../lib/formatNumber';
import getIcon from '../../lib/icons';
import {IUpgrade} from '../../../entities/upgrade';
import {Upgrade} from '../../../entities/types';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input({required: true}) upgrade: IUpgrade;
  @Input({required: true}) blocked: boolean;

  @Output() buyEvent: EventEmitter<number> = new EventEmitter();

  priceString(): string {
    return formatNumber(this.upgrade.price);
  }

  handleBuy() {
    this.buyEvent.emit(this.upgrade.id);
  }

  icon(): string {
    return getIcon(
      this.upgrade.upgrade_type as Upgrade,
      this.upgrade.icon_name,
    );
  }
}
