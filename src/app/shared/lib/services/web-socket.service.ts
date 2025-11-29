import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ReplaySubject } from 'rxjs';
import { ErrorService } from './game/error.service';
import { IMessage } from '../../../entities/api';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private isConnected = false;
  private socket$!: WebSocketSubject<IMessage>;
  private msg$ = new ReplaySubject<IMessage>(1);
  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;

  constructor(private error: ErrorService) {}

  get connected() {
    return this.isConnected;
  }

  get message() {
    return this.msg$.asObservable();
  }

  async connect(): Promise<void> {
    if (this.isConnected && this.socket$) {
      return;
    }

    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');

      this.socket$ = webSocket<IMessage>(`${this.socketURL}${token}`);

      this.socket$.subscribe({
        next: (msg: IMessage) => {
          if (!this.isConnected) {
            this.isConnected = true;
            resolve();
          }
          this.msg$.next(msg);
        },
        error: (error) => {
          this.isConnected = false;
          console.log('error by ws service');
          this.error.handle(error);
          reject(error);
        },
        complete: () => {
          this.isConnected = false;
        },
      });
    });
  }

  send(msg: IMessage) {
    this.socket$.next(msg);
  }

  close() {
    if (this.socket$) {
      this.socket$.complete();
    }
    this.isConnected = false;
  }
}
