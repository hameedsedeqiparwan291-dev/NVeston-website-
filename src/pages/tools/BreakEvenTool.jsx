import React from 'react';
import { analyzeBreakEven, validateBreakEven, breakEvenSeries } from '../../lib/finance/breakeven.js';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/finance/shared.js';
import { ToolLayout, NumberField, Stat, useNumberInputs } from '../../components/site/tools-ui.jsx';
import { LineChart } from '../../components/site/charts.jsx';
import { Notice } from '../../components/site/ui.jsx';

const DEFAULTS = { fixedCosts: 12000, price: 50, variableCost: 30, targetProfit: 6000, expectedUnits: '' };

export default function BreakEvenTool({ route }) {
  const { values, bind } = useNumberInputs(DEFAULTS);
  const input = {
    ...values,
    targetProfit: Number.isNaN(values.targetProfit) ? 0 : values.targetProfit,
    expectedUnits: Number.isNaN(values.expectedUnits) ? null : values.expectedUnits,
  };
  const errors = validateBreakEven(values);
  const valid = Object.keys(errors).length === 0;
  const r = valid ? analyzeBreakEven(input) : null;

  const inputs = (
    <>
      <NumberField id="be-fixed" label="Fixed costs per month" prefix="$" {...bind('fixedCosts')} error={errors.fixedCosts} hint="Costs you pay regardless of sales: rent, salaries, insurance." />
      <NumberField id="be-price" label="Selling price per unit" prefix="$" {...bind('price')} error={errors.price} hint="A ‘unit’ can be a product, a client or an hour of service." />
      <NumberField id="be-var" label="Variable cost per unit" prefix="$" {...bind('variableCost')} error={errors.variableCost} hint="What each additional unit costs you to make or deliver." />
      <NumberField id="be-target" label="Target monthly profit (optional)" prefix="$" {...bind('targetProfit')} error={errors.targetProfit} />
      <NumberField id="be-expected" label="Expected units per month (optional)" {...bind('expectedUnits')} error={errors.expectedUnits} hint="Adds a margin-of-safety calculation." />
    </>
  );

  let results;
  if (!r) {
    results = <Notice title="Check your inputs">Enter valid figures on the left to see your break-even point.</Notice>;
  } else if (r.status === 'no-break-even') {
    results = (
      <div className="space-y-6" aria-live="polite">
        <Notice tone="warning" title="There is no break-even point at this price">
          {r.contributionMargin === 0
            ? 'Each unit sells for exactly what it costs to produce, so no amount of sales can cover your fixed costs.'
            : `Each unit costs ${formatCurrency(r.lossPerUnit, { cents: true })} more to produce than it sells for, so every additional sale increases the loss.`}{' '}
          The price, the variable cost or both would need to change before volume can help.
        </Notice>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Stat label="Contribution per unit" value={formatCurrency(r.contributionMargin, { cents: true })} tone="negative" />
          <Stat label="Contribution margin" value={formatPercent(r.contributionRatio)} tone="negative" />
        </dl>
      </div>
    );
  } else {
    const maxUnits = Math.max(r.breakEvenUnitsExact * 2, (input.expectedUnits || 0) * 1.2, r.targetUnits * 1.15, 10);
    const pts = breakEvenSeries(input, maxUnits);
    results = (
      <div className="space-y-8">
        <div aria-live="polite" className="rounded-sm border-l-2 border-primary bg-card p-6">
          <p className="font-display text-xl leading-snug md:text-2xl">
            You need to sell {formatNumber(r.breakEvenUnits)} {r.breakEvenUnits === 1 ? 'unit' : 'units'} a month, about {formatCurrency(r.breakEvenRevenue)} in revenue, to cover your costs.
          </p>
          <p className="mt-3 text-sm font-light text-muted-foreground">
            Each unit contributes {formatCurrency(r.contributionMargin, { cents: true })} ({formatPercent(r.contributionRatio)} of its price) toward fixed costs and profit.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Break-even units" value={formatNumber(r.breakEvenUnits)} tone="primary" sub={`exactly ${formatNumber(r.breakEvenUnitsExact, 1)}`} />
          <Stat label="Break-even revenue" value={formatCurrency(r.breakEvenRevenue)} />
          <Stat label="Units for target profit" value={formatNumber(r.targetUnits)} sub={`${formatCurrency(r.targetRevenue)} revenue`} />
          {r.expected ? (
            <Stat
              label="Margin of safety"
              value={formatPercent(r.expected.marginOfSafety)}
              tone={r.expected.profit < 0 ? 'negative' : undefined}
              sub={`profit ${formatCurrency(r.expected.profit)} at ${formatNumber(r.expected.units)} units`}
            />
          ) : (
            <Stat label="Contribution margin" value={formatPercent(r.contributionRatio)} />
          )}
        </dl>
        <div className="rounded-sm border border-border bg-card p-6">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Revenue and total cost by units sold</h3>
          <LineChart
            series={[
              { label: 'Revenue', points: pts.map((p) => ({ x: p.units, y: p.revenue })), tone: 'primary' },
              { label: 'Total cost (fixed + variable)', points: pts.map((p) => ({ x: p.units, y: p.totalCost })), tone: 'secondary', dashed: true },
            ]}
            xTicks={[0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxUnits * f))}
            formatX={(x) => formatNumber(x)}
            xLabel="Units sold per month"
            markers={[{ x: r.breakEvenUnitsExact, y: r.breakEvenRevenue, label: 'Break-even' }]}
            summary={`Revenue and total cost lines cross at about ${formatNumber(r.breakEvenUnits)} units and ${formatCurrency(r.breakEvenRevenue)} of revenue. Below that point the business makes a loss; above it, a profit.`}
          />
        </div>
        {r.expected && r.expected.profit < 0 && (
          <Notice tone="warning">At {formatNumber(r.expected.units)} units the business would be below break-even, with a monthly loss of {formatCurrency(Math.abs(r.expected.profit))}.</Notice>
        )}
      </div>
    );
  }

  return (
    <ToolLayout
      route={route}
      slug="break-even"
      lead="Find how many units you need to sell to cover your costs, what that means in revenue, and what it takes to reach a profit target."
      inputs={inputs}
      results={results}
      related={['business-profitability', 'cash-flow']}
      assumptions={[
        'Contribution per unit = selling price − variable cost per unit.',
        'Break-even units = fixed costs ÷ contribution per unit, rounded up to the next whole unit.',
        'Break-even revenue = exact break-even units × price.',
        'Target units = (fixed costs + target profit) ÷ contribution per unit. Margin of safety = (expected − break-even units) ÷ expected units.',
      ]}
      limitations={[
        'Assumes one product or an average across products; a mix of products with different margins will change the result.',
        'Assumes price and variable cost stay constant at every volume, with no discounts or capacity limits.',
        'Fixed costs often step up as a business grows (another hire, a larger space).',
        'Break-even measures profit. The timing of payments, which drives cash, still matters.',
      ]}
    />
  );
}
