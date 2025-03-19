export function convertDurationInDays({
  duration,
}: {
  duration?: number | null;
}) {
  if (!duration) {
    return "";
  }
  if (Number(duration) === 0) {
    return "";
  }

  const days = Number(duration) / 86400;
  if (days > 1) {
    return `${days} days`;
  } else {
    return `${days} day`;
  }
}
