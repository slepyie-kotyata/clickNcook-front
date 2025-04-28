import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Upgrade } from '../../../entities/types';
import { GameService } from '../../lib/services/game.service';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.css',
})
export class MenuButtonComponent {
  @Input({ required: true }) iconSource: string = '';
  @Input({ required: true }) type: Upgrade;
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<Upgrade> = new EventEmitter<Upgrade>();

  gameService = inject(GameService);

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit(this.type);
    }
  }

  isSelected(): boolean {
    return this.type === this.gameService.selectedMenuType.value;
  }
}
