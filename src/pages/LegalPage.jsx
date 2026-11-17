import React from 'react';
import { LEGAL_DOCS } from '../content/legal.js';
import { SHOW_DRAFTS } from '../site/config.js';
import { Section, Container, Breadcrumbs, Notice } from '../components/site/ui.jsx';

const OTHERS = [
  ['/policies/disclosures', 'Important Disclosures'],
  ['/policies/privacy', 'Privacy Policy'],
  ['/policies/terms', 'Terms of Use'],
];

export default function LegalPage({ route }) {
  const doc = LEGAL_DOCS[route.params.doc];
  return (
    <Section tone="light" pad="none" className="pb-24 pt-12 md:pt-16">
      <Container>
        <Breadcrumbs items={route.breadcrumbs} />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">{doc.title}</h1>
            <p className="mt-6 max-w-measure text-lg font-light leading-relaxed text-muted-foreground">{doc.intro}</p>
            {SHOW_DRAFTS && (
              <Notice tone="draft" className="mt-8" title="Review required (visible in development previews only)">
                This document is a draft prepared for founder and qualified legal review before publication.
              </Notice>
            )}
            <div className="prose-nv mt-10">
              {doc.sections.map((s) => (
                <React.Fragment key={s.h}>
                  <h2>{s.h}</h2>
                  {s.p.map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
                </React.Fragment>
              ))}
              <p className="text-sm text-muted-foreground">Questions: <a href="mailto:contact@nveston.com">contact@nveston.com</a></p>
            </div>
          </div>
          <aside className="lg:col-span-4" aria-label="Other policies">
            <ul className="space-y-2 lg:sticky lg:top-28">
              {OTHERS.map(([href, label]) => (
                <li key={href}>
                  <a href={href} aria-current={route.path === href ? 'page' : undefined} className={`block rounded-sm border px-4 py-3 text-sm ${route.path === href ? 'border-primary text-primary' : 'border-border hover:border-primary'}`}>{label}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
