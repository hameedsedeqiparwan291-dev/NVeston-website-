import { checkNumber } from './shared.js';

export function validateBreakEven({ fixedCosts, price, variableCost, targetProfit, expectedUnits }) {
  const errors = {
    fixedCosts: checkNumber(fixedCosts, { label: 'fixed costs', min: 0, max: 1e11 }),
    price: checkNumber(price, { label: 'the selling price', min: 0.01, max: 1e9 }),
    variableCost: checkNumber(variableCost, { label: 'the variable cost per unit', min: 0, max: 1e9 }),
    targetProfit: checkNumber(targetProfit, { label: 'the target profit', min: 0, max: 1e11, required: false }),
    expectedUnits: checkNumber(expectedUnits, { label: 'expected units', min: 0, max: 1e11, required: false }),
  };
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

const ceilUnits = (x) => Math.ceil(x - 1e-9);

export function analyzeBreakEven({ fixedCosts, price, variableCost, targetProfit = 0, expectedUnits = null }) {
  const contributionMargin = price - variableCost;
  const contributionRatio = price > 0 ? contributionMargin / price : null;

  if (contributionMargin <= 0) {
    return {
      status: 'no-break-even',
      contributionMargin,
      contributionRatio,
      lossPerUnit: -contributionMargin,
    };
  }

  const breakEvenUnitsExact = fixedCosts / contributionMargin;
  const targetUnitsExact = (fixedCosts + (targetProfit || 0)) / contributionMargin;

  const result = {
    status: 'ok',
    contributionMargin,
    contributionRatio,
    breakEvenUnitsExact,
    breakEvenUnits: ceilUnits(breakEvenUnitsExact),
    breakEvenRevenue: breakEvenUnitsExact * price,
    targetUnits: ceilUnits(targetUnitsExact),
    targetRevenue: targetUnitsExact * price,
  };

  if (expectedUnits !== null && expectedUnits !== undefined && Number.isFinite(expectedUnits)) {
    result.expected = {
      units: expectedUnits,
      revenue: expectedUnits * price,
      profit: expectedUnits * contributionMargin - fixedCosts,
      marginOfSafety: expectedUnits > 0 ? (expectedUnits - breakEvenUnitsExact) / expectedUnits : null,
    };
  }
  return result;
}

// Points for a revenue vs. total cost chart.
export function breakEvenSeries({ fixedCosts, price, variableCost }, maxUnits, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const units = (maxUnits * i) / steps;
    pts.push({ units, revenue: units * price, totalCost: fixedCosts + units * variableCost });
  }
  return pts;
}
