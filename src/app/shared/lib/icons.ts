import { upgrades } from '../../entities/types';

const path = '/icons/upgrades/';

export default function getIcon(type: upgrades, id: string): string {
  return `${path}${type}/${id}.png`;
}
