export const round = (number, nDigits = 2) => {
  nDigits = digitsToRound(nDigits);
  return Math.round(number * nDigits) / nDigits;
};

const digitsToRound = (nDigits) => {
  return nDigits > 0 ? Math.pow(10, nDigits) : 1;
};
