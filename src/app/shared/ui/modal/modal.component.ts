import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

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
}
