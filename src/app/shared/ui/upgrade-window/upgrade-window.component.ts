import { Component, inject } from '@angular/core';
import { UpgradeButtonComponent } from '../upgrade-button/upgrade-button.component';
import { IUpgrade } from '../../../entities/upgrade';
import { NgForOf } from '@angular/common';
import { GameService } from '../../lib/services/game.service';

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent, NgForOf],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css',
})
export class UpgradeWindowComponent {
  gameService = inject(GameService);
  availableUpgrades: IUpgrade[] = [];

  constructor() {
    this.getAvailableUpgrades();
  }

  handleBuy(id: number) {
    //TODO: api

    let price = this.availableUpgrades.find((x) => x.id == id)?.price;

    if (price) {
      this.gameService.decreaseMoney(price);
      this.availableUpgrades = this.availableUpgrades.filter((x) => x.id != id);
    }
  }

  getAvailableUpgrades() {
    //TODO: get from api

    this.availableUpgrades = [
      {
        id: 1,
        upgrade_type: 'dish',
        name: 'Гамбургер',
        price: 100,
      },
      {
        id: 2,
        upgrade_type: 'dish',
        name: 'Хот-Дог',
        price: 500,
      },
      {
        id: 3,
        upgrade_type: 'dish',
        name: 'Хот-Дог',
        price: 500,
      },
    ];
  }
}
