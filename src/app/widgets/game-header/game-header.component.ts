import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Session} from '../../shared/lib/session';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css',
})
export class GameHeaderComponent {
  @Input({required: true}) session: Session;

  @Output() openProfile = new EventEmitter<void>();
  @Output() openPrestige = new EventEmitter<void>();
}
