import React from 'react';

// Lightweight, dependency-free SVG charts. Each chart includes a text summary
// and a screen-reader data table so the information never relies on visuals alone.

export const TONES = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  muted: 'hsl(var(--chart-3))',
  negative: 'hsl(var(--negative))',
  positive: 'hsl(var(--positive))',
};

function niceTicks(min, max, count = 4) {
  if (min === max) {
    const pad = Math.abs(min) || 1;
    min -= pad;
    max += pad;
  }
  const span = max - min;
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : v);
  return ticks;
}

export const compactCurrency = (v) => {
  const a = Math.abs(v);
  const sign = v < 0 ? '−' : '';
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(a >= 1e10 ? 0 : 1)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(a >= 1e4 ? 0 : 1)}k`;
  return `${sign}$${Math.round(a)}`;
};

export function DataTable({ table }) {
  if (!table) return null;
  return (
    <div className="sr-only">
    <table>
      <caption>{table.caption}</caption>
      <thead>
        <tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((r, i) => (
          <tr key={i}>{r.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}</tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

function Legend({ items }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground" aria-hidden="true">
      {items.map((s) => (
        <li key={s.label} className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-5" style={{ background: TONES[s.tone] || s.tone, opacity: s.dashed ? 0.7 : 1 }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

export function LineChart({
  series, height = 280, formatY = compactCurrency, formatX = (x) => x, xLabel, markers = [], summary, table, minYZero = true, xTicks,
}) {
  const W = 680;
  const H = height;
  const pad = { l: 58, r: 16, t: 16, b: xLabel ? 44 : 30 };
  const all = series.flatMap((s) => s.points);
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const ticks = niceTicks(minYZero ? Math.min(0, ...ys) : Math.min(...ys), Math.max(...ys, minYZero ? 0 : -Infinity));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const sx = (x) => pad.l + ((x - xMin) / (xMax - xMin || 1)) * (W - pad.l - pad.r);
  const sy = (y) => pad.t + (1 - (y - yMin) / (yMax - yMin || 1)) * (H - pad.t - pad.b);
  const xt = xTicks || [...new Set(xs)].filter((_, i, arr) => arr.length <= 13 || i % Math.ceil(arr.length / 12) === 0);

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(t)} y2={sy(t)} stroke="hsl(var(--border))" strokeWidth={t === 0 ? 1.5 : 1} strokeDasharray={t === 0 ? '' : '2 4'} />
            <text x={pad.l - 10} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground tabular" fontSize="11">
              {formatY(t)}
            </text>
          </g>
        ))}
        {xt.map((x) => (
          <text key={x} x={sx(x)} y={H - pad.b + 18} textAnchor="middle" className="fill-muted-foreground tabular" fontSize="11">
            {formatX(x)}
          </text>
        ))}
        {xLabel && (
          <text x={(W + pad.l) / 2} y={H - 6} textAnchor="middle" className="fill-muted-foreground" fontSize="11">
            {xLabel}
          </text>
        )}
        {series.map((s) => {
          const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
          return (
            <g key={s.label}>
              {s.area && (
                <path d={`${d} L${sx(s.points.at(-1).x)},${sy(Math.max(yMin, 0))} L${sx(s.points[0].x)},${sy(Math.max(yMin, 0))} Z`} fill={TONES[s.tone]} opacity="0.08" />
              )}
              <path d={d} fill="none" stroke={TONES[s.tone] || s.tone} strokeWidth={s.width || 2.25} strokeDasharray={s.dashed ? '6 5' : ''} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {markers.map((m) => (
          <g key={m.label}>
            <circle cx={sx(m.x)} cy={sy(m.y)} r="5" fill="hsl(var(--background))" stroke={TONES[m.tone || 'primary']} strokeWidth="2" />
            <text x={sx(m.x)} y={sy(m.y) - 12} textAnchor={sx(m.x) > W * 0.75 ? 'end' : 'middle'} className="fill-foreground" fontSize="11.5" fontWeight="500">
              {m.label}
            </text>
          </g>
        ))}
      </svg>
      <Legend items={series} />
      {summary && <figcaption className="sr-only">{summary}</figcaption>}
      <DataTable table={table} />
    </figure>
  );
}

export function BarComparison({ items, format = compactCurrency, summary }) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);
  const hasNeg = items.some((i) => i.value < 0);
  return (
    <figure className="w-full">
      <div className="space-y-4" role="img" aria-label={summary}>
        {items.map((it) => {
          const pct = (Math.abs(it.value) / max) * (hasNeg ? 50 : 100);
          const neg = it.value < 0;
          return (
            <div key={it.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{it.label}</span>
                <span className={`tabular font-medium ${neg ? 'text-negative' : 'text-foreground'}`}>{format(it.value)}</span>
              </div>
              <div className="relative h-3 rounded-sm bg-muted" aria-hidden="true">
                {hasNeg && <span className="absolute inset-y-[-3px] left-1/2 w-px bg-foreground/30" />}
                <span
                  className="absolute inset-y-0 rounded-sm transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    left: hasNeg ? (neg ? `${50 - pct}%` : '50%') : 0,
                    background: neg ? TONES.negative : TONES[it.tone || 'primary'],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {summary && <figcaption className="sr-only">{summary}</figcaption>}
    </figure>
  );
}

export function StackedColumns({ data, keys, height = 260, format = compactCurrency, summary, table }) {
  const W = 680;
  const H = height;
  const pad = { l: 58, r: 10, t: 12, b: 30 };
  const totals = data.map((d) => keys.reduce((s, k) => s + d[k.key], 0));
  const ticks = niceTicks(0, Math.max(...totals, 1));
  const yMax = ticks.at(-1);
  const bw = (W - pad.l - pad.r) / data.length;
  const sy = (v) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);
  const labelEvery = Math.ceil(data.length / 15);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={summary}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(t)} y2={sy(t)} stroke="hsl(var(--border))" strokeDasharray={t ? '2 4' : ''} />
            <text x={pad.l - 10} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground tabular" fontSize="11">
              {format(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          let acc = 0;
          const x = pad.l + i * bw + bw * 0.15;
          return (
            <g key={d.label}>
              {keys.map((k) => {
                const y0 = sy(acc);
                acc += d[k.key];
                const y1 = sy(acc);
                return <rect key={k.key} x={x} width={bw * 0.7} y={y1} height={Math.max(0, y0 - y1)} fill={TONES[k.tone]} />;
              })}
              {i % labelEvery === 0 && (
                <text x={x + bw * 0.35} y={H - pad.b + 18} textAnchor="middle" className="fill-muted-foreground tabular" fontSize="11">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <Legend items={keys} />
      {summary && <figcaption className="sr-only">{summary}</figcaption>}
      <DataTable table={table} />
    </figure>
  );
}
