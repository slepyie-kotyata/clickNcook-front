import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { GameSessionService } from '../../../lib/services/game-session.service';

@Component({
  selector: 'app-final',
  standalone: true,
  imports: [NgIf],
  templateUrl: './final.component.html',
  styleUrl: './final.component.css',
})
export class FinalComponent {
  private session = inject(GameSessionService);

  private serviceHasTruck = false;
  private serviceHasCafe = false;
  private serviceHasRestaurant = false;
  private serviceHasGastronomic = false;

  get hasTruck(): boolean {
    if (this.serviceHasTruck) return this.serviceHasTruck;
    this.serviceHasTruck =
      this.session.upgradesSignal().find((u) => u.id === 45) != undefined;
    return this.serviceHasTruck;
  }

  get hasCafe(): boolean {
    if (this.serviceHasCafe) return this.serviceHasCafe;
    this.serviceHasCafe =
      this.session.upgradesSignal().find((u) => u.id === 46) != undefined;
    return this.serviceHasCafe;
  }

  get hasRestaurant(): boolean {
    if (this.serviceHasRestaurant) return this.serviceHasRestaurant;
    this.serviceHasRestaurant =
      this.session.upgradesSignal().find((u) => u.id === 47) != undefined;
    return this.serviceHasRestaurant;
  }

  get hasGastronomic(): boolean {
    if (this.serviceHasGastronomic) return this.serviceHasGastronomic;
    this.serviceHasGastronomic =
      this.session.upgradesSignal().find((u) => u.id === 48) != undefined;
    return this.serviceHasGastronomic;
  }
}
