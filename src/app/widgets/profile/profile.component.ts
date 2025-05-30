import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameSessionService } from '../../shared/lib/services/game-session.service';
import { NgForOf, NgIf } from '@angular/common';
import { UpgradeButtonComponent } from '../../shared/ui/upgrade-button/upgrade-button.component';
import { ModalComponent } from '../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgForOf, UpgradeButtonComponent, ModalComponent, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input({ required: true }) email: string;
  @Output() logoutEvent = new EventEmitter<boolean>();

  constructor(protected session: GameSessionService) {}

  protected openLogoutWindow() {
    this.logoutEvent.emit(true);
  }
}
