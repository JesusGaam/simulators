import { TU_META_KUBO_DATA } from "./constants/loan.js";
import * as loan from "./utilities/loan-utilities.js";

/* LOAN INPUTS */
const rate = TU_META_KUBO_DATA.avgRate;
const amount = 10000;
const suggestedPayment = 1500;
const frequency = "M"; // M=mensual S=quincenal K=catorcenal W=semanal
const comissionRate = 5.0;
const includeIVA = true;
/* END LOAN INPUTS */

const frequentizedRate = loan.rateFrequency(rate / 100, frequency, includeIVA);
const totalPayments = loan.totalPayments(
  amount,
  suggestedPayment,
  frequentizedRate
);
const realPayment = loan.payment(amount, totalPayments, frequentizedRate);
const amortizationTable = loan.amortizationTable(
  amount,
  rate / 100,
  realPayment,
  totalPayments,
  frequency
);

const catComission = loan.cashCommission(amount, comissionRate / 100, false);
const catRate = loan.rateFrequency(rate / 100, frequency, false);
const catPayment = loan.payment(amount, totalPayments, catRate);
const cat = loan.cat(
  amount,
  catComission,
  catPayment,
  totalPayments,
  frequency
);

console.log({
  rate,
  totalPayments,
  realPayment,
  amortizationTable,
  cat,
});
