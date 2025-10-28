import {inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, delay, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ISession, IUpgrade} from '../../../entities/game';
import {WebSocketService} from './web-socket.service';
import {SessionService} from './game/session.service';
import {Upgrade} from '../../../entities/types';
import {AuthService} from './auth.service';
import {SoundService} from './game/sound.service';
import {ErrorService} from './game/error.service';
import {IMessage} from '../types';
import {Session} from '../session';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private loaded = signal(false);
  private _session = inject(Session);

  get Session(){
    return this._session;
  }

  constructor(
    private ws: WebSocketService,
    private sound: SoundService,
    private error: ErrorService,
  ) {}

  get isLoaded() {
    return this.loaded();
  }

  async loadData() {
    this.loaded.set(false);
    try {
      if(this.ws.connected)
        this.ws.close();

      await this.ws.connect().then(()=>{
        this.ws.message.subscribe((msg) => {
          this.newMessage(msg);
        });
      });


      this.sound.load();
      this.loaded.set(true);
    } catch (error) {
      this.error.handle(error);
    }
  }

  async newMessage(msg: IMessage){
    console.log("Response from WS:");
    console.log("Action: " + msg.Action);
    console.log("Data: " + msg.Data);
  }

  cook(){
    this.ws.send({Action:"cook", Data: ""})
  }

  sell() {
    this.ws.send({Action:"sell", Data:""})
  }

  buy(id: number){
    this.ws.send({Action:"buy", Data:`id:${id}`})
  }

  list(){
    this.ws.send({Action:"list", Data:""})
  }

  update_session(){
    this.ws.send({Action:"session", Data:""})
  }

  levelUp(){
    this.ws.send({Action:"level_up", Data: ""})
  }

  async prestige(){
    this.ws.send({Action:"reset",Data:""});
  }

}
