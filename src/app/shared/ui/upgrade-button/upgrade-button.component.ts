import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import formatNumber from '../../lib/formatNumber';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input({ required: true }) id: number = 0;
  @Input({ required: true }) blocked: boolean = false;
  @Input({ required: true }) price: number = 0;
  @Input() upgradeName: string = 'cook';
  @Input() upgradeValue: string = '';
  @Output() buyEvent: EventEmitter<number> = new EventEmitter();

  priceString(): string {
    return formatNumber(this.price);
  }

  handleBuy() {
    this.buyEvent.emit(this.id);
  }
}
