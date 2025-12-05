import {Component, EventEmitter, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {UpgradeButtonComponent} from '../../shared/ui/upgrade-button/upgrade-button.component';
import {GameStore} from '../../shared/lib/stores/gameStore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgForOf, UpgradeButtonComponent, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Output() logoutEvent = new EventEmitter<boolean>();

  constructor(protected store: GameStore) {
  }

  protected openLogoutWindow() {
    this.logoutEvent.emit(true);
  }
}
