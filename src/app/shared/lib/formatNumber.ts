/** Форматирует число, добавляя суффиксы для больших чисел (K, M, B и т.д.)
 * @param num - число для форматирования
 * @param digits - количество знаков после запятой (по умолчанию 1)
 * @returns отформатированная строка с числом и суффиксом
 * @example
 * formatNumber(123) // "123"
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567, 2) // "1.23M"
 */
export default function formatNumber(num: number, digits: number = 1): string {
  if (num === 0) return '0';
  if (num < 1000) return Number.isInteger(num) ? `${num}` : num.toFixed(digits);

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
    : rounded.toFixed(digits);

  return `${displayNum}${suffixes[i]}`;
}
