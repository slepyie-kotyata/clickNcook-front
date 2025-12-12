import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UpdateService {
  updateAvailable = signal(false);

  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event: any) => {
        if (event.data?.type === 'update-available') {
          this.updateAvailable.set(true);
        }
      });
    }
  }

  applyUpdate() {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.waiting?.postMessage({type: 'SKIP_WAITING'});
      location.reload();
    });
  }
}
