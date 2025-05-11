import { Component, inject } from '@angular/core';
import { GameService } from '../../../lib/services/game.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-final',
  standalone: true,
  imports: [NgIf],
  templateUrl: './final.component.html',
  styleUrl: './final.component.css',
})
export class FinalComponent {
  private gameService = inject(GameService);

  private serviceHasTruck = false;
  private serviceHasCafe = false;
  private serviceHasRestaurant = false;
  private serviceHasGastronomic = false;

  hasTruck(): boolean {
    if (this.serviceHasTruck) return this.serviceHasTruck;
    this.serviceHasTruck =
      this.gameService.userUpgrades.find((u) => u.id === 45) != undefined;
    return this.serviceHasTruck;
  }

  hasCafe(): boolean {
    if (this.serviceHasCafe) return this.serviceHasCafe;
    this.serviceHasCafe =
      this.gameService.userUpgrades.find((u) => u.id === 46) != undefined;
    return this.serviceHasCafe;
  }

  hasRestaurant(): boolean {
    if (this.serviceHasRestaurant) return this.serviceHasRestaurant;
    this.serviceHasRestaurant =
      this.gameService.userUpgrades.find((u) => u.id === 47) != undefined;
    return this.serviceHasRestaurant;
  }

  hasGastronomic(): boolean {
    if (this.serviceHasGastronomic) return this.serviceHasGastronomic;
    this.serviceHasGastronomic =
      this.gameService.userUpgrades.find((u) => u.id === 48) != undefined;
    return this.serviceHasGastronomic;
  }
}
