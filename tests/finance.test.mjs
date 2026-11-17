// Run with: npm test   (node's built-in test runner; no extra dependencies)
// Expected values are computed independently by hand or from standard
// amortization references, not by re-running the implementation.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { analyzeProfitability, validateProfitability } from '../src/lib/finance/profitability.js';
import { simulateCashFlow, validateCashFlow } from '../src/lib/finance/cashflow.js';
import { analyzeBreakEven, validateBreakEven } from '../src/lib/finance/breakeven.js';
import { calculateLoan, validateLoan } from '../src/lib/finance/loan.js';
import { assessResilience, validateResilience } from '../src/lib/finance/resilience.js';
import { toNumber, formatCurrency, formatSignedCurrency } from '../src/lib/finance/shared.js';

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b}`);

test('profitability: directive example (50k revenue, 45k expenses, 5% expense cut)', () => {
  const r = analyzeProfitability({ revenue: 50000, expenses: 45000, revenueChangePct: 0, expenseChangePct: -5 });
  assert.equal(r.current.profit, 5000);
  close(r.current.margin, 0.1, 1e-12);
  assert.equal(r.scenario.expenses, 42750);
  assert.equal(r.scenario.profit, 7250);
  assert.equal(r.monthlyChange, 2250);
  assert.equal(r.annualChange, 27000);
});

test('profitability: loss-making business and revenue drop', () => {
  const r = analyzeProfitability({ revenue: 20000, expenses: 26000, revenueChangePct: -10, expenseChangePct: 0 });
  assert.equal(r.current.profit, -6000);
  close(r.current.margin, -0.3, 1e-12);
  assert.equal(r.scenario.revenue, 18000);
  assert.equal(r.scenario.profit, -8000);
  assert.equal(r.annualChange, -24000);
});

test('profitability: zero revenue gives no margin instead of dividing by zero', () => {
  const r = analyzeProfitability({ revenue: 0, expenses: 1000 });
  assert.equal(r.current.margin, null);
  assert.equal(r.current.profit, -1000);
});

test('profitability: validation rejects negatives and out-of-range changes', () => {
  const e = validateProfitability({ revenue: -1, expenses: NaN, revenueChangePct: -150, expenseChangePct: 0 });
  assert.ok(e.revenue && e.expenses && e.revenueChangePct);
  assert.equal(e.expenseChangePct, undefined);
});

test('cash flow: steady business with one-month payment delay', () => {
  const r = simulateCashFlow({ startingCash: 10000, monthlySales: 50000, salesGrowthPct: 0, variableCostPct: 60, fixedCosts: 15000, financingPayment: 2000, paymentDelayMonths: 1, months: 12 });
  // Profit 50,000 − 30,000 − 15,000 = 5,000; cash +50,000 − 47,000 = +3,000 per month.
  assert.equal(r.rows[0].profit, 5000);
  assert.equal(r.rows[0].closing, 13000);
  assert.equal(r.endingCash, 46000);
  assert.equal(r.totalProfit, 60000);
  assert.equal(r.firstShortfallMonth, null);
});

test('cash flow: growth with a two-month delay raises profit while cash falls', () => {
  const r = simulateCashFlow({ startingCash: 10000, monthlySales: 50000, salesGrowthPct: 5, variableCostPct: 60, fixedCosts: 15000, financingPayment: 2000, paymentDelayMonths: 2, months: 3 });
  // Hand-calculated: sales 50,000 / 52,500 / 55,125; cash in 50,000 each month.
  assert.deepEqual(r.rows.map((x) => x.profit), [5000, 6000, 7050]);
  assert.deepEqual(r.rows.map((x) => x.closing), [13000, 14500, 14425]);
});

test('cash flow: detects first shortfall month and lowest balance', () => {
  const r = simulateCashFlow({ startingCash: 1000, monthlySales: 10000, salesGrowthPct: 0, variableCostPct: 50, fixedCosts: 6000, financingPayment: 0, paymentDelayMonths: 0, months: 3 });
  // −1,000 per month: 0, −1,000, −2,000
  assert.equal(r.firstShortfallMonth, 2);
  assert.equal(r.lowestBalance, -2000);
  assert.equal(r.lowestMonth, 3);
});

test('cash flow: validation enforces whole-month delays within range', () => {
  const e = validateCashFlow({ startingCash: 0, monthlySales: 1, salesGrowthPct: 0, variableCostPct: 10, fixedCosts: 0, financingPayment: 0, paymentDelayMonths: 1.5, months: 12 });
  assert.ok(e.paymentDelayMonths);
});

test('break-even: standard example', () => {
  const r = analyzeBreakEven({ fixedCosts: 12000, price: 50, variableCost: 30, targetProfit: 6000 });
  assert.equal(r.contributionMargin, 20);
  close(r.contributionRatio, 0.4, 1e-12);
  assert.equal(r.breakEvenUnits, 600);
  close(r.breakEvenRevenue, 30000);
  assert.equal(r.targetUnits, 900);
  close(r.targetRevenue, 45000);
});

test('break-even: fractional units round up to the next whole unit', () => {
  const r = analyzeBreakEven({ fixedCosts: 1000, price: 30, variableCost: 23 });
  close(r.breakEvenUnitsExact, 142.857, 0.001);
  assert.equal(r.breakEvenUnits, 143);
});

test('break-even: zero or negative contribution margin has no break-even point', () => {
  assert.equal(analyzeBreakEven({ fixedCosts: 1000, price: 20, variableCost: 20 }).status, 'no-break-even');
  const neg = analyzeBreakEven({ fixedCosts: 1000, price: 20, variableCost: 25 });
  assert.equal(neg.status, 'no-break-even');
  assert.equal(neg.lossPerUnit, 5);
});

test('break-even: margin of safety with expected sales', () => {
  const r = analyzeBreakEven({ fixedCosts: 12000, price: 50, variableCost: 30, expectedUnits: 800 });
  assert.equal(r.expected.profit, 4000);
  close(r.expected.marginOfSafety, 0.25, 1e-12);
});

test('break-even: validation requires a positive price', () => {
  assert.ok(validateBreakEven({ fixedCosts: 0, price: 0, variableCost: 0 }).price);
});

test('loan: $100,000 at 6% over 30 years, monthly (reference payment $599.55)', () => {
  const r = calculateLoan({ principal: 100000, annualRatePct: 6, termYears: 30, paymentsPerYear: 12 });
  assert.equal(r.numberOfPayments, 360);
  assert.equal(r.payment, 599.55);
  close(r.totalInterest, 115838.19, 0.05);
  assert.equal(r.years.length, 30);
  close(r.years.at(-1).endBalance, 0, 0.01);
});

test('loan: $10,000 at 5% over 5 years, monthly (reference payment $188.71)', () => {
  const r = calculateLoan({ principal: 10000, annualRatePct: 5, termYears: 5, paymentsPerYear: 12 });
  assert.equal(r.payment, 188.71);
  close(r.totalInterest, 1322.74, 0.05);
});

test('loan: zero interest divides principal evenly', () => {
  const r = calculateLoan({ principal: 12000, annualRatePct: 0, termYears: 1, paymentsPerYear: 12 });
  assert.equal(r.payment, 1000);
  assert.equal(r.totalInterest, 0);
});

test('loan: yearly principal sums to the original amount', () => {
  const r = calculateLoan({ principal: 25000, annualRatePct: 8.5, termYears: 4, paymentsPerYear: 26 });
  close(r.years.reduce((s, y) => s + y.principal, 0), 25000, 0.05);
});

test('loan: validation', () => {
  assert.ok(validateLoan({ principal: 0, annualRatePct: 5, termYears: 5, paymentsPerYear: 12 }).principal);
  assert.ok(validateLoan({ principal: 1000, annualRatePct: 5, termYears: 5, paymentsPerYear: 7 }).paymentsPerYear);
  assert.ok(validateLoan({ principal: 1000, annualRatePct: 75, termYears: 5, paymentsPerYear: 12 }).annualRatePct);
});

test('resilience: directive example — covers expenses but thin reserves', () => {
  const r = assessResilience({ monthlyIncome: 5000, essentialExpenses: 3200, debtPayments: 1100, emergencySavings: 2000, incomeStability: 'stable', expenseFlexibility: 'some' });
  close(r.reserveMonths, 2000 / 4300, 1e-9);
  close(r.debtShare, 0.22, 1e-9);
  assert.equal(r.monthlyMargin, 700);
  const byId = Object.fromEntries(r.observations.map((o) => [o.id, o.level]));
  assert.deepEqual(byId, { reserves: 'limited', debt: 'moderate', margin: 'moderate', stability: 'strong', flexibility: 'moderate' });
});

test('resilience: shortfall and band boundaries', () => {
  const r = assessResilience({ monthlyIncome: 4000, essentialExpenses: 3800, debtPayments: 600, emergencySavings: 26400, incomeStability: 'uncertain', expenseFlexibility: 'low' });
  const byId = Object.fromEntries(r.observations.map((o) => [o.id, o.level]));
  assert.equal(byId.reserves, 'strong'); // exactly 6 months
  assert.equal(byId.margin, 'shortfall');
  assert.equal(byId.debt, 'strong'); // exactly 15%
});

test('resilience: validation', () => {
  const e = validateResilience({ monthlyIncome: 1, essentialExpenses: 0, debtPayments: 0, emergencySavings: 0, incomeStability: 'x', expenseFlexibility: 'high' });
  assert.ok(e.essentialExpenses && e.incomeStability);
});

test('shared: parsing and formatting', () => {
  assert.equal(toNumber('$1,250.50'), 1250.5);
  assert.ok(Number.isNaN(toNumber('')));
  assert.equal(formatCurrency(-0.004), '$0');
  assert.equal(formatSignedCurrency(-2250), '−$2,250');
  assert.equal(formatSignedCurrency(2250), '+$2,250');
});

test('content check: macro service example ($250k over 7 years at 7% vs 9%)', () => {
  const a = calculateLoan({ principal: 250000, annualRatePct: 7, termYears: 7, paymentsPerYear: 12 });
  const b = calculateLoan({ principal: 250000, annualRatePct: 9, termYears: 7, paymentsPerYear: 12 });
  assert.equal(Math.round(a.payment), 3773);
  assert.equal(Math.round(b.payment), 4022);
  close(b.totalInterest - a.totalInterest, 20926, 5); // "roughly $20,900"
});

test('content check: article examples', () => {
  const a = calculateLoan({ principal: 250000, annualRatePct: 7, termYears: 7, paymentsPerYear: 12 });
  const b = calculateLoan({ principal: 250000, annualRatePct: 9, termYears: 7, paymentsPerYear: 12 });
  assert.equal(Math.round(a.totalInterest / 100) * 100, 66900);
  assert.equal(Math.round(b.totalInterest / 100) * 100, 87900);
  assert.equal(analyzeBreakEven({ fixedCosts: 12000, price: 55, variableCost: 30 }).breakEvenUnits, 480);
  const before = 1000 * (40 - 25) - 10000;
  const after = 1300 * (36 - 25) - 10000;
  assert.deepEqual([before, after], [5000, 4300]);
  const noLoan = simulateCashFlow({ startingCash: 0, monthlySales: 50000, salesGrowthPct: 5, variableCostPct: 60, fixedCosts: 15000, financingPayment: 0, paymentDelayMonths: 2, months: 3 });
  assert.equal(noLoan.rows[2].profit, 7050);
  assert.equal(noLoan.rows[2].cashIn - noLoan.rows[2].cashOut, 1925);
  const withLoan = simulateCashFlow({ startingCash: 0, monthlySales: 50000, salesGrowthPct: 5, variableCostPct: 60, fixedCosts: 15000, financingPayment: 2000, paymentDelayMonths: 2, months: 3 });
  assert.equal(withLoan.rows[2].cashIn - withLoan.rows[2].cashOut, -75);
});
