import { round } from "./math-utilities";

export const returns = (amount, term, rate) => {
  const ret = ((amount * rate) / 360) * term;
  return round(ret);
};

export const GATNominal = (annualTerm, rate) => {
  const nominal = Math.pow(1 + rate / annualTerm, annualTerm) - 1;
  return round(nominal, 4);
};

export const GATReal = (gatNominal, inflacion) => {
  const real = (1 + gatNominal) / (1 + inflacion) - 1;
  return round(real, 4);
};

export const annualTerm = (days, frecuency = "D") => {
  const term = {
    D: 360 / days,
    W: 52,
    K: 26,
    S: 24,
    28: 13,
    M: 12,
    B: 6,
    T: 4,
    SE: 2,
    Y: 1,
  };

  return term[frecuency] || term["D"];
};

export const getRate = (amount, term, plazoFijoRates) => {
  let rate = [];
  plazoFijoRates.forEach((rg) => {
    if (amount >= rg.minAmount && amount <= rg.maxAmount) {
      let prev = "3";
      for (const key in rg.rates) {
        const actual = parseInt(key) - 1;

        if (key === "3") {
          prev = key;
        } else if (term >= parseInt(prev) && term <= actual) {
          rate = rg.rates[prev] || [];
          break;
        } else if (term >= 541) {
          rate = rg.rates[541];
          break;
        }
        prev = key;
      }
    }
  });
  return {
    rate: rate[0],
    gatNominal: rate[1],
    gatReal: rate[2],
  };
};
