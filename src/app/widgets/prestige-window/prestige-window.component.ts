import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ModalComponent} from '../../shared/ui/modal/modal.component';
import formatNumber from '../../shared/lib/formatNumber';
import {GameStore} from '../../shared/lib/stores/gameStore';
import {ApiService} from '../../shared/lib/services/api.service';

@Component({
  selector: 'app-prestige-window',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './prestige-window.component.html',
  styleUrl: './prestige-window.component.css',
})
export class PrestigeWindowComponent {
  @Input({required: true}) enabled: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();

  protected store = inject(GameStore);
  protected api = inject(ApiService);
  protected readonly formatNumber = formatNumber;

  protected get accumulatedPrestigeMultiplier(): number {
    return parseFloat(
      (
        (this.store.session()?.prestige.current_boost_value ?? 1) +
        ((this.store.session()?.prestige.accumulated_value ?? 0) * 0.05 + 1)
      ).toFixed(2),
    );
  }

  protected get isProcessing() {
    return this.store.isPending('session_reset');
  }

  protected close() {
    this.closeEvent.emit(false);
  }

  protected handlePrestige() {
    this.close();
    this.api.session_reset();
  }
}
