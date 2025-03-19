export const GET_LABEL_FROM_DURATION = (time: Number) => {
  switch (time) {
    case 60 * 5:
      return '5 min';
    case 60 * 60:
      return '1 hr';
    case 4 * 60 * 60:
      return '4 hrs';
    case 8 * 60 * 60:
      return '8 hrs';
    case 24 * 60 * 60:
      return '24 hrs';
    case 7 * 24 * 60 * 60:
      return '1 week';
    case 30 * 7 * 24 * 60 * 60:
      return '1 month';
    default:
      return '1 hour';
  }
};
