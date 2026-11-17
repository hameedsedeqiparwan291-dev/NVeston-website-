import React from 'react';
import { analyzeProfitability, validateProfitability } from '../../lib/finance/profitability.js';
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../lib/finance/shared.js';
import { ToolLayout, NumberField, Stat, useNumberInputs } from '../../components/site/tools-ui.jsx';
import { BarComparison } from '../../components/site/charts.jsx';
import { Notice } from '../../components/site/ui.jsx';

const DEFAULTS = { revenue: 50000, expenses: 45000, revenueChangePct: 0, expenseChangePct: -5 };

export default function ProfitabilityTool({ route }) {
  const { values, bind } = useNumberInputs(DEFAULTS);
  const errors = validateProfitability(values);
  const valid = Object.keys(errors).length === 0;
  const r = valid ? analyzeProfitability(values) : null;

  const inputs = (
    <>
      <NumberField id="pa-revenue" label="Monthly revenue" prefix="$" {...bind('revenue')} error={errors.revenue} hint="Total sales before any costs." />
      <NumberField id="pa-expenses" label="Monthly expenses" prefix="$" {...bind('expenses')} error={errors.expenses} hint="All operating costs, including wages, rent and materials." />
      <div className="border-t border-border pt-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Test a change</p>
        <div className="space-y-5">
          <NumberField id="pa-rev-change" label="Change in revenue" suffix="%" {...bind('revenueChangePct')} error={errors.revenueChangePct} hint="Use a negative number for a decrease, e.g. −10." />
          <NumberField id="pa-exp-change" label="Change in expenses" suffix="%" {...bind('expenseChangePct')} error={errors.expenseChangePct} hint="Example: −5 means expenses fall by 5%." />
        </div>
      </div>
    </>
  );

  const results = !r ? (
    <Notice title="Check your inputs">Enter valid figures on the left to see your results.</Notice>
  ) : (
    <div className="space-y-8">
      <div aria-live="polite" className="rounded-sm border-l-2 border-primary bg-card p-6">
        <p className="font-display text-xl leading-snug md:text-2xl">
          {r.monthlyChange === 0
            ? `Monthly profit stays at ${formatCurrency(r.current.profit)} under these assumptions.`
            : `Monthly profit would ${r.monthlyChange > 0 ? 'rise' : 'fall'} from ${formatCurrency(r.current.profit)} to ${formatCurrency(r.scenario.profit)} — about ${formatCurrency(Math.abs(r.annualChange))} ${r.annualChange > 0 ? 'more' : 'less'} per year.`}
        </p>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Current profit" value={formatCurrency(r.current.profit)} tone={r.current.profit < 0 ? 'negative' : undefined} sub="per month" />
        <Stat label="Current margin" value={formatPercent(r.current.margin)} sub="profit ÷ revenue" />
        <Stat label="Scenario profit" value={formatCurrency(r.scenario.profit)} tone={r.scenario.profit < 0 ? 'negative' : 'primary'} sub={`margin ${formatPercent(r.scenario.margin)}`} />
        <Stat label="Annual change" value={formatSignedCurrency(r.annualChange)} tone={r.annualChange < 0 ? 'negative' : 'primary'} sub={`${formatSignedCurrency(r.monthlyChange)} per month`} />
      </dl>
      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Monthly comparison</h3>
        <BarComparison
          items={[
            { label: 'Revenue — current', value: r.current.revenue, tone: 'muted' },
            { label: 'Revenue — scenario', value: r.scenario.revenue, tone: 'secondary' },
            { label: 'Expenses — current', value: r.current.expenses, tone: 'muted' },
            { label: 'Expenses — scenario', value: r.scenario.expenses, tone: 'secondary' },
            { label: 'Profit — current', value: r.current.profit, tone: 'muted' },
            { label: 'Profit — scenario', value: r.scenario.profit, tone: 'primary' },
          ]}
          format={(v) => formatCurrency(v)}
          summary={`Current: revenue ${formatCurrency(r.current.revenue)}, expenses ${formatCurrency(r.current.expenses)}, profit ${formatCurrency(r.current.profit)}. Scenario: revenue ${formatCurrency(r.scenario.revenue)}, expenses ${formatCurrency(r.scenario.expenses)}, profit ${formatCurrency(r.scenario.profit)}.`}
        />
      </div>
      {r.current.profit < 0 && r.scenario.profit < 0 && (
        <Notice tone="warning" title="Still operating at a loss">Under these assumptions the business would continue to spend more than it earns each month. Understanding which costs and revenue lines drive the loss is usually the first step.</Notice>
      )}
      {r.current.revenue === 0 && <Notice>Margin cannot be calculated when revenue is zero.</Notice>}
    </div>
  );

  return (
    <ToolLayout
      route={route}
      slug="business-profitability"
      lead="See your simplified profit and margin today, then test how a change in revenue or expenses would affect them — monthly and over a year."
      inputs={inputs}
      results={results}
      related={['break-even', 'cash-flow']}
      assumptions={[
        'Profit = revenue − expenses, for one month. Annual figures multiply the monthly change by 12.',
        'Profit margin = profit ÷ revenue.',
        'Changes are applied as percentages to the monthly figures you enter, independently of each other.',
        'The example defaults reproduce the illustration used across this site: $50,000 revenue, $45,000 expenses and a 5% expense reduction.',
      ]}
      limitations={[
        'This is a simplified, pre-tax view. It ignores taxes, depreciation, financing costs and one-off items unless you include them in expenses.',
        'In reality, changing costs can affect revenue (and vice versa); this tool treats them separately.',
        'It assumes changes cost nothing to implement and last the whole year.',
        'Profit is not the same as cash. Use the Cash Flow Simulator to see timing effects.',
      ]}
    />
  );
}
