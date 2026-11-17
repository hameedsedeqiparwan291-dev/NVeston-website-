import { checkNumber, roundCents } from './shared.js';

export const PAYMENT_FREQUENCIES = [
  { value: 12, label: 'Monthly' },
  { value: 26, label: 'Every two weeks' },
  { value: 52, label: 'Weekly' },
  { value: 4, label: 'Quarterly' },
];

export function validateLoan({ principal, annualRatePct, termYears, paymentsPerYear }) {
  const errors = {
    principal: checkNumber(principal, { label: 'the loan amount', min: 1, max: 1e10 }),
    annualRatePct: checkNumber(annualRatePct, { label: 'the interest rate', min: 0, max: 60 }),
    termYears: checkNumber(termYears, { label: 'the repayment term', min: 0.25, max: 40 }),
  };
  if (!PAYMENT_FREQUENCIES.some((f) => f.value === paymentsPerYear)) errors.paymentsPerYear = 'Choose a payment frequency.';
  const n = Math.round(termYears * paymentsPerYear);
  if (!errors.termYears && !errors.paymentsPerYear && n < 1) errors.termYears = 'The term is too short for this payment frequency.';
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

/**
 * Fixed-rate, fully amortizing loan with equal payments.
 * The annual rate is a nominal rate divided evenly across payment periods
 * (interest compounds once per payment period). Fees, insurance and taxes are excluded.
 */
export function calculateLoan({ principal, annualRatePct, termYears, paymentsPerYear = 12 }) {
  const n = Math.round(termYears * paymentsPerYear);
  const r = annualRatePct / 100 / paymentsPerYear;
  const payment = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));

  const years = [];
  let balance = principal;
  let year = { year: 1, principal: 0, interest: 0, endBalance: principal };
  let totalInterest = 0;

  for (let k = 1; k <= n; k += 1) {
    const interest = balance * r;
    let principalPart = payment - interest;
    if (k === n) principalPart = balance; // absorb floating-point residue in the final payment
    balance -= principalPart;
    totalInterest += interest;
    year.principal += principalPart;
    year.interest += interest;
    year.endBalance = Math.max(balance, 0);
    if (k % paymentsPerYear === 0 || k === n) {
      years.push({
        year: year.year,
        principal: roundCents(year.principal),
        interest: roundCents(year.interest),
        endBalance: roundCents(year.endBalance),
      });
      year = { year: year.year + 1, principal: 0, interest: 0, endBalance: balance };
    }
  }

  return {
    numberOfPayments: n,
    periodicRate: r,
    payment: roundCents(payment),
    paymentExact: payment,
    totalPrincipal: roundCents(principal),
    totalInterest: roundCents(totalInterest),
    totalRepayment: roundCents(principal + totalInterest),
    years,
  };
}
