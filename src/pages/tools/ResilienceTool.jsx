import React, { useState } from 'react';
import { assessResilience, validateResilience, STABILITY_OPTIONS, FLEXIBILITY_OPTIONS, RESILIENCE_BANDS } from '../../lib/finance/resilience.js';
import { formatCurrency, formatPercent } from '../../lib/finance/shared.js';
import { ToolLayout, NumberField, ChoiceField, Stat, useNumberInputs } from '../../components/site/tools-ui.jsx';
import { Notice } from '../../components/site/ui.jsx';

const LEVEL = {
  strong: { label: 'Relatively strong', cls: 'border-positive/50 text-positive' },
  moderate: { label: 'Moderate', cls: 'border-primary/50 text-primary' },
  limited: { label: 'Limited', cls: 'border-negative/50 text-negative' },
  shortfall: { label: 'Shortfall', cls: 'border-negative/60 text-negative' },
};

export default function ResilienceTool({ route }) {
  const { values, bind } = useNumberInputs({ monthlyIncome: '', essentialExpenses: '', debtPayments: '', emergencySavings: '' });
  const [incomeStability, setStability] = useState('');
  const [expenseFlexibility, setFlexibility] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const input = { ...values, incomeStability, expenseFlexibility };
  const errors = validateResilience(input);
  const valid = Object.keys(errors).length === 0;
  const r = valid ? assessResilience(input) : null;
  const show = (k) => (submitted ? errors[k] : undefined);

  const inputs = (
    <>
      <NumberField id="fr-income" label="Monthly take-home income" prefix="$" {...bind('monthlyIncome')} error={show('monthlyIncome')} hint="After tax. If it varies, use a typical or cautious month." />
      <NumberField id="fr-essential" label="Essential monthly expenses" prefix="$" {...bind('essentialExpenses')} error={show('essentialExpenses')} hint="Housing, utilities, food, transport and insurance: the costs you cannot easily stop." />
      <NumberField id="fr-debt" label="Monthly debt payments" prefix="$" {...bind('debtPayments')} error={show('debtPayments')} hint="Minimum payments on loans and cards. Enter 0 if none." />
      <NumberField id="fr-savings" label="Savings you could access quickly" prefix="$" {...bind('emergencySavings')} error={show('emergencySavings')} hint="Cash or savings available within days, without penalties." />
      <ChoiceField name="fr-stability" legend="How predictable is your income?" options={STABILITY_OPTIONS} value={incomeStability} onChange={setStability} error={show('incomeStability')} />
      <ChoiceField name="fr-flex" legend="How flexible is your spending?" options={FLEXIBILITY_OPTIONS} value={expenseFlexibility} onChange={setFlexibility} error={show('expenseFlexibility')} />
      <button type="button" onClick={() => setSubmitted(true)} className="w-full rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        See my observations
      </button>
    </>
  );

  const results = !r || !submitted ? (
    <div className="rounded-sm border border-dashed border-border bg-card p-8">
      <h2 className="font-display text-2xl">A structured check, not a score.</h2>
      <p className="mt-4 max-w-xl font-light leading-relaxed text-muted-foreground">
        Answer six short questions. You will see plain-language observations about your reserves, debt, monthly breathing room, income stability and spending flexibility, with an explanation of why each matters.
      </p>
      <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
        Use approximate figures; precision is not needed. Nothing you enter is saved or sent anywhere.
      </p>
      {submitted && !valid && <Notice className="mt-6" tone="warning" title="A few answers are missing">Complete the highlighted fields to see your observations.</Notice>}
    </div>
  ) : (
    <div className="space-y-8" aria-live="polite">
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Reserves would cover" value={`${r.reserveMonths.toFixed(1)} months`} sub="of essential costs + debt payments" tone={r.reserveMonths < RESILIENCE_BANDS.reserveMonths.moderate ? 'negative' : 'primary'} />
        <Stat label="Debt payments" value={r.debtShare === null ? '—' : formatPercent(r.debtShare, 0)} sub="of take-home income" />
        <Stat label="Left each month" value={formatCurrency(r.monthlyMargin)} tone={r.monthlyMargin < 0 ? 'negative' : undefined} sub="after essentials and debt" />
      </dl>
      <ul className="space-y-4">
        {r.observations.map((o) => (
          <li key={o.id} className="rounded-sm border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl">{o.label}</h3>
              <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${LEVEL[o.level].cls}`}>{LEVEL[o.level].label}</span>
            </div>
            <p className="mt-3 font-light leading-relaxed text-foreground/85">{o.detail}</p>
          </li>
        ))}
      </ul>
      <Notice title="About these observations">
        Labels use NVeston’s reference bands (for example, three and six months of reserves). They are not an industry standard, a credit rating or a validated financial-health score, and they cannot reflect everything about your situation.
      </Notice>
    </div>
  );

  return (
    <ToolLayout
      route={route}
      slug="financial-resilience"
      lead="A short, private look at how well your finances could absorb a shock, with observations explained in plain language."
      inputs={inputs}
      results={results}
      related={['debt-financing', 'cash-flow']}
      ctaTitle="Want a clearer plan for your finances?"
      ctaText="An analysis with NVeston looks at your full picture, tests the decisions you are considering and shows which steps would strengthen your position most."
      assumptions={[
        `Reserve months = accessible savings ÷ (essential expenses + debt payments). Reference bands: ${RESILIENCE_BANDS.reserveMonths.moderate}+ months moderate, ${RESILIENCE_BANDS.reserveMonths.strong}+ months relatively strong.`,
        `Debt share = monthly debt payments ÷ take-home income. Reference bands: up to ${RESILIENCE_BANDS.debtShare.strong * 100}% relatively strong, up to ${RESILIENCE_BANDS.debtShare.moderate * 100}% moderate.`,
        `Monthly breathing room = income − essential expenses − debt payments, compared with income (${RESILIENCE_BANDS.marginShare.moderate * 100}% and ${RESILIENCE_BANDS.marginShare.strong * 100}% reference points).`,
        'Income stability and spending flexibility are taken directly from your answers.',
      ]}
      limitations={[
        'Reference bands are rules of thumb chosen by NVeston, not official standards or lending criteria.',
        'There is no overall score: resilience depends on how these factors combine for you.',
        'It does not consider insurance, family support, assets, upcoming costs or the interest rates on your debts.',
        'This is not a credit assessment, financial plan or recommendation.',
      ]}
    />
  );
}
