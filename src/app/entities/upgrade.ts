import { upgrades } from './types';

export interface IUpgrade {
  id: number;
  name: string;
  icon_name: string;
  upgrade_type: upgrades;
  price: number;
  access_level: number;
  boost: IBoost;
}

export interface IBoost {
  id: number;
  boost_type: string;
  value: number;
  upgrade_id: number;
}
