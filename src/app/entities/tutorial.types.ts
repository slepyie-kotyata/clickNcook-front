export type TutorialStepId =
  | 'open-menu'
  | 'select-dish'
  | 'buy-sandwich'
  | 'close-menu'
  | 'cook'
  | 'sell'
  | 'xp'
  | 'profile'
  | 'profile-exit'
  | 'prestige'
  | 'prestige-exit'
  | 'done';

export interface TutorialStepConfig {
  id: TutorialStepId;

  /** Якорь в DOM (tutorialAnchor) */
  anchor?: string;

  /** Контейнер прокрутки для якоря */
  anchorContainer?: string;

  /** Текст подсказки */
  text: string;

  /** Можно ли кликать вне якоря */
  blockScreen?: boolean;

  /** Затемнять ли экран вокруг подсказки */
  darkenScreen?: boolean;

  /** Проверка, выполнен ли шаг */
  isCompleted: () => boolean;

  /** Следующий шаг */
  next?: TutorialStepId;

  /** Автоматически ли продвигаться к следующему шагу при выполнении условия */
  autoAdvance?: boolean;

  /** Требуется ли для этого шага наличие другого шага активным */
  requires?: TutorialStepId;
}
