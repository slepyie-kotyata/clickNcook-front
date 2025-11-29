import {inject, Injectable, signal} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {SoundService} from './game/sound.service';
import {ErrorService} from './game/error.service';
import {Session} from '../session';
import {IMessage} from '../../../entities/api';

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
      console.log("error by api service");
    }
  }

  async newMessage(msg: IMessage){
    console.log("Response from WS:");
    console.log("Action: " + msg.message_type);
    console.log("Data: " + JSON.stringify(msg.data));
  }

  cook(){
    this.ws.send({message_type:"request", data: {}})
  }

  sell() {
    this.ws.send({message_type:"request", data: {}})
  }

  buy(id: number){
    this.ws.send({message_type:"request", data: {}})
  }

  list(){
    this.ws.send({message_type:"request", data: {}})
  }

  update_session(){
    this.ws.send({message_type:"request", data: {}})
  }

  levelUp(){
    this.ws.send({message_type:"request", data: {}})
  }

  async prestige(){
    this.ws.send({message_type:"request",data:{}});
  }

}
