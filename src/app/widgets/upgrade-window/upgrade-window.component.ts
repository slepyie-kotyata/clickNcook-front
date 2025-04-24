import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UpgradeButtonComponent } from '../../shared/ui/upgrade-button/upgrade-button.component';
import { IUpgrade } from '../../entities/game';
import { NgForOf } from '@angular/common';
import { GameService } from '../../shared/lib/services/game.service';
import { Upgrade } from '../../entities/types';

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
  currentUpgrades: IUpgrade[] = [];
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
      this.currentUpgrades.push(
        this.upgrades.find((x) => x.id == id) as IUpgrade,
      );
      this.refreshUpgradesList();
    }
  }

  getAvailableUpgrades() {
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
          boost_type: 'dPc',
          value: 2,
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
          boost_type: 'dPc',
          value: 3,
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
          boost_type: 'dPc',
          value: 5,
        },
      },
    ];

    this.refreshUpgradesList();
  }

  refreshUpgradesList() {
    this.availableUpgrades = this.upgrades.filter(
      (u) =>
        !this.currentUpgrades.some((c) => c.id === u.id) &&
        u.upgrade_type === this.selectedType &&
        u.access_level <= this.gameService.playerLvl.getValue(),
    );

    setTimeout(() => this.updateScrollButtons(), 10);
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

    this.gameService.playerLvl.subscribe(() => {
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
