import React, { useState } from 'react';
import { calculateLoan, validateLoan, PAYMENT_FREQUENCIES } from '../../lib/finance/loan.js';
import { formatCurrency, formatSignedCurrency, formatNumber } from '../../lib/finance/shared.js';
import { ToolLayout, NumberField, Stat, useNumberInputs } from '../../components/site/tools-ui.jsx';
import { StackedColumns } from '../../components/site/charts.jsx';
import { Notice } from '../../components/site/ui.jsx';

const FREQ_LABEL = Object.fromEntries(PAYMENT_FREQUENCIES.map((f) => [f.value, f.label.toLowerCase()]));

function LoanInputs({ prefix, title, state, freq, setFreq }) {
  const errors = validateLoan({ ...state.values, paymentsPerYear: freq });
  return (
    <fieldset className="space-y-5">
      <legend className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{title}</legend>
      <NumberField id={`${prefix}-amount`} label="Loan amount" prefix="$" {...state.bind('principal')} error={errors.principal} />
      <NumberField id={`${prefix}-rate`} label="Annual interest rate" suffix="%" {...state.bind('annualRatePct')} error={errors.annualRatePct} />
      <NumberField id={`${prefix}-term`} label="Repayment term" suffix="years" {...state.bind('termYears')} error={errors.termYears} />
      <div>
        <label htmlFor={`${prefix}-freq`} className="mb-2 block text-sm font-medium">Payment frequency</label>
        <select id={`${prefix}-freq`} value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="h-11 w-full rounded-sm border border-input bg-card px-3 text-[0.95rem] text-foreground">
          {PAYMENT_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
    </fieldset>
  );
}

export default function LoanTool({ route }) {
  const a = useNumberInputs({ principal: 100000, annualRatePct: 7, termYears: 5 });
  const b = useNumberInputs({ principal: 100000, annualRatePct: 9, termYears: 7 });
  const [freqA, setFreqA] = useState(12);
  const [freqB, setFreqB] = useState(12);
  const [compare, setCompare] = useState(true);

  const inA = { ...a.values, paymentsPerYear: freqA };
  const inB = { ...b.values, paymentsPerYear: freqB };
  const rA = Object.keys(validateLoan(inA)).length === 0 ? calculateLoan(inA) : null;
  const rB = compare && Object.keys(validateLoan(inB)).length === 0 ? calculateLoan(inB) : null;

  const inputs = (
    <>
      <LoanInputs prefix="la" title="Option A" state={a} freq={freqA} setFreq={setFreqA} />
      <label className="flex cursor-pointer items-center gap-3 border-t border-border pt-5 text-sm">
        <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
        Compare a second option
      </label>
      {compare && <LoanInputs prefix="lb" title="Option B" state={b} freq={freqB} setFreq={setFreqB} />}
    </>
  );

  const results = !rA ? (
    <Notice title="Check your inputs">Enter a valid loan amount, rate and term for Option A.</Notice>
  ) : (
    <div className="space-y-8">
      <div aria-live="polite" className="rounded-sm border-l-2 border-primary bg-card p-6">
        <p className="font-display text-xl leading-snug md:text-2xl">
          Option A: about {formatCurrency(rA.payment, { cents: true })} {FREQ_LABEL[freqA]} for {formatNumber(rA.numberOfPayments)} payments, costing {formatCurrency(rA.totalInterest)} in interest.
        </p>
        {rB && (
          <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
            Option B costs {formatCurrency(rB.totalInterest)} in interest — {formatSignedCurrency(rB.totalInterest - rA.totalInterest)} compared with Option A, with payments of {formatCurrency(rB.payment, { cents: true })} {FREQ_LABEL[freqB]}.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="tabular w-full min-w-[480px] text-sm">
          <caption className="sr-only">Loan comparison</caption>
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-5 py-3 text-left font-medium">Estimate</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Option A</th>
              {rB && <th scope="col" className="px-5 py-3 text-right font-medium">Option B</th>}
              {rB && <th scope="col" className="px-5 py-3 text-right font-medium">Difference (B − A)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ['Payment', (r) => formatCurrency(r.payment, { cents: true }), (x, y) => formatSignedCurrency(y.payment - x.payment, { cents: true })],
              ['Number of payments', (r) => formatNumber(r.numberOfPayments), (x, y) => formatNumber(y.numberOfPayments - x.numberOfPayments)],
              ['Total principal', (r) => formatCurrency(r.totalPrincipal), (x, y) => formatSignedCurrency(y.totalPrincipal - x.totalPrincipal)],
              ['Total interest', (r) => formatCurrency(r.totalInterest), (x, y) => formatSignedCurrency(y.totalInterest - x.totalInterest)],
              ['Total repayment', (r) => formatCurrency(r.totalRepayment), (x, y) => formatSignedCurrency(y.totalRepayment - x.totalRepayment)],
            ].map(([label, fmt, diff]) => (
              <tr key={label}>
                <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">{label}</th>
                <td className="px-5 py-3 text-right font-medium">{fmt(rA)}</td>
                {rB && <td className="px-5 py-3 text-right font-medium">{fmt(rB)}</td>}
                {rB && <td className="px-5 py-3 text-right text-muted-foreground">{diff(rA, rB)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Payment (A)" value={formatCurrency(rA.payment, { cents: true })} tone="primary" sub={FREQ_LABEL[freqA]} />
        <Stat label="Total interest (A)" value={formatCurrency(rA.totalInterest)} />
        <Stat label="Interest as % of amount" value={`${((rA.totalInterest / rA.totalPrincipal) * 100).toFixed(1)}%`} />
      </dl>

      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Option A — principal and interest paid each year</h3>
        <StackedColumns
          data={rA.years.map((y) => ({ label: `Y${y.year}`, principal: y.principal, interest: y.interest }))}
          keys={[{ key: 'principal', label: 'Principal repaid', tone: 'secondary' }, { key: 'interest', label: 'Interest paid', tone: 'primary' }]}
          summary={`Each year Option A repays principal and interest; interest is highest in the early years and falls as the balance shrinks. Total interest is ${formatCurrency(rA.totalInterest)}.`}
          table={{
            caption: 'Option A yearly amortization',
            columns: ['Year', 'Principal repaid', 'Interest paid', 'Balance at year end'],
            rows: rA.years.map((y) => [`Year ${y.year}`, formatCurrency(y.principal), formatCurrency(y.interest), formatCurrency(y.endBalance)]),
          }}
        />
      </div>
    </div>
  );

  return (
    <ToolLayout
      route={route}
      slug="debt-financing"
      lead="Estimate regular payments and the total cost of a loan, see how interest is repaid over time, and compare two borrowing options side by side."
      inputs={inputs}
      results={results}
      related={['cash-flow', 'business-profitability', 'financial-resilience']}
      assumptions={[
        'A fixed interest rate and equal payments that repay the loan in full by the end of the term (a standard amortizing loan).',
        'The annual rate is divided evenly across payment periods, so interest compounds once per payment period.',
        'Payment = P × r ÷ (1 − (1 + r)^−n), where P is the amount, r the rate per period and n the number of payments.',
        'The final payment is adjusted slightly so the balance reaches exactly zero.',
      ]}
      limitations={[
        'Excludes fees, insurance, taxes, balloon payments and prepayment penalties, which can add materially to the cost.',
        'Lenders may quote rates differently (for example APR) or compound interest daily; actual payments will differ.',
        'Variable-rate loans change over time and are not modelled.',
        'These are estimates for comparison only — not an offer, quote or approval from any lender.',
      ]}
    />
  );
}
