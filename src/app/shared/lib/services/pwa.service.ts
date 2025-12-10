import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PwaService {
  private deferredPrompt: any = null;

  private isInstallAvailable = signal(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallAvailable.set(true);
    });
  }

  canInstall() {
    return this.isInstallAvailable();
  }

  async install() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();

    const result = await this.deferredPrompt.userChoice;

    this.deferredPrompt = null;
    this.isInstallAvailable.set(false);
  }
}
