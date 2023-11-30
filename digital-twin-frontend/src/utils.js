export const numFormatter = (val) => {
  const num = Number(val);

  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + "K";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }

  return Number(num.toFixed(2));
};
