import {Boost} from '../../entities/types';

// Генерация текста для тултипа буста
export function boostTooltip(value: number, type: Boost): string {
  const label =
    type === 'dPc'
      ? 'блюд за клик'
      : type === 'mPc'
        ? 'монет за клик'
        : type === 'dPs'
          ? 'блюд в сек'
          : type === 'mPs'
            ? 'монет в сек'
            : type === 'dM'
              ? 'множитель блюд за клик'
              : type === 'mM'
                ? 'множитель монет за клик'
                : type === 'dpM'
                  ? 'пассивный множитель блюд'
                  : type === 'mpM'
                    ? 'пассивный множитель монет'
                    : type === 'sPs'
                      ? 'к продаже блюд'
                      : '';

  return label ? `+${value} ${label}` : '';
}
