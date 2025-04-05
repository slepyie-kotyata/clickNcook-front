import { Component } from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  dishedCount: number = 121312; //TODO: get from api
  cashCount: number = 12314123; //TODO: get from api

  getDishCount(): string {
    return formatNumber(this.dishedCount);
  }

  getCashCount(): string {
    return formatNumber(this.cashCount);
  }
}
