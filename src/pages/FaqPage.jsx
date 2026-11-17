import React from 'react';
import { FAQ_GROUPS } from '../content/faq.js';
import { contactHref } from '../content/catalog.js';
import { PageHero, Section, Container, FaqList, CtaBand } from '../components/site/ui.jsx';

const slug = (t) => t.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

export default function FaqPage({ route }) {
  return (
    <>
      <PageHero route={route} eyebrow="Help" title="Frequently asked questions." lead="Straight answers about NVeston, our services, consultations and the boundaries of our work." />
      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <nav aria-label="FAQ sections" className="lg:col-span-3">
              <ul className="space-y-2 lg:sticky lg:top-28">
                {FAQ_GROUPS.map((g) => (
                  <li key={g.title}><a href={`#${slug(g.title)}`} className="text-sm text-muted-foreground hover:text-primary">{g.title}</a></li>
                ))}
              </ul>
            </nav>
            <div className="space-y-14 lg:col-span-9">
              {FAQ_GROUPS.map((g) => (
                <section key={g.title} id={slug(g.title)} aria-labelledby={`${slug(g.title)}-h`}>
                  <h2 id={`${slug(g.title)}-h`} className="mb-6 font-display text-2xl font-medium">{g.title}</h2>
                  <FaqList items={g.items} />
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand title="Still have a question?" text="Send us a message and we will reply by email." primary={{ href: contactHref('general'), label: 'Ask a question' }} secondary={{ href: '/policies/disclosures', label: 'Important Disclosures' }} />
    </>
  );
}
