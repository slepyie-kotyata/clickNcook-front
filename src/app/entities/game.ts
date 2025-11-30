import {Boost, Upgrade} from './types';

/** Улучшение, доступное для покупки в игре */
export interface IUpgrade {
  id: number;
  name: string;
  icon_name: string;
  upgrade_type: Upgrade;
  /** Фактор цены (умножается на базовую цену) */
  price_factor: number;
  price: number;
  /** Уровень доступа, необходимый для покупки */
  access_level: number;
  /** Параметры буста, предоставляемого улучшением */
  boost: IBoost;
  /** Количество раз, сколько улучшение было куплено */
  times_bought: number;
}

/** Описание буста, который даёт улучшение */
export interface IBoost {
  id: number;
  boost_type: Boost;
  value: number;
}

/** Сессия пользователя, содержащая информацию о прогрессе в игре */
export interface ISession {
  money: number;
  dishes: number;
  prestige_value: number;
  user_id: number;
  level: ILevel;
  prestige: IPrestige;
  user_email: string;
}

/** Параметры престижа игрока */
export interface IPrestige {
  /** Текущее значение престижа */
  current_value: number;
}

/** Уровень пользователя в игре, содержащий ранг и опыт */
export interface ILevel {
  rank: number;
  xp: number;
}

/** Порядок отображения типов улучшений в меню */
export const upgradeTypeOrder: Upgrade[] = [
  'dish',
  'equipment',
  'global',
  'recipe',
  'staff',
  'point',
];
