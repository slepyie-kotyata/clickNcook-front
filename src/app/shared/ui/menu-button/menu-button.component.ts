import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { upgrades } from '../../../entities/types';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.css',
})
export class MenuButtonComponent {
  @Input({ required: true }) iconSource: string = '';
  @Input({ required: true }) selected: boolean = false;
  @Input({ required: true }) type: upgrades;
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<upgrades> = new EventEmitter<upgrades>();

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit(this.type);
    }
  }
}
