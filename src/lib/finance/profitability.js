import { checkNumber, roundCents } from './shared.js';

export const PROFITABILITY_LIMITS = {
  amount: { min: 0, max: 1e12 },
  pct: { min: -100, max: 500 },
};

export function validateProfitability({ revenue, expenses, revenueChangePct, expenseChangePct }) {
  const errors = {
    revenue: checkNumber(revenue, { label: 'monthly revenue', ...PROFITABILITY_LIMITS.amount }),
    expenses: checkNumber(expenses, { label: 'monthly expenses', ...PROFITABILITY_LIMITS.amount }),
    revenueChangePct: checkNumber(revenueChangePct, { label: 'the revenue change', ...PROFITABILITY_LIMITS.pct }),
    expenseChangePct: checkNumber(expenseChangePct, { label: 'the expense change', ...PROFITABILITY_LIMITS.pct }),
  };
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

// Simplified monthly profitability: profit = revenue − expenses, before taxes and
// any items not included in the expense figure.
export function analyzeProfitability({ revenue, expenses, revenueChangePct = 0, expenseChangePct = 0 }) {
  const profit = revenue - expenses;
  const margin = revenue > 0 ? profit / revenue : null;

  const newRevenue = revenue * (1 + revenueChangePct / 100);
  const newExpenses = expenses * (1 + expenseChangePct / 100);
  const newProfit = newRevenue - newExpenses;
  const newMargin = newRevenue > 0 ? newProfit / newRevenue : null;

  const monthlyChange = newProfit - profit;

  return {
    current: { revenue: roundCents(revenue), expenses: roundCents(expenses), profit: roundCents(profit), margin },
    scenario: { revenue: roundCents(newRevenue), expenses: roundCents(newExpenses), profit: roundCents(newProfit), margin: newMargin },
    monthlyChange: roundCents(monthlyChange),
    annualChange: roundCents(monthlyChange * 12),
    currentAnnualProfit: roundCents(profit * 12),
    scenarioAnnualProfit: roundCents(newProfit * 12),
  };
}
