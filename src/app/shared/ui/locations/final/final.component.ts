import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {GameStore} from '../../../lib/stores/gameStore';

@Component({
  selector: 'app-final',
  standalone: true,
  imports: [NgIf],
  templateUrl: './final.component.html',
  styleUrl: './final.component.css',
})
export class FinalComponent {
  private store = inject(GameStore);

  private serviceHasTruck = false;
  private serviceHasCafe = false;
  private serviceHasRestaurant = false;
  private serviceHasGastronomic = false;

  get hasTruck(): boolean {
    if (this.serviceHasTruck) return this.serviceHasTruck;
    this.serviceHasTruck =
      this.store.session()?.upgrades.current.find((u) => u.id === 45) != undefined;
    return this.serviceHasTruck;
  }

  get hasCafe(): boolean {
    if (this.serviceHasCafe) return this.serviceHasCafe;
    this.serviceHasCafe =
      this.store.session()?.upgrades.current.find((u) => u.id === 46) != undefined;
    return this.serviceHasCafe;
  }

  get hasRestaurant(): boolean {
    if (this.serviceHasRestaurant) return this.serviceHasRestaurant;
    this.serviceHasRestaurant =
      this.store.session()?.upgrades.current.find((u) => u.id === 47) != undefined;
    return this.serviceHasRestaurant;
  }

  get hasGastronomic(): boolean {
    if (this.serviceHasGastronomic) return this.serviceHasGastronomic;
    this.serviceHasGastronomic =
      this.store.session()?.upgrades.current.find((u) => u.id === 48) != undefined;
    return this.serviceHasGastronomic;
  }
}
