import { round } from "./math-utilities";
// const { round } = require("./math-utilities");

export const frequencyDays = {
  W: {
    days: 7,
    periodsPerYear: 360 / 7,
  },
  K: {
    days: 14,
    periodsPerYear: 360 / 14,
  },
  S: {
    days: 15,
    periodsPerYear: 360 / 15,
  },
  M: {
    days: 30,
    periodsPerYear: 12,
  },
};

export const rateFrequency = (annualRate, frequency = "M", iva = true) => {
  const ivaPercentage = iva ? 1.16 : 1;
  const frequencyNumber = periodsPerYear(frequency);

  return (annualRate * ivaPercentage) / frequencyNumber;
};

export const presentValue = (rateFrequency, totalPayments, payment) => {
  return (
    ((payment *
      ((1 - Math.pow(1 + rateFrequency, -totalPayments)) / rateFrequency)) /
      100) *
    100
  );
};

export const futureValue = (payment, totalPayments) => {
  return payment * totalPayments;
};

export const cashCommission = (amount, commissionPercent, iva = true) => {
  const ivaPercentage = iva ? 1.16 : 1;
  return amount * commissionPercent * ivaPercentage;
};

export const disbursement = (amount, commissionPercent, iva = true) => {
  const commission = cashCommission(amount, commissionPercent, iva);
  return amount - commission;
};

export const payment = (amount, totalPayments, rateFrequency) => {
  return (
    (rateFrequency * amount) / (1 - Math.pow(1 + rateFrequency, -totalPayments))
  );
};

export const totalPayments = (amount, payment, rateFrequency) => {
  payment = payment > 0 ? -1 * payment : payment;
  const totalPayments =
    Math.log((amount * rateFrequency) / payment + 1) /
    Math.log(1 + rateFrequency);

  return Math.ceil(totalPayments < 0 ? -1 * totalPayments : totalPayments);
};

export const interests = (amount, rate, frequency) => {
  return amount * (rate / periodsPerYear(frequency));
};

export const amortizationTable = (amount, rate, payment, totalPayments, frequency) => {
  let initialBalance;
  let finalBalance = 0;
  let sumCapital = 0;
  let interest;
  let capital;
  const amortizationTable = [
    [
      "Nº de pago",
      "Saldo inicial",
      "Cuota",
      "Interés",
      "Capital",
      "Saldo final",
    ],
  ];
  payment = round(payment);

  for (let i = 1; i <= totalPayments; i++) {
    initialBalance = i == 1 ? amount : finalBalance;

    if (i < totalPayments) {
      interest = round(interests(initialBalance, rate, frequency));
      capital = round(payment - interest);
      sumCapital = round(sumCapital + capital);
    } else {
      capital = round(amount - sumCapital);
      interest = round(interests(capital, rate, frequency));
    }

    finalBalance = round(initialBalance - capital);
    amortizationTable.push([
      i,
      initialBalance,
      payment,
      interest,
      capital,
      finalBalance > 0 ? finalBalance : 0,
    ]);
  }

  return amortizationTable;
};

export const periodsPerYear = (frequency, periodsForCAT = false) => {
  const periods = frequencyDays[frequency].periodsPerYear || 0;
  return periodsForCAT ? Math.ceil(periods) : periods;
};

/*************
 *
 * cat() Devuelve el CAT estimado segun los siguientes parametros:
 * @amount => Monto total del prestamo (sin descontar comisiones)
 * @cashCommission => Cargos por apertura
 * @payment => Cuota periodica (mensual, quincenal, catorcenal o semanal)
 * @totalPayments => Numero total de pagos del credito
 * @frequency => Con la frecuencia se obtione el número pagos al año segun Banxico (semanas: 52, catorcenal: 26, quincenas: 24, meses: 12)
 *
 * Documentacion oficial en:
 * https://www.banxico.org.mx/sistema-financiero/d/%7B5BD610E5-EE24-04AA-A21E-53B2176C2228%7D.pdf
 *
 *************/
export const cat = (amount, cashCommission, payment, totalPayments, frequency) => {
  try {
    let cat = 0;
    let minCat = 0;
    let maxCat = 0;
    let tempCat = 0;

    for (let counter = 0; counter <= 25; counter++) {
      const calculedCAT = estimateCAT(
        amount,
        cashCommission,
        payment,
        totalPayments,
        frequency,
        cat
      );

      if (calculedCAT > 0) {
        tempCat = cat;
        cat = (cat + minCat) / 2;
        maxCat = tempCat;
      } else if (maxCat == 0) {
        minCat = cat;
        cat = cat + 50;
      } else {
        tempCat = cat;
        cat = (cat + maxCat) / 2;
        minCat = tempCat;
      }
    }
    return { CAT: round(cat, 10).toFixed(1), fullCAT: cat };
  } catch (e) {
    return { CAT: "0.0", fullCAT: 0.0 };
  }
};

const estimateCAT = (
  amount,
  cashCommission,
  payment,
  totalPayments,
  frequency,
  cat
) => {
  let value = 0;
  const periods = periodsPerYear(frequency, true);

  for (let i = 0; i <= totalPayments; i++) {
    value +=
      (i > 0 ? payment : cashCommission) / Math.pow(1 + cat / 100, i / periods);
  }

  return amount - value;
};