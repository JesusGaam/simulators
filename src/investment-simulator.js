import { PLAZO_FIJO_DATA } from "./constants/investment.js";
import * as inv from "./utilities/investment-utilities.js";

const simulate = (amount, days) => {
  const { rate, gatNominal, gatReal } = inv.getRate(
    amount,
    days,
    PLAZO_FIJO_DATA.rates
  );
  const returns = inv.returns(amount, days, rate / 100);

  return {
    rate,
    gatNominal,
    gatReal,
    returns,
  };
};

const amount = 20000;

// SIMULACION A 90 DIAS
console.log(simulate(amount, 90));
// SIMULACION A 180 DIAS
console.log(simulate(amount, 180));
// SIMULACION A 365 DIAS
console.log(simulate(amount, 365));
// SIMULACION A 541 DIAS
console.log(simulate(amount, 541));
