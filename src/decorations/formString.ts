export const prettyPrice = (price: string): string => {
  return `¥${price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
};
