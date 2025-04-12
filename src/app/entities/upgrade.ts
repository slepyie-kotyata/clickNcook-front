import { upgrades } from './types';

export interface IUpgrade {
  id: number;
  icon_name: string;
  upgrade_type: upgrades;
  name: string;
  price: number;
}
