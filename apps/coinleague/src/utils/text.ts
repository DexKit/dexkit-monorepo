export const truncateText = (text: string | undefined, maxLength: number = 100) => {
  if (text !== undefined && text.length >= maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text || '';
};