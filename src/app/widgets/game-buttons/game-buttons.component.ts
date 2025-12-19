import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {TutorialAnchorDirective} from '../../shared/lib/tutorial-anchor.directive';

@Component({
  selector: 'app-game-buttons',
  standalone: true,
  imports: [NgIf, TutorialAnchorDirective],
  templateUrl: './game-buttons.component.html',
  styleUrl: './game-buttons.component.css',
})
export class GameButtonsComponent {
  @Input({required: true}) level: number;
  @Input({required: true}) canCook: boolean;
  @Input({required: true}) canSell: boolean;

  @Output() cook = new EventEmitter<void>();
  @Output() sell = new EventEmitter<void>();
}
