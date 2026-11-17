import React from 'react';
import { TOOLS, contactHref } from '../content/catalog.js';
import { PageHero, Section, Container, CtaBand, Icon, Notice } from '../components/site/ui.jsx';
import { PrivacyNote } from '../components/site/tools-ui.jsx';

const WHO = {
  'business-profitability': 'Business owners',
  'cash-flow': 'Business owners',
  'break-even': 'Founders & business owners',
  'debt-financing': 'Businesses & individuals',
  'financial-resilience': 'Individuals & households',
};

export default function ToolsIndexPage({ route }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Tools & Resources"
        title="Explore your numbers, privately."
        lead="Practical calculators that make financial concepts tangible. Each explains its assumptions and limits, and every calculation runs in your browser — nothing is stored or sent."
      />
      <Section tone="light" pad="lg">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <a href={`/tools/${t.slug}`} className="group flex h-full gap-6 rounded-sm border border-border bg-card p-7 transition-colors hover:border-primary/60" data-reveal>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-primary/30 text-primary">
                    <Icon name={t.icon} size={22} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{WHO[t.slug]}</span>
                    <span className="mt-2 font-display text-2xl group-hover:text-primary">{t.name}</span>
                    <span className="mt-2 font-light leading-relaxed text-muted-foreground">{t.short}</span>
                    <span className="mt-5 text-sm font-medium text-primary">Open tool →</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <PrivacyNote />
          </div>
          <Notice className="mt-8" title="In development">
            NVeston’s Personal Financial Calculator is being developed as a separate product. It will be added here once it is ready for public release.
          </Notice>
        </Container>
      </Section>
      <CtaBand
        title="Tools show the pattern. Analysis shows your options."
        text="If a result raises questions about your business or finances, an introductory consultation is a good next step."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
      />
    </>
  );
}
