import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { categoryBySlug, contactHref } from '../content/catalog.js';
import { VISIBLE_ARTICLES } from '../site/routes.js';
import { ARTICLE_BODIES, readingMinutes } from '../content/articles.js';
import { absoluteUrl } from '../site/config.js';
import { Section, Container, Breadcrumbs, CtaBand, Notice, IllustrativeTag } from '../components/site/ui.jsx';

function Block({ b }) {
  if (b.p) return <p>{b.p}</p>;
  if (b.h2) return <h2>{b.h2}</h2>;
  if (b.ul) return <ul>{b.ul.map((t) => <li key={t}>{t}</li>)}</ul>;
  if (b.quote) return <blockquote>{b.quote}</blockquote>;
  if (b.example)
    return (
      <aside className="not-prose rounded-sm border border-border bg-card p-6 text-[0.95rem]" aria-label={b.example.title}>
        <IllustrativeTag>{b.example.title}</IllustrativeTag>
        <ol className="mt-4 list-none space-y-3 pl-0">
          {b.example.lines.map((l, i) => (
            <li key={l} className="flex gap-3 leading-relaxed text-foreground/85">
              <span className="font-display italic text-primary">{i + 1}.</span>
              <span>{l}</span>
            </li>
          ))}
        </ol>
      </aside>
    );
  return null;
}

export default function ArticlePage({ route }) {
  const a = VISIBLE_ARTICLES.find((x) => x.slug === route.params.slug);
  const body = ARTICLE_BODIES[a.slug];
  const cat = categoryBySlug(a.category);
  const related = VISIBLE_ARTICLES.filter((x) => x.slug !== a.slug).sort((x, y) => (y.category === a.category) - (x.category === a.category)).slice(0, 3);
  const url = absoluteUrl(route.path);
  const dateLabel = a.publishedDate
    ? new Date(`${a.publishedDate}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : 'Draft — not yet published';

  return (
    <>
      <Section tone="light" pad="none" className="pb-10 pt-12 md:pt-16">
        <Container className="max-w-3xl">
          <Breadcrumbs items={route.breadcrumbs} />
          <a href={`/insights/${cat.slug}`} className="eyebrow mb-5 hover:underline">{cat.name}</a>
          <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight md:text-5xl">{a.title}</h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground">{a.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
            <div className="flex gap-2"><dt className="sr-only">Author</dt><dd>By <span className="text-foreground">NVeston Intelligence</span></dd></div>
            <div className="flex gap-2"><dt className="sr-only">Date</dt><dd>{a.publishedDate ? <time dateTime={a.publishedDate}>{dateLabel}</time> : dateLabel}</dd></div>
            <div className="flex gap-2"><dt className="sr-only">Reading time</dt><dd>{readingMinutes(body)} min read</dd></div>
          </dl>
        </Container>
      </Section>

      <Section tone="light" pad="none" className="pb-20">
        <Container className="max-w-3xl">
          <article className="prose-nv">
            {body.map((b, i) => <Block key={i} b={b} />)}
          </article>
          <Notice className="mt-12" title="General education">
            This article is general information, not personalized financial, investment, tax or legal advice. Examples are hypothetical and simplified. See our <a className="text-primary underline underline-offset-4" href="/policies/disclosures">Important Disclosures</a>.
          </Notice>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-muted-foreground">Share</span>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 hover:border-primary hover:text-primary">
              <Linkedin size={15} aria-hidden="true" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={`mailto:?subject=${encodeURIComponent(a.title)}&body=${encodeURIComponent(url)}`} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 hover:border-primary hover:text-primary">
              <Mail size={15} aria-hidden="true" /> Email
            </a>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="paper" pad="md">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-medium">Related insights</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <a key={r.slug} href={`/insights/${r.category}/${r.slug}`} className="group rounded-sm border border-border bg-card p-6 hover:border-primary/60">
                  <span className="text-xs uppercase tracking-[0.14em] text-primary">{categoryBySlug(r.category).name}</span>
                  <span className="mt-3 block font-display text-lg leading-snug group-hover:text-primary">{r.title}</span>
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand
        title="Want to apply this to your own situation?"
        text="An introductory consultation is a short conversation to understand what you are facing and whether NVeston can help."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: '/tools', label: 'Explore the tools' }}
      />
    </>
  );
}
