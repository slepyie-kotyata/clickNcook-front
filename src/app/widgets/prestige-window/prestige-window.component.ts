import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ModalComponent} from '../../shared/ui/modal/modal.component';
import formatNumber from '../../shared/lib/formatNumber';
import {NgIf} from '@angular/common';
import {GameStore} from '../../shared/lib/stores/gameStore';
import {ApiService} from '../../shared/lib/services/api.service';

@Component({
  selector: 'app-prestige-window',
  standalone: true,
  imports: [ModalComponent, NgIf],
  templateUrl: './prestige-window.component.html',
  styleUrl: './prestige-window.component.css',
})
export class PrestigeWindowComponent {
  @Input({required: true}) enabled: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();

  protected store = inject(GameStore);
  protected api = inject(ApiService);
  protected isProcessing: boolean = false;
  protected readonly parseFloat = parseFloat;
  protected readonly formatNumber = formatNumber;

  protected get accumulatedPrestigeMultiplier(): number {
    return parseFloat(
      (1 + (this.store.session()?.prestige.accumulated_value ?? 0) * 0.5).toFixed(2),
    );
  }

  protected get currentPrestigeMultiplier(): number {
    return parseFloat((1 + (this.store.session()?.prestige.current_value ?? 0) * 0.5).toFixed(2));
  }

  protected close() {
    this.closeEvent.emit(false);
  }

  protected handlePrestige() {
    this.isProcessing = true;
    this.api.session_reset();
  }
}
