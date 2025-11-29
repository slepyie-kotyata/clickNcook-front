import {MessageType} from './types';

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IData {
  money: number;
  dishes: number;
  rank: number;
  xp: number;
  prestige_current: number;
}

export interface IMessage {
  message_type: MessageType;
  data: { [key: string]: any };
}



