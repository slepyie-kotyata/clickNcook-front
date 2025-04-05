import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.css',
})
export class MenuButtonComponent {
  @Input() iconSource: string = '';
  @Input() disabled: boolean = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
