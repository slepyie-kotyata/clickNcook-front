import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 Сервис для управления звуками игры, включая воспроизведение и настройку громкости

 @example
 // Установка громкости
 soundService.setVolume(80);

 // Воспроизведение звука
 soundService.play('click');

 @remarks
 Звуковые файлы должны находиться в папке /sounds и быть в формате .mp3
 */
export class SoundService {
  private volume = signal(100);

  get currentVolume() {
    return this.volume();
  }

  /**
   Считывает сохранённую громкость из localStorage, чтобы восстановить настройки пользователя
   */
  load() {
    if (localStorage.getItem('volume')) {
      this.volume.set(parseInt(localStorage.getItem('volume') || '100', 10));
    }
  }

  /**
   Проигрывает указанный звук, если громкость больше нуля
   @param name - базовое имя аудиофайла в папке sounds
   */
  play(name: string): void {
    if (this.volume() > 0) {
      let sound = new Audio('/sounds/' + name + '.mp3');
      sound.volume = this.volume() / 100;
      sound.load();
      sound.play();
    }
  }

  /**
   Обновляет текущую громкость и сохраняет значение в localStorage
   @param value - новое значение громкости 0-100
   */
  setVolume(value: number) {
    this.volume.set(value);
    localStorage.setItem('volume', value.toString());
  }
}
