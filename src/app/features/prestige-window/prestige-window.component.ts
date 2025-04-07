import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-prestige-window',
  standalone: true,
  imports: [],
  templateUrl: './prestige-window.component.html',
  styleUrl: './prestige-window.component.css'
})
export class PrestigeWindowComponent {

  @Output() closeEvent = new EventEmitter();
  @Input() prestigeLVL: number = 0;

  prestigeProgressCount: number = 0;
  currentPrestige: number = 0;

  handleClose() {
    this.closeEvent.emit();
  }

  getPrestigeMultiplier(): number {
    return 1 + this.prestigeProgressCount * 0.5;
  }

}
