export type Upgrade =
  | 'dish'
  | 'equipment'
  | 'global'
  | 'recipe'
  | 'staff'
  | 'point';

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

export type MessageType = 'response' | 'request' | 'keep_alive';

export type Action = 'cook' | 'sell' | 'upgrade_buy' | 'upgrade_list' | 'session' | 'level_up' | 'level_check' | 'session_reset' | 'passive' | 'leave';
