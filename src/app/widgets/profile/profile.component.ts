import {Component, EventEmitter, Output} from '@angular/core';
import {UpgradeButtonComponent} from '../../shared/ui/upgrade-button/upgrade-button.component';
import {GameStore} from '../../shared/lib/stores/gameStore';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UpgradeButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Output() logoutEvent = new EventEmitter<boolean>();

  constructor(protected store: GameStore) {
  }

  protected get profileUpgrades() {
    return this.store.session()?.upgrades?.current.filter(u => u.upgrade_type != "dish") ?? [];
  }

  protected openLogoutWindow() {
    this.logoutEvent.emit(true);
  }

}
