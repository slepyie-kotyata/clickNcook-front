import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ReplaySubject } from 'rxjs';
import { IData } from '../../../entities/api';
import { ErrorService } from './game/error.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private isConnected: boolean = false;
  private socket$!: WebSocketSubject<any>;
  private dataSubject = new ReplaySubject<IData>(1);
  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;

  constructor(private error: ErrorService) {}

  get connected() {
    return this.isConnected;
  }

  get data() {
    return this.dataSubject.asObservable();
  }

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
          this.error.handle(error);
          this.close();
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
