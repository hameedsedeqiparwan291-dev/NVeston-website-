import React from 'react';
import { SEGMENTS, contactHref } from '../content/catalog.js';
import { SEGMENT_DETAILS } from '../content/segments.js';
import { PageHero, Section, Container, CtaBand, TextLink } from '../components/site/ui.jsx';
import { NeedsSelector } from '../components/site/interactive.jsx';

export default function SegmentsIndexPage({ route }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Who we serve"
        title="Different situations. The same need for clarity."
        lead="NVeston works with people and businesses at very different stages. What they share is a wish to understand their numbers properly before making decisions that matter."
      />
      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {SEGMENTS.map((s) => {
              const d = SEGMENT_DETAILS[s.slug];
              return (
                <article key={s.slug} className="flex flex-col rounded-sm border border-border bg-card p-8" data-reveal>
                  <span className="eyebrow mb-4">{s.name}</span>
                  <h2 className="font-display text-2xl font-medium leading-snug">{d.headline}</h2>
                  <p className="mt-3 font-light leading-relaxed text-muted-foreground">{s.short}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-foreground/85">
                    {d.concerns.slice(0, 3).map((c) => <li key={c.title}>— {c.title}</li>)}
                  </ul>
                  <TextLink href={`/who-we-serve/${s.slug}`} className="mt-8">How we help {s.navName.toLowerCase()}</TextLink>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
      <Section tone="dark" pad="lg">
        <Container>
          <h2 className="mb-12 max-w-2xl font-display text-3xl font-medium leading-tight md:text-4xl">Or start from what you need right now.</h2>
          <NeedsSelector />
        </Container>
      </Section>
      <CtaBand
        title="Tell us about your situation."
        text="An introductory consultation is a short, no-obligation conversation to understand what you are facing and whether NVeston can help."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
      />
    </>
  );
}
