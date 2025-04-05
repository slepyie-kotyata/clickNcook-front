import { Component, Input, OnInit } from '@angular/core';
import formatNumber from '../../shared/lib/formatNumber';
import { MenuButtonComponent } from '../../shared/ui/menu-button/menu-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuButtonComponent, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  @Input() dishesCount: number = 0; //TODO: get from api
  @Input() cashCount: number = 0; //TODO: get from api

  isOpen: boolean = false;
  protected readonly window = window;

  getDishCount(): string {
    return formatNumber(this.dishesCount);
  }

  getCashCount(): string {
    return formatNumber(this.cashCount);
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    console.log('toggle');
  }

  ngOnInit(): void {
    console.log(window.innerWidth);
  }
}
