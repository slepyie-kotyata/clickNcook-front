import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tutorial-overlay',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './tutorial-overlay.component.html',
  styleUrl: './tutorial-overlay.component.css'
})
export class TutorialOverlayComponent {
  @Input({required: true}) x = 0;
  @Input({required: true}) y = 0;
  @Input({required: true}) text = '';
  @Input({required: true}) blockScreen = false;
  @Input({required: true}) darkenScreen = false;
  @Input({required: true}) highlightX = 0;
  @Input({required: true}) highlightY = 0;
  @Input({required: true}) highlightW = 0;
  @Input({required: true}) highlightH = 0;

  @Output() next = new EventEmitter<void>();

  get mask(): string {
    return `
    radial-gradient(
      circle at ${this.highlightX + this.highlightW / 2}px
                ${this.highlightY + this.highlightH / 2}px,
      transparent ${this.highlightW / 2}px,
      black ${this.highlightW / 2 + 10}px
    )
  `;
  }
}
