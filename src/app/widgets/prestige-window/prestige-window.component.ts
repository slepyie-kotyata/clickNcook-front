import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game/game.service';
import { SessionService } from '../../shared/lib/services/game/session.service';
import formatNumber from '../../shared/lib/formatNumber';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-prestige-window',
  standalone: true,
  imports: [ModalComponent, NgIf],
  templateUrl: './prestige-window.component.html',
  styleUrl: './prestige-window.component.css',
})
export class PrestigeWindowComponent {
  @Input({ required: true }) enabled: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();

  protected gameService = inject(GameService);
  protected session = inject(SessionService);
  protected isProcessing: boolean = false;
  protected readonly parseFloat = parseFloat;
  protected readonly formatNumber = formatNumber;

  protected get accumulatedPrestigeMultiplier(): number {
    return parseFloat(
      (1 + this.session.accumulatedPrestigeSignal() * 0.5).toFixed(2),
    );
  }

  protected get currentPrestigeMultiplier(): number {
    return parseFloat((1 + this.session.prestigeSignal() * 0.5).toFixed(2));
  }

  protected close() {
    this.closeEvent.emit(false);
  }

  protected handlePrestige() {
    this.isProcessing = true;
    this.gameService.handlePrestige();
  }
}
