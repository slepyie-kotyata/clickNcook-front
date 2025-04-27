import { Boost, Upgrade } from './types';

export interface IUpgrade {
  id: number;
  name: string;
  icon_name: string;
  upgrade_type: Upgrade;
  price_factor: number;
  price: number;
  access_level: number;
  boost: IBoost;
}

export interface IBoost {
  id: number;
  boost_type: Boost;
  value: number;
}

export default interface ISession {
  id: number;
  money: number;
  dishes: number;
  //prestige: number; ?
  //level: ILevel;
  user_id: number;
}

export interface ILevel {
  rank: number;
  points: number;
}
