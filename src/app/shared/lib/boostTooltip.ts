export function boostTooltip(value: number, boostType: string | string): string {
    const label =
      boostType === 'dPc' ? 'блюда за клик' :
      boostType === 'mPc' ? 'монет за клик' :
      boostType === 'dPs' ? 'блюд в секунду' :
      boostType === 'dM'  ? 'множитель блюд за клик' :
      boostType === 'mM'  ? 'множитель монет за клик' :
      boostType === 'dpM' ? 'множитель пассивных блюд' :
      boostType === 'mpM' ? 'множитель пассивного дохода' :
      '';
  
    return label ? `+${value} ${label}` : '';
  }
  