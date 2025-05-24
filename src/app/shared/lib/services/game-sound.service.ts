import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameSoundService {
  private soundEnabled = signal(true);

  get isEnabled() {
    return this.soundEnabled();
  }

  load() {
    if (localStorage.getItem('sound')) {
      this.soundEnabled.set(localStorage.getItem('sound') === 'true');
    }
  }

  play(name: string): void {
    if (this.soundEnabled()) {
      let sound = new Audio('/sounds/' + name + '.mp3');
      sound.load();
      sound.play();
    }
  }

  toggle(): void {
    this.soundEnabled.set(!this.soundEnabled());
    localStorage.setItem('sound', this.soundEnabled().toString());
  }
}
