import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { GameService } from '../../shared/lib/services/game.service';
import { GameSessionService } from '../../shared/lib/services/game-session.service';

@Component({
  selector: 'app-prestige-window',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './prestige-window.component.html',
  styleUrl: './prestige-window.component.css',
})
export class PrestigeWindowComponent {
  @Input({ required: true }) enabled: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();

  protected gameService = inject(GameService);
  protected session = inject(GameSessionService);
  protected isProcessing: boolean = false;
  protected readonly parseFloat = parseFloat;

  protected get prestigeMultiplier(): number {
    return parseFloat(
      (1 + this.session.accumulatedPrestigeSignal() * 0.5).toFixed(2),
    );
  }

  protected close() {
    this.closeEvent.emit(false);
  }

  protected handlePrestige() {
    this.isProcessing = true;
    this.gameService.handlePrestige();
  }
}
