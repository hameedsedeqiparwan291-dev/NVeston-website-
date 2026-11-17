import { checkNumber } from './shared.js';

// Educational reference bands used by NVeston to frame observations.
// They are not an industry standard, credit score or validated financial-health rating.
export const RESILIENCE_BANDS = {
  reserveMonths: { strong: 6, moderate: 3 },
  debtShare: { strong: 0.15, moderate: 0.36 },
  marginShare: { strong: 0.2, moderate: 0.05 },
};

export const STABILITY_OPTIONS = [
  { value: 'stable', label: 'Mostly predictable (for example, a regular salary)' },
  { value: 'variable', label: 'Varies from month to month' },
  { value: 'uncertain', label: 'Uncertain or at risk' },
];

export const FLEXIBILITY_OPTIONS = [
  { value: 'high', label: 'I could reduce spending meaningfully if needed' },
  { value: 'some', label: 'I could cut some costs, but not many' },
  { value: 'low', label: 'Almost all of my spending is fixed' },
];

export function validateResilience(i) {
  const errors = {
    monthlyIncome: checkNumber(i.monthlyIncome, { label: 'monthly take-home income', min: 0, max: 1e9 }),
    essentialExpenses: checkNumber(i.essentialExpenses, { label: 'essential monthly expenses', min: 0, max: 1e9 }),
    debtPayments: checkNumber(i.debtPayments, { label: 'monthly debt payments', min: 0, max: 1e9 }),
    emergencySavings: checkNumber(i.emergencySavings, { label: 'accessible savings', min: 0, max: 1e11 }),
  };
  if (!STABILITY_OPTIONS.some((o) => o.value === i.incomeStability)) errors.incomeStability = 'Choose the option closest to your situation.';
  if (!FLEXIBILITY_OPTIONS.some((o) => o.value === i.expenseFlexibility)) errors.expenseFlexibility = 'Choose the option closest to your situation.';
  if (!errors.essentialExpenses && !errors.debtPayments && i.essentialExpenses + i.debtPayments === 0) {
    errors.essentialExpenses = 'Enter your essential monthly expenses.';
  }
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}

const band = (value, { strong, moderate }, higherIsBetter = true) => {
  if (higherIsBetter) return value >= strong ? 'strong' : value >= moderate ? 'moderate' : 'limited';
  return value <= strong ? 'strong' : value <= moderate ? 'moderate' : 'limited';
};

export function assessResilience({ monthlyIncome, essentialExpenses, debtPayments, emergencySavings, incomeStability, expenseFlexibility }) {
  const obligations = essentialExpenses + debtPayments;
  const reserveMonths = obligations > 0 ? emergencySavings / obligations : null;
  const debtShare = monthlyIncome > 0 ? debtPayments / monthlyIncome : null;
  const monthlyMargin = monthlyIncome - obligations;
  const marginShare = monthlyIncome > 0 ? monthlyMargin / monthlyIncome : null;

  const observations = [];

  observations.push({
    id: 'reserves',
    label: 'Emergency reserves',
    level: band(reserveMonths, RESILIENCE_BANDS.reserveMonths),
    reserveMonths,
    detail:
      reserveMonths < 1
        ? 'Your accessible savings would cover less than one month of essential expenses and debt payments. An unexpected bill or a gap in income could quickly create pressure.'
        : reserveMonths < 3
          ? 'Your savings would cover a short disruption. Building toward three months or more gives more room to respond to a job change, repair or medical cost without new borrowing.'
          : reserveMonths < 6
            ? 'You have a meaningful cushion. Whether it is enough depends on how stable your income is and how quickly you could replace it.'
            : 'Your savings could cover essential costs for six months or more, which provides substantial room to absorb shocks.',
  });

  if (debtShare === null) {
    observations.push({
      id: 'debt',
      label: 'Debt obligations',
      level: debtPayments > 0 ? 'limited' : 'strong',
      debtShare,
      detail: debtPayments > 0
        ? 'You have debt payments but no income entered. Without income, every payment draws on savings.'
        : 'No income or debt payments were entered.',
    });
  } else {
    observations.push({
      id: 'debt',
      label: 'Debt obligations',
      level: band(debtShare, RESILIENCE_BANDS.debtShare, false),
      debtShare,
      detail:
        debtShare <= RESILIENCE_BANDS.debtShare.strong
          ? 'Debt payments take a relatively small share of your income, leaving more flexibility for saving and unexpected costs.'
          : debtShare <= RESILIENCE_BANDS.debtShare.moderate
            ? 'Debt payments take a noticeable share of your income. Understanding interest rates and payoff timelines can show where the biggest savings are.'
            : 'Debt payments take a large share of your income, which reduces flexibility if income falls or costs rise.',
    });
  }

  observations.push({
    id: 'margin',
    label: 'Monthly breathing room',
    level: marginShare === null ? 'limited' : monthlyMargin < 0 ? 'shortfall' : band(marginShare, RESILIENCE_BANDS.marginShare),
    monthlyMargin,
    marginShare,
    detail:
      monthlyMargin < 0
        ? 'Your essential expenses and debt payments are higher than your income. The gap has to come from savings or new borrowing, which is difficult to sustain.'
        : marginShare !== null && marginShare < RESILIENCE_BANDS.marginShare.moderate
          ? 'Very little is left after essential costs and debt payments, so small changes in income or prices can have a large effect.'
          : marginShare !== null && marginShare < RESILIENCE_BANDS.marginShare.strong
            ? 'You have some room each month. Directing part of it toward reserves or higher-cost debt can strengthen your position over time.'
            : 'A healthy share of your income remains after essential costs and debt payments, which gives you options.',
  });

  observations.push({
    id: 'stability',
    label: 'Income stability',
    level: incomeStability === 'stable' ? 'strong' : incomeStability === 'variable' ? 'moderate' : 'limited',
    detail:
      incomeStability === 'stable'
        ? 'Predictable income makes planning easier. It is still worth knowing how long your reserves would last if it stopped.'
        : incomeStability === 'variable'
          ? 'When income varies, planning around a cautious "low month" rather than an average month helps avoid shortfalls.'
          : 'When income is uncertain, reserves and flexible spending matter more, because there is less certainty about what comes next.',
  });

  observations.push({
    id: 'flexibility',
    label: 'Expense flexibility',
    level: expenseFlexibility === 'high' ? 'strong' : expenseFlexibility === 'some' ? 'moderate' : 'limited',
    detail:
      expenseFlexibility === 'high'
        ? 'Being able to cut spending quickly is a form of resilience in its own right.'
        : expenseFlexibility === 'some'
          ? 'Knowing in advance which costs you would cut first makes it easier to act calmly if conditions change.'
          : 'With mostly fixed costs, reserves carry more of the load in a disruption.',
  });

  return { obligations, reserveMonths, debtShare, monthlyMargin, marginShare, observations };
}
