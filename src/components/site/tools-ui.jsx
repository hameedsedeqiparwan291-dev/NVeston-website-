import React, { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { toNumber } from '../../lib/finance/shared.js';
import { TOOLS, toolBySlug, contactHref } from '../../content/catalog.js';
import { PageHero, Section, Container, CtaBand, BulletList, Notice, LinkCard } from './ui.jsx';

// Keeps raw input strings (so users can type freely) alongside parsed numbers.
export function useNumberInputs(defaults) {
  const [raw, setRaw] = useState(() => Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, String(v)])));
  // Empty → NaN ("enter a value"); unparseable text → Infinity ("enter a valid number").
  const values = useMemo(() => Object.fromEntries(Object.entries(raw).map(([k, v]) => {
    if (v.trim() === '') return [k, NaN];
    const n = toNumber(v);
    return [k, Number.isNaN(n) ? Infinity : n];
  })), [raw]);
  const bind = (key) => ({ value: raw[key], onChange: (e) => setRaw((r) => ({ ...r, [key]: e.target.value })) });
  const reset = () => setRaw(Object.fromEntries(Object.entries(defaults).map(([k, v]) => [k, String(v)])));
  return { raw, values, bind, reset, setRaw };
}

export function NumberField({ id, label, hint, error, prefix, suffix, value, onChange, decimals = true }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className={`flex items-center rounded-sm border bg-card transition-colors focus-within:border-primary ${error ? 'border-negative' : 'border-input'}`}>
        {prefix && <span className="pl-3.5 text-sm text-muted-foreground" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode={decimals ? 'decimal' : 'numeric'}
          autoComplete="off"
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="tabular h-11 w-full min-w-0 bg-transparent px-3.5 text-[0.95rem] text-foreground outline-none"
        />
        {suffix && <span className="pr-3.5 text-sm text-muted-foreground" aria-hidden="true">{suffix}</span>}
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-snug text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-negative">{error}</p>}
    </div>
  );
}

export function ChoiceField({ name, legend, options, value, onChange, error }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-foreground">{legend}</legend>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className={`flex cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 text-sm transition-colors ${value === o.value ? 'border-primary bg-primary/5' : 'border-input hover:border-foreground/40'}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="mt-0.5 accent-[hsl(var(--primary))]" />
            <span className="text-foreground/90">{o.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
    </fieldset>
  );
}

export function Stat({ label, value, tone, sub }) {
  return (
    <div className="rounded-sm border border-border bg-card p-5">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className={`tabular mt-2 font-display text-[1.75rem] leading-none ${tone === 'negative' ? 'text-negative' : tone === 'primary' ? 'text-primary' : 'text-foreground'}`}>{value}</dd>
      {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function PrivacyNote() {
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      <Lock size={13} aria-hidden="true" className="text-primary" />
      Calculated privately in your browser. Nothing you enter is stored or sent.
    </p>
  );
}

export function ToolLayout({ route, slug, title, lead, inputs, results, assumptions, limitations, related = [], ctaTitle, ctaText }) {
  const tool = toolBySlug(slug);
  const relatedTools = TOOLS.filter((t) => t.slug !== slug && related.includes(t.slug));
  return (
    <>
      <PageHero route={route} eyebrow="Tools & Resources" title={title || tool.name} lead={lead} />
      <Section tone="light" pad="md">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <form className="min-w-0 space-y-6 lg:col-span-4" onSubmit={(e) => e.preventDefault()} aria-label={`${tool.name} inputs`} noValidate>
              <div className="rounded-sm border border-border bg-muted/40 p-6 md:p-7">
                <h2 className="mb-6 font-display text-xl font-medium">Your inputs</h2>
                <div className="space-y-5">{inputs}</div>
              </div>
              <PrivacyNote />
            </form>
            <section className="min-w-0 lg:col-span-8" aria-labelledby="tool-results-heading">
              <h2 id="tool-results-heading" className="sr-only">Results</h2>
              {results}
            </section>
          </div>
        </Container>
      </Section>
      <Section tone="paper" pad="md">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-5 font-display text-2xl font-medium">How this is calculated</h2>
              <BulletList items={assumptions} />
            </div>
            <div>
              <h2 className="mb-5 font-display text-2xl font-medium">Limitations</h2>
              <BulletList items={limitations} />
              <Notice className="mt-8">
                This tool is for education and general analysis only. Results depend entirely on the figures you enter and the simplified assumptions shown. They are not financial, tax, lending or investment advice, and actual outcomes will differ.
              </Notice>
            </div>
          </div>
          {relatedTools.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Related tools</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {relatedTools.map((t) => <LinkCard key={t.slug} href={`/tools/${t.slug}`} icon={t.icon} title={t.name} text={t.short} />)}
              </div>
            </div>
          )}
        </Container>
      </Section>
      <CtaBand
        eyebrow="Go further"
        title={ctaTitle || 'Want to look at your real numbers together?'}
        text={ctaText || 'Tools give a first view. An analysis with NVeston tests your actual figures, examines the assumptions and sets out your options clearly.'}
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: '/tools', label: 'All tools' }}
      />
    </>
  );
}
