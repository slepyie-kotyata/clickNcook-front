export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IUser {
  lvl: number;
  money: number;
  dishes: number;
  prestige: number;
}

export interface IData {
  money: number;
  dishes: number;
  rank: number;
  xp: number;
  prestige_current: number;
}
