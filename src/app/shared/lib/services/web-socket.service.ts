import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ReplaySubject } from 'rxjs';
import { ErrorService } from './game/error.service';
import {IMessage} from '../types';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private isConnected: boolean = false;
  private socket$!: WebSocketSubject<any>;
  private msg = new ReplaySubject<IMessage>(1);
  private readonly socketURL = import.meta.env.NG_APP_WEBSOCKET_API;

  constructor(private error: ErrorService) {}

  get connected() {
    return this.isConnected;
  }

  get message() {
    return this.msg.asObservable();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      this.socket$ = webSocket(`${this.socketURL}${token}`);

      this.socket$.subscribe({
        next: (msg: IMessage) => {
          if (!this.isConnected) {
            this.isConnected = true;
            resolve();
          }
          this.msg.next(msg);
          let success = JSON.stringify({Action: "success", Data: ""});
          this.socket$.next(success);
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
      //TEMP
      this.isConnected = true;
      resolve();
    });
  }

  send(msg: IMessage){
    let message = JSON.stringify(msg);
    this.socket$.next(message);
  }

  close() {
    this.socket$.complete();
  }
}
