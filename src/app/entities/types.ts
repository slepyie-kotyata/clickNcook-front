/** Типы апгрейдов, доступных в игре */
export type Upgrade =
  | 'dish'
  | 'equipment'
  | 'global'
  | 'recipe'
  | 'staff'
  | 'point';

/** Типы бустов, которые могут быть применены в игре */
export type Boost =
  | 'dPc' // dishes per click
  | 'mPc' // money per click
  | 'dPs' // dishes per second
  | 'mPs' // money per second
  | 'dM' // dishes multiplier
  | 'mM' // money multiplier
  | 'dpM' // dishes passive multiplier
  | 'mpM' // money passive multiplier
  | 'sPs'; // sold per sell

/** Типы сообщений, используемых в коммуникации с API */
export type MessageType = 'response' | 'request';

/** Типы запросов, которые могут быть отправлены к API */
export type RequestType =
  | 'cook'
  | 'sell'
  | 'upgrade_buy'
  | 'upgrade_list'
  | 'session'
  | 'level_up'
  | 'level_check'
  | 'session_reset'
  | 'passive'
  | 'error';
