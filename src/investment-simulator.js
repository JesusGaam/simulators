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
console.log(simulate(amount, 90));
console.log(simulate(amount, 180));
console.log(simulate(amount, 365));
console.log(simulate(amount, 541));
