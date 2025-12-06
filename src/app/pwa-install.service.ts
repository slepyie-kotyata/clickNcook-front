import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PwaInstallService {
  private promptEvent: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.promptEvent = e;
    });
  }

  canInstall(): boolean {
    return !!this.promptEvent;
  }

  install() {
    if (!this.promptEvent) return;
    this.promptEvent.prompt();
    this.promptEvent = null;
  }
}
