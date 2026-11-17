import { checkNumber, roundCents } from './shared.js';

export const CASHFLOW_DEFAULTS = {
  startingCash: 20000,
  monthlySales: 50000,
  salesGrowthPct: 4,
  variableCostPct: 55,
  fixedCosts: 16000,
  financingPayment: 1500,
  paymentDelayMonths: 2,
  months: 12,
};

export function validateCashFlow(i) {
  const errors = {
    startingCash: checkNumber(i.startingCash, { label: 'starting cash', min: -1e10, max: 1e10 }),
    monthlySales: checkNumber(i.monthlySales, { label: 'monthly sales', min: 0, max: 1e10 }),
    salesGrowthPct: checkNumber(i.salesGrowthPct, { label: 'monthly sales change', min: -50, max: 50 }),
    variableCostPct: checkNumber(i.variableCostPct, { label: 'variable costs', min: 0, max: 200 }),
    fixedCosts: checkNumber(i.fixedCosts, { label: 'fixed monthly costs', min: 0, max: 1e10 }),
    financingPayment: checkNumber(i.financingPayment, { label: 'monthly loan payments', min: 0, max: 1e10 }),
    paymentDelayMonths: checkNumber(i.paymentDelayMonths, { label: 'customer payment delay', min: 0, max: 3, integer: true }),
    months: checkNumber(i.months, { label: 'months', min: 1, max: 36, integer: true }),
  };
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

/**
 * Month-by-month cash simulation that separates profit from cash.
 *
 * Assumptions (shown to visitors):
 * - Sales in month 1 equal the current monthly sales and then change by a constant rate.
 * - Before the simulation starts, sales ran steadily at the current level, so customer
 *   payments already "in the pipeline" equal current sales.
 * - Customers pay `paymentDelayMonths` after the sale; variable and fixed costs are paid
 *   in the month incurred.
 * - Loan payments are a cash outflow but are not deducted from simplified profit.
 */
export function simulateCashFlow({
  startingCash,
  monthlySales,
  salesGrowthPct = 0,
  variableCostPct,
  fixedCosts,
  financingPayment = 0,
  paymentDelayMonths = 0,
  months = 12,
}) {
  const g = salesGrowthPct / 100;
  const v = variableCostPct / 100;
  const salesIn = (m) => (m <= 0 ? monthlySales : monthlySales * Math.pow(1 + g, m - 1));

  const rows = [];
  let balance = startingCash;
  let totalProfit = 0;
  let lowest = { balance: startingCash, month: 0 };
  let firstShortfallMonth = null;

  for (let m = 1; m <= months; m += 1) {
    const sales = salesIn(m);
    const variableCosts = sales * v;
    const profit = sales - variableCosts - fixedCosts;
    const cashIn = salesIn(m - paymentDelayMonths);
    const cashOut = variableCosts + fixedCosts + financingPayment;
    const opening = balance;
    balance = opening + cashIn - cashOut;
    totalProfit += profit;

    if (balance < lowest.balance) lowest = { balance, month: m };
    if (balance < 0 && firstShortfallMonth === null) firstShortfallMonth = m;

    rows.push({
      month: m,
      sales: roundCents(sales),
      profit: roundCents(profit),
      cashIn: roundCents(cashIn),
      cashOut: roundCents(cashOut),
      opening: roundCents(opening),
      closing: roundCents(balance),
    });
  }

  return {
    rows,
    endingCash: roundCents(balance),
    totalProfit: roundCents(totalProfit),
    netCashChange: roundCents(balance - startingCash),
    lowestBalance: roundCents(lowest.balance),
    lowestMonth: lowest.month,
    firstShortfallMonth,
  };
}
