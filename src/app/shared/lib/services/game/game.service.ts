import {Injectable, signal} from '@angular/core';
import {Upgrade} from '../../../../entities/types';
import {SoundService} from './sound.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для управления состоянием игры, включая выбор меню улучшений
 */
export class GameService {
  selectedMenuType = signal<Upgrade>('dish');

  constructor(
    private sound: SoundService,
  ) {
  }

  /**
   Переключает тип отображаемых улучшений
   @param type - новое значение меню, которое нужно отобразить
   */
  selectMenuType(type: Upgrade) {
    if (type === this.selectedMenuType()) return;

    this.sound.play('click');
    this.selectedMenuType.set(type);
  }
}
