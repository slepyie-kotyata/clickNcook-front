import { Upgrade } from '../../entities/types';

const path = '/icons/upgrades/';

export default function getIcon(type: Upgrade, name: string): string {
  return `${path}${type}/${name}.svg`;
}
