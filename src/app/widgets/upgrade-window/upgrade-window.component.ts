import {AfterViewInit, Component, ElementRef, inject, Injector, ViewChild,} from '@angular/core';
import {UpgradeButtonComponent} from '../../shared/ui/upgrade-button/upgrade-button.component';
import {IUpgrade} from '../../entities/game';
import {NgForOf} from '@angular/common';
import {GameStore} from '../../shared/lib/stores/gameStore';
import {ApiService} from '../../shared/lib/services/api.service';

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent, NgForOf],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css',
})
export class UpgradeWindowComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  protected isAtTop = true;
  protected isAtBottom = false;
  protected scrollItemHeight = 115;
  protected disableAllScrollButtons = false;
  protected readonly Math = Math;
  private injector = inject(Injector);

  constructor(protected store: GameStore, private api: ApiService) {
  }

  get upgrades() {
    return this.store.availableUpgrades();
  }

  handleBuy(id: number) {
    let upgrade = this.store.availableUpgrades().find((x: IUpgrade) => x.id == id);
    if (!upgrade) return;

    this.api.upgrade_buy(upgrade.id)
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
    if (!this.scrollContainer?.nativeElement) return;

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
