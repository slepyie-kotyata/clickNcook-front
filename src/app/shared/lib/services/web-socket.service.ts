import { inject, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';
import { IData } from '../../../entities/api';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  isConnected: boolean = false;
  private socket$!: WebSocketSubject<any>;
  private dataSubject = new BehaviorSubject<IData>({
    money: 0,
    dishes: 0,
    rank: 0,
    xp: 0,
    prestige_current: 0,
  });
  data$ = this.dataSubject.asObservable();
  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;
  private authService = inject(AuthService);

  connect() {
    let token = localStorage.getItem('accessToken');
    this.socket$ = webSocket(`${this.socketURL}${token}`);

    this.socket$.subscribe({
      next: (data: { message: IData }) => {
        if (!this.isConnected) this.isConnected = true;
        this.dataSubject.next(data.message);
      },
      error: (error) => {
        console.error('WebSocket error', error);
        this.authService.logout();
      },
      complete: () => {
        this.authService.logout();
      },
    });
  }
}
