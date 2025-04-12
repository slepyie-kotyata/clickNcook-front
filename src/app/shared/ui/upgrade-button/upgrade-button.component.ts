import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {
  @Input() buy: boolean = false;
  @Input() blocked: boolean = false;
  @Input() price: string = '1';
  @Input() nameUpgrade: string = 'cook';
  @Input() valueUpgrade: string = '';
}
