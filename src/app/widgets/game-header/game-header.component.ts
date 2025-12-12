import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISession} from '../../entities/game';
import formatNumber from '../../shared/lib/formatNumber';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css',
})
export class GameHeaderComponent {
  @Input({required: true}) session: ISession | null;
  @Input({required: true}) neededXp: number;

  @Output() openProfile = new EventEmitter<void>();
  @Output() openPrestige = new EventEmitter<void>();
  protected readonly formatNumber = formatNumber;

  protected getLevelPercentage(): number {
    if (!this.session) return 100;

    const xp = this.session.level.xp;
    const neededXp = this.neededXp;

    if (
      !Number.isFinite(xp) ||
      !Number.isFinite(neededXp) ||
      neededXp <= 0 ||
      xp > Number.MAX_SAFE_INTEGER
    ) {
      return 100;
    }

    const percent = (xp / neededXp) * 100;

    if (!Number.isFinite(percent)) {
      return 100;
    }

    return Math.min(Math.floor(percent), 100);
  }

}
