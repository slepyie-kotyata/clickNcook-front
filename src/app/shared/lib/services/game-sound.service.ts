import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameSoundService {
  private volume = signal(100);

  get currentVolume() {
    return this.volume();
  }

  load() {
    if (localStorage.getItem('volume')) {
      this.volume.set(parseInt(localStorage.getItem('volume') || '100', 10));
    }
  }

  play(name: string): void {
    if (this.volume() > 0) {
      let sound = new Audio('/sounds/' + name + '.mp3');
      sound.volume = this.volume() / 100;
      sound.load();
      sound.play();
    }
  }

  setVolume(value: number) {
    this.volume.set(value);
    localStorage.setItem('volume', value.toString());
  }
}
