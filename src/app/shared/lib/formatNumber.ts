export default function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let i = 0;
  let formattedNum = num;

  while (formattedNum >= 1000 && i < suffixes.length - 1) {
    formattedNum /= 1000;
    i++;
  }

  return `${parseFloat(formattedNum.toFixed(1))}${suffixes[i]}`;
}
