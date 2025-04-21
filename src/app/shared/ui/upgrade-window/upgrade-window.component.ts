import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild,} from '@angular/core';
import {UpgradeButtonComponent} from '../upgrade-button/upgrade-button.component';
import {IUpgrade} from '../../../entities/upgrade';
import {NgForOf} from '@angular/common';
import {GameService} from '../../lib/services/game.service';
import {Upgrade} from '../../../entities/types';

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent, NgForOf],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css',
})
export class UpgradeWindowComponent implements OnInit, AfterViewInit {
  gameService = inject(GameService);
  selectedType: Upgrade = 'dish';
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
        id: 1,
        name: 'Гамбургер',
        icon_name: 'hamburger',
        upgrade_type: 'dish',
        price: 10,
        access_level: 0,
        boost: {
          id: 1,
          boost_type: 'dishes per click',
          value: 2,
          upgrade_id: 1,
        },
      },
      {
        id: 2,
        name: 'Хот-дог',
        icon_name: 'hotdog',
        upgrade_type: 'dish',
        price: 25,
        access_level: 1,
        boost: {
          id: 1,
          boost_type: 'dishes per click',
          value: 3,
          upgrade_id: 2,
        },
      },
      {
        id: 3,
        name: 'Пицца',
        icon_name: 'pizza',
        upgrade_type: 'dish',
        price: 100,
        access_level: 2,
        boost: {
          id: 1,
          boost_type: 'dishes per click',
          value: 5,
          upgrade_id: 3,
        },
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
