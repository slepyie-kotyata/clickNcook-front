import {computed, Injectable, signal} from '@angular/core';
import {ISession, IUpgrade} from '../../../entities/game';
import {GameService} from '../services/game/game.service';

@Injectable({providedIn: 'root'})
export class GameStore {
  session = signal<ISession | null>(null);
  isLoaded = signal(false);

  money = computed(() => this.session()?.money ?? 0);
  level = computed(() => this.session()?.level.rank ?? 0);

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
}
