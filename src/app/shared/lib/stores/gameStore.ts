import {computed, Injectable, OnDestroy, signal} from '@angular/core';
import {ISession, IUpgrade} from '../../../entities/game';
import {GameService} from '../services/game/game.service';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GameStore implements OnDestroy {
  session = signal<ISession | null>(null);
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

  constructor(private game: GameService) {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
