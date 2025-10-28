import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Upgrade } from '../../../../entities/types';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private selectedMenuType: BehaviorSubject<Upgrade> =
    new BehaviorSubject<Upgrade>('dish');

  constructor(
    private sound: SoundService,
  ) {}

  get menu() {
    return this.selectedMenuType;
  }

  selectMenuType(type: Upgrade) {
    if (type === this.selectedMenuType.value) return;

    this.sound.play('click');
    this.selectedMenuType.next(type);
  }
}
