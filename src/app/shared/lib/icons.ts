import { upgrades } from '../../entities/types';

const path = '/icons/upgrades/';

export default function getIcon(type: upgrades, name: string): string {
  return `${path}${type}/${name}.png`;
}
