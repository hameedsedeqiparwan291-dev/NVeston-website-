import React from 'react';
import { simulateCashFlow, validateCashFlow, CASHFLOW_DEFAULTS } from '../../lib/finance/cashflow.js';
import { formatCurrency, formatSignedCurrency } from '../../lib/finance/shared.js';
import { ToolLayout, NumberField, Stat, useNumberInputs } from '../../components/site/tools-ui.jsx';
import { LineChart } from '../../components/site/charts.jsx';
import { Notice } from '../../components/site/ui.jsx';

export default function CashFlowTool({ route }) {
  const { values, bind } = useNumberInputs(CASHFLOW_DEFAULTS);
  const errors = validateCashFlow(values);
  const valid = Object.keys(errors).length === 0;
  const r = valid ? simulateCashFlow(values) : null;

  const inputs = (
    <>
      <NumberField id="cf-start" label="Cash in the bank today" prefix="$" {...bind('startingCash')} error={errors.startingCash} />
      <NumberField id="cf-sales" label="Current monthly sales" prefix="$" {...bind('monthlySales')} error={errors.monthlySales} />
      <NumberField id="cf-growth" label="Monthly change in sales" suffix="%" {...bind('salesGrowthPct')} error={errors.salesGrowthPct} hint="Growth of 4% means each month’s sales are 4% higher than the last. Use a negative number for a decline." />
      <NumberField id="cf-var" label="Variable costs" suffix="% of sales" {...bind('variableCostPct')} error={errors.variableCostPct} hint="Costs that rise with sales — materials, stock, delivery — paid in the month incurred." />
      <NumberField id="cf-fixed" label="Fixed monthly costs" prefix="$" {...bind('fixedCosts')} error={errors.fixedCosts} hint="Rent, salaries, software and other costs that do not change with sales." />
      <NumberField id="cf-fin" label="Monthly loan payments" prefix="$" {...bind('financingPayment')} error={errors.financingPayment} />
      <NumberField id="cf-delay" label="Customer payment delay" suffix="months" decimals={false} {...bind('paymentDelayMonths')} error={errors.paymentDelayMonths} hint="0 = paid immediately; 2 = customers pay about two months after the sale (0–3)." />
      <NumberField id="cf-months" label="Months to simulate" decimals={false} {...bind('months')} error={errors.months} hint="Between 1 and 36." />
    </>
  );

  let results;
  if (!r) {
    results = <Notice title="Check your inputs">Enter valid figures on the left to run the simulation.</Notice>;
  } else {
    const cashPts = [{ x: 0, y: values.startingCash }, ...r.rows.map((m) => ({ x: m.month, y: m.closing }))];
    let cum = values.startingCash;
    const profitPts = [{ x: 0, y: values.startingCash }, ...r.rows.map((m) => ({ x: m.month, y: (cum += m.profit) }))];
    const gap = profitPts.at(-1).y - r.endingCash;
    results = (
      <div className="space-y-8">
        <div aria-live="polite" className="rounded-sm border-l-2 border-primary bg-card p-6">
          <p className="font-display text-xl leading-snug md:text-2xl">
            Over {values.months} months the business earns {formatCurrency(r.totalProfit)} in simplified profit, while cash changes by {formatSignedCurrency(r.netCashChange)}.
          </p>
          {Math.abs(gap) >= 1 && (
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              The {formatCurrency(Math.abs(gap))} difference comes from {values.financingPayment > 0 ? 'loan payments and ' : ''}the timing of customer payments{values.salesGrowthPct > 0 && values.paymentDelayMonths > 0 ? ': as sales grow, more money is waiting to be collected' : ''}.
            </p>
          )}
        </div>
        {r.firstShortfallMonth && (
          <Notice tone="warning" title={`Projected cash shortfall in month ${r.firstShortfallMonth}`}>
            Under these assumptions the bank balance falls below zero in month {r.firstShortfallMonth}, reaching a low of {formatCurrency(r.lowestBalance)} in month {r.lowestMonth}. In practice this gap would need to be covered — for example by a credit line, faster collections, slower growth or lower costs.
          </Notice>
        )}
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Ending cash" value={formatCurrency(r.endingCash)} tone={r.endingCash < 0 ? 'negative' : 'primary'} />
          <Stat label="Total profit" value={formatCurrency(r.totalProfit)} tone={r.totalProfit < 0 ? 'negative' : undefined} sub="simplified, before tax" />
          <Stat label="Lowest balance" value={formatCurrency(r.lowestBalance)} tone={r.lowestBalance < 0 ? 'negative' : undefined} sub={r.lowestMonth ? `month ${r.lowestMonth}` : 'at the start'} />
          <Stat label="Monthly profit (month 1)" value={formatCurrency(r.rows[0].profit)} tone={r.rows[0].profit < 0 ? 'negative' : undefined} />
        </dl>
        <div className="rounded-sm border border-border bg-card p-6">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Cash balance vs. cumulative profit</h3>
          <LineChart
            series={[
              { label: 'Cash in the bank', points: cashPts, tone: 'primary', area: true },
              { label: 'Starting cash + cumulative profit', points: profitPts, tone: 'secondary', dashed: true },
            ]}
            formatX={(x) => (x === 0 ? 'Now' : `M${x}`)}
            xLabel="Month"
            markers={r.lowestBalance < values.startingCash ? [{ x: r.lowestMonth, y: r.lowestBalance, label: 'Lowest', tone: r.lowestBalance < 0 ? 'negative' : 'primary' }] : []}
            summary={`Cash moves from ${formatCurrency(values.startingCash)} to ${formatCurrency(r.endingCash)} over ${values.months} months, while starting cash plus cumulative profit reaches ${formatCurrency(profitPts.at(-1).y)}.`}
            table={{
              caption: 'Monthly cash flow',
              columns: ['Month', 'Sales', 'Profit', 'Cash in', 'Cash out', 'Closing cash'],
              rows: r.rows.map((m) => [`Month ${m.month}`, formatCurrency(m.sales), formatCurrency(m.profit), formatCurrency(m.cashIn), formatCurrency(m.cashOut), formatCurrency(m.closing)]),
            }}
          />
        </div>
        <details className="rounded-sm border border-border bg-card">
          <summary className="cursor-pointer px-6 py-4 text-sm font-medium">Show the month-by-month table</summary>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="tabular w-full min-w-[560px] text-right text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>{['Month', 'Sales', 'Profit', 'Cash in', 'Cash out', 'Closing cash'].map((h, i) => <th key={h} scope="col" className={`py-2 font-medium ${i === 0 ? 'text-left' : ''}`}>{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {r.rows.map((m) => (
                  <tr key={m.month}>
                    <th scope="row" className="py-2 text-left font-normal">{m.month}</th>
                    <td>{formatCurrency(m.sales)}</td>
                    <td className={m.profit < 0 ? 'text-negative' : ''}>{formatCurrency(m.profit)}</td>
                    <td>{formatCurrency(m.cashIn)}</td>
                    <td>{formatCurrency(m.cashOut)}</td>
                    <td className={m.closing < 0 ? 'font-medium text-negative' : 'font-medium'}>{formatCurrency(m.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    );
  }

  return (
    <ToolLayout
      route={route}
      slug="cash-flow"
      lead="Follow your cash month by month and see the difference between profit and cash — including why a growing, profitable business can still run short."
      inputs={inputs}
      results={results}
      related={['business-profitability', 'break-even', 'debt-financing']}
      assumptions={[
        'Month 1 sales equal your current monthly sales; each later month changes by the percentage you enter.',
        'Before the simulation starts, sales were steady at today’s level, so payments already owed to you equal current sales.',
        'Customers pay after the delay you choose; variable and fixed costs are paid in the month they occur.',
        'Simplified profit = sales − variable costs − fixed costs. Loan payments reduce cash but are not deducted from profit.',
      ]}
      limitations={[
        'Real businesses have seasonality, irregular large payments, taxes and one-off costs that this model does not include.',
        'Loan payments are treated as a single cash outflow; the interest portion would also reduce profit in your accounts.',
        'Growth is applied at a constant rate, which rarely happens in practice.',
        'Use it to understand patterns and pressure points, not as a forecast.',
      ]}
    />
  );
}
