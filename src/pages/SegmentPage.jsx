import React from 'react';
import { segmentBySlug, serviceBySlug, toolBySlug, SEGMENTS, contactHref } from '../content/catalog.js';
import { SEGMENT_DETAILS } from '../content/segments.js';
import { PageHero, Section, Container, SectionHeading, ButtonLink, CtaBand, Icon, IllustrativeTag, LinkCard, Notice, TextLink } from '../components/site/ui.jsx';

export default function SegmentPage({ route }) {
  const s = segmentBySlug(route.params.slug);
  const d = SEGMENT_DETAILS[s.slug];
  const others = SEGMENTS.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero route={route} eyebrow={d.eyebrow} title={d.headline} lead={d.lead}>
        <ButtonLink href={contactHref('consultation')}>Request an introductory consultation</ButtonLink>
        <ButtonLink href="#how-we-help" variant="secondary">How NVeston can help</ButtonLink>
      </PageHero>

      <Section tone="light" pad="lg">
        <Container>
          <SectionHeading eyebrow="What we often hear" title="Situations you may recognize." className="mb-12" />
          <div className="grid gap-5 md:grid-cols-2">
            {d.concerns.map((c) => (
              <div key={c.title} className="rounded-sm border border-border bg-card p-7" data-reveal>
                <h3 className="font-display text-xl font-medium">{c.title}</h3>
                <p className="mt-2 font-light leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark" id="how-we-help" pad="lg">
        <Container>
          <SectionHeading eyebrow="How NVeston can help" title="Analysis matched to your situation." className="mb-12" />
          <div className="space-y-px overflow-hidden rounded-sm border border-border bg-border">
            {d.help.map((h) => {
              const svc = serviceBySlug(h.slug);
              return (
                <a key={h.slug} href={`/services/${h.slug}`} className="group grid gap-4 bg-background p-7 transition-colors hover:bg-card md:grid-cols-12 md:items-center" data-reveal>
                  <span className="flex items-center gap-4 md:col-span-5">
                    <Icon name={svc.icon} className="shrink-0 text-primary" />
                    <span className="font-display text-xl group-hover:text-primary">{svc.name}</span>
                  </span>
                  <span className="text-[0.95rem] font-light leading-relaxed text-muted-foreground md:col-span-6">{h.text}</span>
                  <span aria-hidden="true" className="hidden text-right text-primary md:col-span-1 md:block">→</span>
                </a>
              );
            })}
          </div>
          {d.note && <Notice className="mt-8">{d.note}</Notice>}
        </Container>
      </Section>

      <Section tone="paper" pad="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7" data-reveal>
              <IllustrativeTag />
              <h2 className="mt-5 font-display text-3xl font-medium leading-tight">{d.example.title}</h2>
              <p className="mt-5 text-[1.05rem] font-light leading-relaxed text-foreground/85">{d.example.text}</p>
              <p className="mt-6 text-xs text-muted-foreground">Hypothetical example for illustration only. It is not a client case.</p>
            </div>
            <div className="lg:col-span-5">
              {d.tools.length > 0 ? (
                <>
                  <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Try with your own numbers</h2>
                  <div className="space-y-4">
                    {d.tools.map((slug) => {
                      const t = toolBySlug(slug);
                      return <LinkCard key={slug} href={`/tools/${slug}`} icon={t.icon} title={t.name} text={t.short} />;
                    })}
                  </div>
                </>
              ) : (
                <div className="rounded-sm border border-border bg-card p-7">
                  <h2 className="font-display text-xl">Explore our research approach</h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">See what NVeston’s market and economic intelligence covers, and the boundaries we keep.</p>
                  <TextLink href="/services/financial-markets-portfolio-intelligence" className="mt-5">Financial Markets & Portfolio Intelligence</TextLink>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="light" pad="md">
        <Container>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Other situations we work with</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/who-we-serve/${o.slug}`} className="group block rounded-sm border border-border bg-card p-5 hover:border-primary/60">
                  <span className="font-display text-lg group-hover:text-primary">{o.name}</span>
                  <span className="mt-1 block text-sm font-light text-muted-foreground">{o.short}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Talk through your situation."
        text="Share your preferred date and time for a 15-minute introductory conversation. We will review your request and follow up by email to confirm."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: contactHref(d.topic), label: 'Send a written question' }}
      />
    </>
  );
}
