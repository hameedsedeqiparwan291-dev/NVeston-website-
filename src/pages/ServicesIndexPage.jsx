import React from 'react';
import { SERVICES, contactHref } from '../content/catalog.js';
import { SERVICE_DETAILS, WORKING_APPROACH } from '../content/services.js';
import { PageHero, Section, Container, SectionHeading, ButtonLink, StepList, CtaBand, Icon, TextLink } from '../components/site/ui.jsx';

export default function ServicesIndexPage({ route }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Our services"
        title="Analysis that turns financial complexity into clear choices."
        lead="NVeston offers six areas of financial analysis and strategic decision support. Each one starts with your situation and ends with a clearer understanding of your options."
      >
        <ButtonLink href={contactHref('consultation')}>Request an introductory consultation</ButtonLink>
        <ButtonLink href="/#how-we-help" variant="secondary">Not sure where to start?</ButtonLink>
      </PageHero>

      <Section tone="light" pad="lg">
        <Container>
          <ol className="divide-y divide-border border-y border-border">
            {SERVICES.map((s, i) => {
              const d = SERVICE_DETAILS[s.slug];
              return (
                <li key={s.slug} className="grid gap-6 py-10 md:grid-cols-12 md:gap-10" data-reveal>
                  <div className="flex items-start gap-5 md:col-span-5">
                    <span className="font-display text-sm italic text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h2 className="font-display text-2xl font-medium leading-snug md:text-[1.7rem]">
                        <a href={`/services/${s.slug}`} className="hover:text-primary">{s.name}</a>
                      </h2>
                      <p className="mt-2 font-display text-lg italic text-muted-foreground">{d.headline}</p>
                    </div>
                  </div>
                  <div className="md:col-span-7">
                    <p className="font-light leading-relaxed text-foreground/85">{s.short}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Often helps with: </span>
                      {d.questions.slice(0, 2).map((q) => `“${q}”`).join(' ')}
                    </p>
                    <TextLink href={`/services/${s.slug}`} className="mt-5">Explore {s.name}</TextLink>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section tone="dark" pad="lg">
        <Container>
          <SectionHeading eyebrow="How every engagement works" title="The same discipline, applied to your question." className="mb-12" />
          <StepList steps={WORKING_APPROACH} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ['lock', 'Your information stays private', 'We ask only for what the analysis needs, and never for account passwords or logins.'],
              ['scale', 'Scope agreed in advance', 'Engagement scope and fees depend on your needs and are agreed with you before work begins.'],
              ['file', 'Transparent standards', 'Our Important Disclosures set out NVeston’s regulatory status and the scope of every service.'],
            ].map(([icon, t, d]) => (
              <div key={t} className="flex gap-4" data-reveal>
                <Icon name={icon} className="mt-1 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{t}</h3>
                  <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Not sure which service fits?"
        text="Most people think in terms of problems rather than service categories. Tell us what you are trying to decide and we will suggest where to start."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: '/who-we-serve', label: 'Browse by situation' }}
      />
    </>
  );
}
