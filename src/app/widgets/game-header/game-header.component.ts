import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISession} from '../../entities/game';

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


  protected getLevelPercentage(): number {
    if (!this.session) return 100;
    return Math.floor((this.session.level.xp / this.neededXp) * 100);
  }
}
