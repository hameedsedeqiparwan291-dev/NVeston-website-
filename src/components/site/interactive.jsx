import React, { useId, useState } from 'react';
import { NEEDS } from '../../content/needs.js';
import { serviceBySlug, toolBySlug, segmentBySlug, contactHref } from '../../content/catalog.js';
import { analyzeProfitability } from '../../lib/finance/profitability.js';
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../lib/finance/shared.js';
import { BarComparison } from './charts.jsx';
import { ButtonLink, IllustrativeTag, TextLink, BulletList } from './ui.jsx';

/* -------------------------------------------------------------------------- */
/* How can NVeston help you?                                                   */
/* -------------------------------------------------------------------------- */
export function NeedsSelector() {
  const [active, setActive] = useState(NEEDS[0].id);
  const need = NEEDS.find((n) => n.id === active);
  const tool = need.tool && toolBySlug(need.tool);
  const segment = need.segment && segmentBySlug(need.segment);
  const baseId = useId();

  const onKeyDown = (e) => {
    const i = NEEDS.findIndex((n) => n.id === active);
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % NEEDS.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + NEEDS.length) % NEEDS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = NEEDS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(NEEDS[next].id);
    document.getElementById(`${baseId}-tab-${NEEDS[next].id}`)?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div role="tablist" aria-label="Choose what describes you" aria-orientation="vertical" className="flex flex-col gap-2 lg:col-span-5" onKeyDown={onKeyDown}>
        {NEEDS.map((n) => {
          const selected = n.id === active;
          return (
            <button
              key={n.id}
              id={`${baseId}-tab-${n.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(n.id)}
              className={`group flex items-center justify-between gap-4 rounded-sm border px-5 py-4 text-left text-[0.95rem] transition-colors duration-200 ${
                selected ? 'border-primary bg-card text-foreground' : 'border-border text-foreground/75 hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              <span>{n.label}</span>
              <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full transition-colors ${selected ? 'bg-primary' : 'bg-border group-hover:bg-foreground/30'}`} />
            </button>
          );
        })}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="rounded-sm border border-border bg-card p-6 md:p-9 lg:col-span-7">
        <p className="eyebrow mb-3">{need.short}</p>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Challenges we often hear</h3>
            <BulletList items={need.challenges} />
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">How NVeston can help</h3>
            <BulletList items={need.capabilities} />
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Explore</h3>
          <ul className="flex flex-col gap-2">
            {need.services.map((slug) => (
              <li key={slug}><TextLink href={`/services/${slug}`}>{serviceBySlug(slug).name}</TextLink></li>
            ))}
            {tool && <li><TextLink href={`/tools/${tool.slug}`}>Try the {tool.name}</TextLink></li>}
            {segment && <li><TextLink href={`/who-we-serve/${segment.slug}`}>How we work with {segment.navName.toLowerCase()}</TextLink></li>}
          </ul>
        </div>

        <div className="mt-8 rounded-sm bg-muted/60 p-5">
          <p className="text-sm leading-relaxed text-foreground/85"><span className="font-medium text-foreground">Suggested next step: </span>{need.nextStep}</p>
          <div className="mt-5">
            <ButtonLink href={contactHref('consultation')} size="sm">Request an introductory consultation</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Interactive profitability example                                           */
/* -------------------------------------------------------------------------- */
export function ProfitExample({ compact = false }) {
  const [costCut, setCostCut] = useState(5);
  const id = useId();
  const r = analyzeProfitability({ revenue: 50000, expenses: 45000, revenueChangePct: 0, expenseChangePct: -costCut });
  return (
    <div className="rounded-sm border border-border bg-card p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <IllustrativeTag />
        <span className="text-xs text-muted-foreground">Monthly revenue $50,000 · expenses $45,000</span>
      </div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-sm text-foreground">
        <span>Reduce monthly expenses by</span>
        <span className="tabular font-display text-2xl text-primary">{costCut}%</span>
      </label>
      <input id={id} type="range" min="0" max="10" step="1" value={costCut} onChange={(e) => setCostCut(Number(e.target.value))} className="range-nv mt-3" aria-valuetext={`${costCut} percent`} />
      <div className="mt-8">
        <BarComparison
          items={[
            { label: 'Current monthly profit', value: r.current.profit, tone: 'muted' },
            { label: `Profit with ${costCut}% lower expenses`, value: r.scenario.profit, tone: 'primary' },
          ]}
          format={(v) => formatCurrency(v)}
          summary={`Monthly profit rises from ${formatCurrency(r.current.profit)} to ${formatCurrency(r.scenario.profit)} when expenses fall ${costCut}%.`}
        />
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6" aria-live="polite">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Monthly change</dt>
          <dd className="tabular mt-1 font-display text-2xl text-foreground">{formatSignedCurrency(r.monthlyChange)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Annual change</dt>
          <dd className="tabular mt-1 font-display text-2xl text-primary">{formatSignedCurrency(r.annualChange)}</dd>
        </div>
      </dl>
      {!compact && (
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Assumes revenue stays the same and the reduction costs nothing to implement. Profit margin moves from {formatPercent(r.current.margin)} to {formatPercent(r.scenario.margin)}. Hypothetical figures, not a client result.
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Three-scenario comparison (Risk & Scenario Analysis)                         */
/* -------------------------------------------------------------------------- */
export function ScenarioBars() {
  const cases = [
    { label: 'Base case', value: 5000, tone: 'muted' },
    { label: 'Revenue −10%', value: 0, tone: 'primary' },
    { label: 'Revenue −20%', value: -5000, tone: 'primary' },
  ];
  return (
    <div className="rounded-sm border border-border bg-card p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <IllustrativeTag />
        <span className="text-xs text-muted-foreground">Monthly profit · costs held at $45,000</span>
      </div>
      <BarComparison items={cases} format={(v) => formatCurrency(v)} summary="Monthly profit is $5,000 in the base case, zero if revenue falls 10%, and a $5,000 loss if revenue falls 20%." />
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">With $30,000 in reserves, a $5,000 monthly loss would exhaust them in about six months. Hypothetical figures.</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero visual: one decision, a range of outcomes                              */
/* -------------------------------------------------------------------------- */
export function ScenarioFan() {
  const W = 600;
  const H = 400;
  const start = [60, 250];
  const paths = {
    upside: 'M60,250 C190,240 300,170 500,90',
    base: 'M60,250 C200,245 320,215 500,190',
    downside: 'M60,250 C190,255 300,290 500,320',
  };
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="fan-title fan-desc">
        <title id="fan-title">Illustration: one decision, a range of possible outcomes</title>
        <desc id="fan-desc">From a single starting point, three paths diverge: an upside, a base case and a downside, with the shaded area between them showing the range of outcomes to plan for.</desc>
        {[90, 150, 210, 270, 330].map((y) => (
          <line key={y} x1="40" x2={W - 20} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="2 6" />
        ))}
        <path d="M60,250 C190,240 300,170 500,90 L500,320 C300,290 190,255 60,250 Z" fill="hsl(var(--primary))" opacity="0.07" />
        <path d={paths.downside} fill="none" stroke="hsl(var(--chart-3))" strokeWidth="2" className="draw-line" style={{ '--len': 480 }} />
        <path d={paths.upside} fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" className="draw-line" style={{ '--len': 520 }} />
        <path d={paths.base} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.75" className="draw-line" style={{ '--len': 480 }} />
        <circle cx={start[0]} cy={start[1]} r="6" fill="hsl(var(--primary))" />
        <circle cx={start[0]} cy={start[1]} r="14" fill="none" stroke="hsl(var(--primary))" opacity="0.35" />
        <text x="60" y="282" textAnchor="middle" className="fill-muted-foreground" fontSize="12">Today’s decision</text>
        {[
          ['Upside', 90, 'hsl(var(--chart-2))'],
          ['Base case', 190, 'hsl(var(--primary))'],
          ['Downside', 320, 'hsl(var(--chart-3))'],
        ].map(([label, y, c]) => (
          <g key={label}>
            <circle cx="500" cy={y} r="4" fill={c} />
            <text x="512" y={y} dy="0.35em" fontSize="12" className="fill-foreground">{label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-muted-foreground">Illustrative. Analysis prepares you for the full range of paths.</figcaption>
    </figure>
  );
}
