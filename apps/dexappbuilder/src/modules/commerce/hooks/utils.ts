import Decimal from 'decimal.js';

export function sumItems(arr: Decimal[]) {
  return arr.reduce((prev, curr) => {
    return prev.add(curr);
  }, new Decimal('0'));
}
