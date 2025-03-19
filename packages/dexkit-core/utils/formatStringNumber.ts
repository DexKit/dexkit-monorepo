export function formatStringNumber({
  value,
  maxDecimals = 3,
}: {
  value: string;
  maxDecimals?: number;
}) {
  // TODO: improve this code in the future
  // pass to a memoized component or something

  let index = value.indexOf(".");

  while (true) {
    index = index + 1;

    if (value.at(index) !== "0") {
      break;
    }
  }

  let ending = index;

  while (true) {
    ending = ending + 1;

    if (ending === value.length - 1 || ending === index + maxDecimals) {
      break;
    }
  }

  return value.substring(0, ending);
}
