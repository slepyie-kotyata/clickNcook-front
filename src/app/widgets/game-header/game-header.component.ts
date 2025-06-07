import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.css',
})
export class GameHeaderComponent {
  @Input({ required: true }) prestige = '';
  @Input({ required: true }) level = 0;
  @Input({ required: true }) levelPercentage = 0;

  @Output() openProfile = new EventEmitter<void>();
  @Output() openPrestige = new EventEmitter<void>();
}
