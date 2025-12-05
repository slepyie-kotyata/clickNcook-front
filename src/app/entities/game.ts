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
  user_id: number;
  user_email: string;
  money: number;
  dishes: number;
  level: ILevel;
  prestige: IPrestige;
  upgrades: {
    available: IUpgrade[],
    current: IUpgrade[]
  }

}

export interface IPrestige {
  /** Текущее значение престижа (в звездах) */
  current_value: number;
  /** Текущее значение множителя престижа, влияющее на доход */
  current_boost_value: number;
  /** Накопленное значение престижа за текущую сессию (будет добавлено к текущему после сброса) */
  accumulated_value: number;
}

export interface ILevel {
  rank: number;
  xp: number;
}

export const upgradeTypeOrder: Upgrade[] = [
  'dish',
  'equipment',
  'global',
  'recipe',
  'staff',
  'point',
];
