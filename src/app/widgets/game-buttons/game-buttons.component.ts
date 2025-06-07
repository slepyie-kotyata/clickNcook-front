import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game-buttons',
  standalone: true,
  imports: [NgIf],
  templateUrl: './game-buttons.component.html',
  styleUrl: './game-buttons.component.css',
})
export class GameButtonsComponent {
  @Input({ required: true }) level: number;
  @Input({ required: true }) isCooking: boolean;
  @Input({ required: true }) isSelling: boolean;

  @Output() cook = new EventEmitter<void>();
  @Output() sell = new EventEmitter<void>();
}
