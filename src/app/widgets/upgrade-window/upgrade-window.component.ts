import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Injector,
  OnInit,
  runInInjectionContext,
  ViewChild,
} from '@angular/core';
import { UpgradeButtonComponent } from '../../shared/ui/upgrade-button/upgrade-button.component';
import { IUpgrade } from '../../entities/game';
import { NgForOf } from '@angular/common';
import { GameService } from '../../shared/lib/services/game.service';
import { GameSessionService } from '../../shared/lib/services/game-session.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent, NgForOf],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css',
})
export class UpgradeWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  protected gameService = inject(GameService);
  protected session = inject(GameSessionService);
  protected availableUpgrades: IUpgrade[] = [];
  protected isAtTop = true;
  protected isAtBottom = false;
  protected scrollItemHeight = 115;
  protected disableAllScrollButtons = false;

  private injector = inject(Injector);

  handleBuy(id: number) {
    let upgrade = this.availableUpgrades.find((x) => x.id == id);

    if (upgrade) {
      this.gameService
        .handleBuy(upgrade)
        .then(() => this.refreshUpgradesList());
    }
  }

  refreshUpgradesList() {
    this.availableUpgrades = this.session
      .sessionUpgradesSignal()
      .filter(
        (u) =>
          u.upgrade_type === this.gameService.menu.value &&
          u.access_level <= this.session.levelSignal().rank,
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

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      toObservable(this.session.levelSignal).subscribe(() => {
        this.refreshUpgradesList();
      });

      toObservable(this.session.sessionUpgradesSignal).subscribe(() => {
        this.refreshUpgradesList();
      });
    });

    this.gameService.menu.subscribe(() => {
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
