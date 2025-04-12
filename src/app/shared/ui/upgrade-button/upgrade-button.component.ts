import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import formatNumber from '../../lib/formatNumber';
import getIcon from '../../lib/icons';
import { IUpgrade } from '../../../entities/upgrade';
import { upgrades } from '../../../entities/types';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input({ required: true }) upgrade: IUpgrade;
  @Input({ required: true }) blocked: boolean;

  @Output() buyEvent: EventEmitter<number> = new EventEmitter();

  priceString(): string {
    return formatNumber(this.upgrade.price);
  }

  handleBuy() {
    this.buyEvent.emit(this.upgrade.id);
  }

  icon(): string {
    return getIcon(
      this.upgrade.upgrade_type as upgrades,
      this.upgrade.icon_name,
    );
  }
}
