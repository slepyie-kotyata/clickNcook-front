import {IUpgrade} from '../../entities/game';
import {TutorialStepConfig} from '../../entities/tutorial.types';
import {GameService} from './services/game/game.service';
import {GameStore} from './stores/gameStore';

export function createTutorialConfig(game: GameService, store: GameStore): TutorialStepConfig[] {
  return [
    {
      id: 'open-menu',
      anchor: 'menu',
      text: 'Открой меню улучшений',
      blockScreen: true,
      darkenScreen: true,
      isCompleted: () => true,
      next: 'buy-sandwich',
    },
    {
      id: 'buy-sandwich',
      anchor: 'upgrade-sandwich',
      text: 'Купи Сэндвич — без первого блюда готовка невозможна',
      blockScreen: true,
      darkenScreen: true,
      autoAdvance: true,
      isCompleted: () =>
        store.session()?.upgrades.current.some(
          (u: IUpgrade) => u.id === 1
        ) ?? false,
      next: window.innerWidth >= 1280 ? 'cook' : 'close-menu',
      requires: 'open-menu',
    },
    {
      id: 'close-menu',
      anchor: 'menu-close',
      text: 'Закрой меню улучшений',
      blockScreen: true,
      darkenScreen: true,
      isCompleted: () => true,
      next: 'cook',
    },
    {
      id: 'cook',
      anchor: 'cook',
      text: 'Приготовь блюдо, чтобы было что продавать',
      blockScreen: true,
      darkenScreen: true,
      autoAdvance: true,
      isCompleted: () => (store.session()?.dishes ?? 0) > 0,
      next: 'sell',
    },
    {
      id: 'sell',
      anchor: 'sell',
      text: 'Продай блюдо и получи монеты',
      blockScreen: true,
      darkenScreen: true,
      autoAdvance: true,
      isCompleted: () => (store.session()?.money ?? 0) > 0,
      next: 'xp',
    },
    {
      id: 'xp',
      anchor: 'xp-bar',
      text: 'За действия ты получаешь опыт и повышаешь уровень',
      blockScreen: false,
      darkenScreen: true,
      isCompleted: () => true,
      next: 'profile',
    },
    {
      id: 'profile',
      anchor: 'profile',
      text:
        'Здесь хранятся все купленные улучшения (кроме блюд)',
      blockScreen: true,
      darkenScreen: true,
      isCompleted: () => game.profileWindowOpen(),
      next: 'profile-exit',
    },
    {
      id: 'profile-exit',
      anchor: 'profile-exit',
      blockScreen: false,
      darkenScreen: false,
      text:
        'Здесь хранятся все купленные улучшения (кроме блюд)',
      isCompleted: () => !game.profileWindowOpen(),
      next: 'prestige',
    },
    {
      id: 'prestige',
      anchor: 'prestige',
      text:
        'Престиж позволяет сбросить прогресс и получить бонус',
      blockScreen: true,
      darkenScreen: true,
      isCompleted: () => game.prestigeWindowOpen(),
      next: 'prestige-exit',
    },
    {
      id: 'prestige-exit',
      anchor: 'prestige-exit',
      blockScreen: false,
      darkenScreen: false,
      text:
        'Престиж позволяет сбросить прогресс и получить бонус',
      isCompleted: () => !game.prestigeWindowOpen(),
      next: 'done',
    },
    {
      id: 'done',
      text: 'Обучение завершено. Удачи!',
      isCompleted: () => true,
    },
  ];
}
