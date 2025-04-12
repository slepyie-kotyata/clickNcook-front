import { Component, Input } from '@angular/core';
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
  @Input({ required: true }) blocked: boolean = false;
  @Input({ required: true }) price: number = 0;
  @Input() nameUpgrade: string = 'cook';
  @Input() valueUpgrade: string = '';

  priceString(): string {
    return formatNumber(this.price);
  }
}
