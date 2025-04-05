import { Component, Input } from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import { MenuButtonComponent } from '../../shared/ui/menu-button/menu-button.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuButtonComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input() dishesCount: number = 0; //TODO: get from api
  @Input() cashCount: number = 0; //TODO: get from api

  getDishCount(): string {
    return formatNumber(this.dishesCount);
  }

  getCashCount(): string {
    return formatNumber(this.cashCount);
  }
}
