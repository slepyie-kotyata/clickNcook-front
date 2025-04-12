import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UpgradeButtonComponent } from '../upgrade-button/upgrade-button.component';
import { IUpgrade } from '../../../entities/upgrade';
import { NgForOf } from '@angular/common';
import { GameService } from '../../lib/services/game.service';
import { upgrades } from '../../../entities/types';

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent, NgForOf],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css',
})
export class UpgradeWindowComponent implements OnInit, AfterViewInit {
  gameService = inject(GameService);
  selectedType: upgrades = 'menu';
  upgrades: IUpgrade[] = [];
  availableUpgrades: IUpgrade[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  isAtTop = true;
  isAtBottom = false;
  scrollItemHeight = 115;
  disableAllScrollButtons = false;

  constructor() {
    this.getAvailableUpgrades();
  }

  handleBuy(id: number) {
    //TODO: api

    let price = this.availableUpgrades.find((x) => x.id == id)?.price;

    if (price) {
      this.gameService.decreaseMoney(price);
      this.availableUpgrades = this.upgrades.filter((x) => x.id != id);
    }
  }

  getAvailableUpgrades() {
    //TODO: get from api

    this.upgrades = [
      {
        id: 0,
        icon_name: 'hamburger',
        upgrade_type: 'menu',
        name: 'Гамбургер',
        price: 100,
      },
      {
        id: 1,
        icon_name: 'hotdog',
        upgrade_type: 'menu',
        name: 'Хот-дог',
        price: 250,
      },
      {
        id: 2,
        icon_name: 'pizza',
        upgrade_type: 'menu',
        name: 'Пицца',
        price: 700,
      },
      {
        id: 3,
        icon_name: 'burrito',
        upgrade_type: 'menu',
        name: 'Буррито',
        price: 2000,
      },
      {
        id: 4,
        icon_name: 'stovetop',
        upgrade_type: 'equipment',
        name: 'Новая плита',
        price: 500,
      },
      {
        id: 5,
        icon_name: 'gas-burner',
        upgrade_type: 'equipment',
        name: 'Газовая горелка',
        price: 1000,
      },
      {
        id: 6,
        icon_name: 'cooker',
        upgrade_type: 'equipment',
        name: 'Профессиональная духовка',
        price: 3000,
      },
      {
        id: 7,
        icon_name: 'dishes',
        upgrade_type: 'upgrade',
        name: 'Продвижение новых блюд',
        price: 1500,
      },
      {
        id: 8,
        icon_name: 'price',
        upgrade_type: 'upgrade',
        name: 'Повышение цен',
        price: 3000,
      },
      {
        id: 9,
        icon_name: 'waiter',
        upgrade_type: 'person',
        name: 'Официант',
        price: 2000,
      },
      {
        id: 10,
        icon_name: 'chef',
        upgrade_type: 'person',
        name: 'Шеф-повар',
        price: 5000,
      },
      {
        id: 11,
        icon_name: 'track',
        upgrade_type: 'map',
        name: 'Фуд-трак',
        price: 5000,
      },
      {
        id: 12,
        icon_name: 'cafe',
        upgrade_type: 'map',
        name: 'Маленькое кафе',
        price: 15000,
      },
      {
        id: 13,
        icon_name: 'restaurant',
        upgrade_type: 'map',
        name: 'Семейный ресторан',
        price: 50000,
      },
      {
        id: 14,
        icon_name: 'big-restaurant',
        upgrade_type: 'map',
        name: 'Гастраномический ресторан',
        price: 150000,
      },
      {
        id: 15,
        icon_name: 'desert',
        upgrade_type: 'menu',
        name: 'Сет десертов',
        price: 150000,
      },
      {
        id: 16,
        icon_name: 'steak',
        upgrade_type: 'menu',
        name: 'Стейк',
        price: 150000,
      },
      {
        id: 17,
        icon_name: 'ramen',
        upgrade_type: 'menu',
        name: 'Рамен',
        price: 150000,
      },
      {
        id: 18,
        icon_name: 'lobster',
        upgrade_type: 'menu',
        name: 'Лобстер',
        price: 150000,
      },
    ];

    this.refreshUpgradesList();
  }

  refreshUpgradesList() {
    this.availableUpgrades = this.upgrades.filter(
      (u) => u.upgrade_type == this.selectedType,
    );

    setTimeout(() => this.updateScrollButtons());
  }

  scrollUp(): void {
    this.scrollContainer.nativeElement.scrollBy({
      top: -this.scrollItemHeight,
      behavior: 'smooth',
    });
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  scrollDown(): void {
    this.scrollContainer.nativeElement.scrollBy({
      top: this.scrollItemHeight,
      behavior: 'smooth',
    });
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  updateScrollButtons(): void {
    const el = this.scrollContainer.nativeElement;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const canScroll = scrollHeight > clientHeight;

    this.disableAllScrollButtons = !canScroll;

    if (!canScroll) {
      this.isAtTop = true;
      this.isAtBottom = true;
      return;
    }

    this.isAtTop = scrollTop <= 1;
    this.isAtBottom = scrollHeight - scrollTop - clientHeight <= 1;
  }

  ngOnInit(): void {
    this.gameService.selectedMenuType.subscribe((type) => {
      this.selectedType = type;
      this.refreshUpgradesList();
    });
  }

  ngAfterViewInit(): void {
    const item =
      this.scrollContainer.nativeElement.querySelector('app-upgrade-button');
    if (item) {
      this.scrollItemHeight = item.getBoundingClientRect().height + 20;
    }

    this.scrollContainer.nativeElement.addEventListener('scroll', () => {
      this.updateScrollButtons();
    });

    setTimeout(() => this.updateScrollButtons());
  }
}
