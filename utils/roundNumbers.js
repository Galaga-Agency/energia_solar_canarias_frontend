/**
 * Rounds a value to the nearest whole number
 * @param {number|string} value - Value to round
 * @returns {number} Rounded whole number
 */
export const roundToWhole = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Math.round(Number(value));
};

/**
 * Rounds a value to one decimal place
 * @param {number|string} value - Value to round
 * @returns {number} Value rounded to one decimal place
 */
export const roundToOneDecimal = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0;
  }
  return Math.round(Number(value) * 10) / 10;
};
