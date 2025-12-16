import {computed, Injectable, OnDestroy, signal} from '@angular/core';
import {ISession, IUpgrade} from '../../../entities/game';
import {GameService} from '../services/game/game.service';
import {Subject} from 'rxjs';
import {Upgrade} from '../../../entities/types';

@Injectable({providedIn: 'root'})
export class GameStore implements OnDestroy {
  session = signal<ISession | null>(null);
  pendingRequests = signal<Set<string>>(new Set());
  isLoaded = signal(false);
  destroy$ = new Subject<void>();

  neededXp = signal<number>(100);

  availableUpgrades = computed<IUpgrade[]>(() => {
    const s = this.session();
    if (!s) return [];

    return s.upgrades.available.filter(
      u => u.upgrade_type === this.game.selectedMenuType() &&
        u.access_level <= (s.level.rank ?? 0)
    );
  });

  hasNewUpgrade = computed<boolean>(() => {
    const s = this.session();
    if (!s) return false;

    return s.upgrades.available.find(u => this.isNewUpgrade(u)) !== undefined;
  })

  hasUpgradeToBuy = computed<boolean>(() => {
    const s = this.session();
    if (!s) return false;

    return s.upgrades.available.find(u => this.canBuyUpgrade(u)) !== undefined;
  })

  canSell = computed<boolean>(() => {
    const s = this.session();
    if (!s) return false;

    return s.dishes > 0;
  })

  canCook = computed<boolean>(() => {
    const s = this.session();
    if (!s) return false;

    return s.upgrades.current.find(u => u.upgrade_type === 'dish') !== undefined;
  })
  buyInFlight = signal<Set<number>>(new Set());
  awaitingListSync = signal<Set<number>>(new Set());

  constructor(private game: GameService) {
  }

  isUpgradeBlocked(id: number): boolean {
    return this.buyInFlight().has(id) || this.awaitingListSync().has(id);
  }

  hasUpgradeToBuyWithType(type: Upgrade) {
    const s = this.session();
    if (!s) return false;

    return s.upgrades.available.find(u => u.upgrade_type === type && this.canBuyUpgrade(u)) !== undefined;
  }

  hasNewUpgradeWithType(type: Upgrade) {
    const s = this.session();
    if (!s) return false;

    return s.upgrades.available.find(u => u.upgrade_type === type && this.isNewUpgrade(u)) !== undefined;
  }

  isNewUpgrade(upgrade: IUpgrade) {
    const s = this.session();
    if (!s) return false;
    if (!upgrade) return false;
    return upgrade.access_level <= (s.level.rank ?? 0) && upgrade.times_bought === 0;
  }

  canBuyUpgrade(upgrade: IUpgrade) {
    const s = this.session();
    if (!s) return false;
    if (!upgrade) return false;
    return upgrade.access_level <= (s.level.rank ?? 0) && (
      (upgrade.times_bought > 0) ?
        (upgrade.price * Math.pow(upgrade.price_factor, upgrade.times_bought) <= s.money) :
        (upgrade.price <= s.money)
    );

  }

  startPending(key: string) {
    this.pendingRequests.update(s => new Set(s).add(key));
  }

  stopPending(key: string) {
    this.pendingRequests.update(s => {
      const next = new Set(s);
      next.delete(key);
      return next;
    });
  }

  isPending(key: string): boolean {
    return (
      [...this.pendingRequests().values()].includes(key)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
