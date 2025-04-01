import { Component } from '@angular/core';
import formatNumber from '../../lib/formatNumber';

@Component({
  selector: 'app-gameplay-layout',
  standalone: true,
  imports: [],
  templateUrl: './gameplay-layout.component.html',
  styleUrl: './gameplay-layout.component.css',
})
export class GameplayLayoutComponent {
  prestigeLvl: number = 0; //TODO: get prestige lvl from api
  playerLvl: number = 15; //TODO: get Player lvl from api

  protected getPrestigeLvl(): string {
    return formatNumber(this.prestigeLvl);
  }

  protected getPlayerLvlPercentage(): number {
    let nextLvl = 100; //TODO: get from api
    return (this.playerLvl / nextLvl) * 100;
  }
}
