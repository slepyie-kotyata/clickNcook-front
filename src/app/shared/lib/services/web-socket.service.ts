import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ReplaySubject } from 'rxjs';
import { IData } from '../../../entities/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  isConnected: boolean = false;
  private socket$!: WebSocketSubject<any>;
  private dataSubject = new ReplaySubject<IData>(1);
  data$ = this.dataSubject.asObservable();
  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;
  private authService = inject(AuthService);

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      this.socket$ = webSocket(`${this.socketURL}${token}`);

      this.socket$.subscribe({
        next: (data: IData) => {
          if (!this.isConnected) {
            this.isConnected = true;
            resolve();
          }
          this.dataSubject.next(data);
          this.socket$.next('success');
        },
        error: (error) => {
          this.isConnected = false;
          reject(error);
        },
        complete: () => {
          this.isConnected = false;
        },
      });
    });
  }

  close() {
    this.socket$.complete();
  }
}
