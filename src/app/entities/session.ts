import { IUpgrade } from './upgrade';

export default interface ISession {
  id: number;
  money: number;
  dishes: number;
  //prestige: number; ?
  //level: ILevel;
  upgrades: IUpgrade[];
  user_id: number;
}

export interface ILevel {
  rank: number;
  points: number;
}
