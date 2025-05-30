import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() border_size: number = 2;
  @Input() border_color: string = 'black';
  @Input() background: string = 'bg-primary';
  @Input() show: boolean = false;
  @Input() closeOnBackdrop: boolean = true;
  @Output() close = new EventEmitter();

  @HostListener('document:keydown.escape', ['$event'])
  handleClose() {
    if (this.show) {
      this.close.emit();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  protected styleString() {
    return `${this.background} border-${this.border_color}`;
  }
}
