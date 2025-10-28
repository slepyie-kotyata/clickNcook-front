export interface IMessage {
  Action: action;
  Data: string;
}

export type action = 'cook' | 'buy' | 'sell' | 'list' | 'session' | 'level_up' | 'check_level' | 'reset' | 'passive' | 'leave';

