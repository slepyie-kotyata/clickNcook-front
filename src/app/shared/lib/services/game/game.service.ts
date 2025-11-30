import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Upgrade} from '../../../../entities/types';
import {SoundService} from './sound.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для управления состоянием игры, включая выбор меню улучшений
 */
export class GameService {
  private selectedMenuType: BehaviorSubject<Upgrade> =
    new BehaviorSubject<Upgrade>('dish');

  constructor(
    private sound: SoundService,
  ) {
  }

  /** Текущее выбранное меню улучшений */
  get menu() {
    return this.selectedMenuType;
  }

  /**
   Переключает тип отображаемых улучшений
   @param type - новое значение меню, которое нужно отобразить
   */
  selectMenuType(type: Upgrade) {
    if (type === this.selectedMenuType.value) return;

    this.sound.play('click');
    this.selectedMenuType.next(type);
  }
}
