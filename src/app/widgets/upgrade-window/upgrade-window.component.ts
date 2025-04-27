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
  availableUpgrades: IUpgrade[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  isAtTop = true;
  isAtBottom = false;
  scrollItemHeight = 115;
  disableAllScrollButtons = false;

  constructor() {
    this.gameService.sessionUpgrades.subscribe(() =>
      this.refreshUpgradesList(),
    );
  }

  handleBuy(id: number) {
    let upgrade = this.availableUpgrades.find((x) => x.id == id);

    if (upgrade) {
      this.gameService.handleBuy(upgrade);
    }
  }

  refreshUpgradesList() {
    this.availableUpgrades = this.gameService.sessionUpgrades.value.filter(
      (u) =>
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
