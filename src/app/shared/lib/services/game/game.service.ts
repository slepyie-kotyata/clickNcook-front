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

  prestigeWindowOpen = signal<boolean>(false);
  profileWindowOpen = signal<boolean>(false);

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

  togglePrestigeWindow() {
    const newState = !this.prestigeWindowOpen();
    this.prestigeWindowOpen.set(newState);
    this.sound.play('click');
  }

  toggleProfileWindow() {
    const newState = !this.profileWindowOpen();
    this.profileWindowOpen.set(newState);
    this.sound.play('click');
  }
}
