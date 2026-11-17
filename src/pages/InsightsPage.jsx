import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { INSIGHT_CATEGORIES, categoryBySlug, contactHref } from '../content/catalog.js';
import { VISIBLE_ARTICLES } from '../site/routes.js';
import { ARTICLE_BODIES, readingMinutes } from '../content/articles.js';
import { PageHero, Section, Container, CtaBand, Notice } from '../components/site/ui.jsx';

const catName = (slug) => categoryBySlug(slug)?.name;

function ArticleCard({ a, large }) {
  return (
    <a href={`/insights/${a.category}/${a.slug}`} className={`group flex h-full flex-col rounded-sm border border-border bg-card transition-colors hover:border-primary/60 ${large ? 'p-8 md:p-10' : 'p-6 md:p-7'}`}>
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="text-primary">{catName(a.category)}</span>
        <span aria-hidden="true">·</span>
        <span>{readingMinutes(ARTICLE_BODIES[a.slug])} min read</span>
        {a.status !== 'published' && <span className="rounded-full border border-primary/50 px-2 text-primary">Draft</span>}
      </span>
      <span className={`mt-4 font-display leading-snug group-hover:text-primary ${large ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{a.title}</span>
      <span className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">{a.summary}</span>
    </a>
  );
}

export default function InsightsPage({ route }) {
  const category = route.params?.category ? categoryBySlug(route.params.category) : null;
  const [query, setQuery] = useState('');
  const base = category ? VISIBLE_ARTICLES.filter((a) => a.category === category.slug) : VISIBLE_ARTICLES;
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((a) => `${a.title} ${a.summary} ${catName(a.category)}`.toLowerCase().includes(q));
  }, [query, base]);
  const [lead, ...rest] = results;
  const categories = INSIGHT_CATEGORIES.filter((c) => VISIBLE_ARTICLES.some((a) => a.category === c.slug));

  return (
    <>
      <PageHero
        route={route}
        eyebrow="NVeston Intelligence"
        title={category ? category.name : 'Insights that make finance easier to understand.'}
        lead={category ? category.short : 'Practical, carefully reasoned analysis of business finance, the economy, financial markets and risk — written for decision-makers, not specialists.'}
      />
      <Section tone="light" pad="md">
        <Container>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="Insight categories">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a href="/insights" aria-current={!category ? 'page' : undefined} className={`inline-block rounded-full border px-4 py-1.5 text-sm ${!category ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>All</a>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <a href={`/insights/${c.slug}`} aria-current={category?.slug === c.slug ? 'page' : undefined} className={`inline-block rounded-full border px-4 py-1.5 text-sm ${category?.slug === c.slug ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="relative w-full lg:w-80">
              <label htmlFor="insight-search" className="sr-only">Search insights</label>
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input id="insight-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search insights" className="h-11 w-full rounded-sm border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
            </div>
          </div>

          <p className="sr-only" aria-live="polite">{results.length} {results.length === 1 ? 'article' : 'articles'} shown</p>
          {results.length === 0 ? (
            <Notice>No insights match “{query}”. Try a different word, or browse all categories.</Notice>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {lead && <div className="lg:col-span-2 lg:row-span-2"><ArticleCard a={lead} large /></div>}
              {rest.map((a) => <ArticleCard key={a.slug} a={a} />)}
            </div>
          )}
        </Container>
      </Section>
      <CtaBand
        title="Have a question these articles do not answer?"
        text="Every situation is different. An introductory consultation is a short conversation about yours."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: '/tools', label: 'Explore the tools' }}
      />
    </>
  );
}
