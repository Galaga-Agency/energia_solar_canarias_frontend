// file that exports functions to format the numbers to whole, one decimal, two decimal and also formats the number to M and K

export const roundToWhole = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Math.round(Number(value));
};

export const roundToOneDecimal = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Math.round(Number(value) * 10) / 10;
};

export const roundToTwoDecimal = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Math.round(Number(value) * 100) / 100;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return "0";

  const numValue = Number(value);

  if (Math.abs(numValue) >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(numValue) >= 1000) {
    return `${(numValue / 1000).toFixed(1)}k`;
  }
  return numValue.toFixed(1);
};
