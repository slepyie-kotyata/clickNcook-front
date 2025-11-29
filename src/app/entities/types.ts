// Типы апгрейдов, доступных в игре
export type Upgrade =
  | 'dish'
  | 'equipment'
  | 'global'
  | 'recipe'
  | 'staff'
  | 'point';

// Типы бустов, которые могут быть применены в игре
export type Boost =
  | 'dPc'
  | 'mPc'
  | 'dPs'
  | 'mPs'
  | 'dM'
  | 'mM'
  | 'dpM'
  | 'mpM'
  | 'sPs';

// Типы сообщений, используемых в коммуникации с API
export type MessageType = 'response' | 'request';

// Типы запросов, которые могут быть отправлены к API
export type RequestType =
  'cook'
  | 'sell'
  | 'upgrade_buy'
  | 'upgrade_list'
  | 'session'
  | 'level_up'
  | 'level_check'
  | 'session_reset'
  | 'passive'
  | 'error';
