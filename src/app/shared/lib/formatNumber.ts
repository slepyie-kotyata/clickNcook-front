// Форматирует число, добавляя суффиксы для больших чисел (K, M, B и т.д.)
export default function formatNumber(num: number): string {
  if (num === 0) return '0';
  if (num < 1000) return Number.isInteger(num) ? `${num}` : num.toFixed(1);

  const suffixes = [
    '',
    'K', //thousand
    'M', //million
    'B', //billion
    't', //trillion
    'Qa', //quadrillion
    'Qi', //Quintillion
    'Sx', //Sextillion
    'Sp', //Septillion
    'Oc', //Octillion
    'No', //Nonillion
    'd', //Decillion
    'U', //Undecillion
    'D', //Duodecillion
    'T', //Tredecillion
    'Qt', //Quattuordecillion
    'Qd', //Quindecillion
    'Sd', //Sexdecillion
    'St', //Septendecillion
    'O', //Octodecillion
    'N', //Novemdecillion
    'v', //Vigintillion
    'c', //Unvigintillion
  ];
  let i = 0;
  let formattedNum = num;

  while (formattedNum >= 1000 && i < suffixes.length - 1) {
    formattedNum /= 1000;
    i++;
  }

  const rounded = parseFloat(formattedNum.toFixed(1));
  const displayNum = Number.isInteger(rounded)
    ? rounded.toFixed(0)
    : rounded.toFixed(1);

  return `${displayNum}${suffixes[i]}`;
}
