import {Boost} from '../../entities/types';

// Генерация текста для тултипа буста
export function boostTooltip(value: number, type: Boost): string {
  const label =
    type === 'dPc'
      ? 'блюда за клик'
      : type === 'mPc'
        ? 'монет за клик'
        : type === 'dPs'
          ? 'блюд в секунду'
          : type === 'mPs'
            ? 'монет в секунду'
            : type === 'dM'
              ? 'множитель блюд за клик'
              : type === 'mM'
                ? 'множитель монет за клик'
                : type === 'dpM'
                  ? 'множитель пассивных блюд'
                  : type === 'mpM'
                    ? 'множитель пассивного дохода'
                    : type === 'sPs'
                      ? 'к продаже блюд'
                      : '';

  return label ? `+${value} ${label}` : '';
}
