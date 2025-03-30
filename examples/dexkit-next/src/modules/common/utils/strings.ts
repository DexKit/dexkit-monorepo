export function strPad(str: number) {
  return (new Array(3).join('0') + str).slice(-2);
}
