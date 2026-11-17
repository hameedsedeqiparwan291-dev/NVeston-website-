import React from 'react';
import { serviceBySlug, toolBySlug, contactHref } from '../content/catalog.js';
import { SERVICE_DETAILS, WORKING_APPROACH } from '../content/services.js';
import {
  PageHero, Section, Container, SectionHeading, ButtonLink, StepList, CtaBand, FaqList, BulletList, Icon,
  IllustrativeTag, Notice, TextLink, LinkCard,
} from '../components/site/ui.jsx';
import { ProfitExample, ScenarioBars } from '../components/site/interactive.jsx';

export default function ServicePage({ route }) {
  const s = serviceBySlug(route.params.slug);
  const d = SERVICE_DETAILS[s.slug];
  const sc = d.scenario;
  const scenarioTool = sc.tool && toolBySlug(sc.tool);

  return (
    <>
      <PageHero
        route={route}
        eyebrow={d.eyebrow}
        title={d.headline}
        lead={d.lead}
        aside={
          <div className="rounded-sm border border-border bg-card/80 p-6 backdrop-blur" data-reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Designed for</p>
            <BulletList items={d.forWho} className="mt-4" />
          </div>
        }
      >
        <ButtonLink href={contactHref('consultation')}>Request an introductory consultation</ButtonLink>
        <ButtonLink href="#what-we-analyze" variant="secondary">What we analyze</ButtonLink>
      </PageHero>

      {/* Plain-language explanation + customer questions */}
      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="eyebrow mb-4">In plain terms</span>
              <div className="space-y-5 text-[1.05rem] font-light leading-relaxed text-foreground/90" data-reveal>
                {d.plain.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
              </div>
            </div>
            <div className="lg:col-span-6">
              <span className="eyebrow mb-4">Questions this helps answer</span>
              <ul className="space-y-3">
                {d.questions.map((q) => (
                  <li key={q} className="rounded-sm border border-border bg-card px-5 py-4 font-display text-[1.05rem] italic leading-snug text-foreground/90" data-reveal>
                    “{q}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section tone="dark" id="what-we-analyze" pad="lg">
        <Container>
          <SectionHeading eyebrow="What we analyze" title="Specific analytical capabilities." className="mb-12" />
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {d.capabilities.map((c) => (
              <div key={c.title} className="bg-background p-7" data-reveal>
                <h3 className="font-display text-lg font-medium">{c.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl font-medium">What you may receive</h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
                Every engagement is shaped around your question, so outputs vary. Typical work products include:
              </p>
            </div>
            <div className="lg:col-span-7">
              <BulletList items={d.deliverables} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Illustrative scenario */}
      <Section tone="paper" pad="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className={sc.visual ? 'lg:col-span-6' : 'lg:col-span-8'} data-reveal>
              <IllustrativeTag />
              <h2 className="mt-5 font-display text-3xl font-medium leading-tight">{sc.title}</h2>
              <p className="mt-5 font-light leading-relaxed text-foreground/85">{sc.setup}</p>
              <ol className="mt-6 space-y-3">
                {sc.points.map((p, i) => (
                  <li key={p} className="flex gap-4 text-[0.95rem] leading-relaxed">
                    <span className="font-display italic text-primary">{i + 1}.</span>
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-l-2 border-primary pl-5 font-light leading-relaxed text-foreground">{sc.takeaway}</p>
              {scenarioTool && <TextLink href={`/tools/${scenarioTool.slug}`} className="mt-6">Try it with your own numbers: {scenarioTool.name}</TextLink>}
              <p className="mt-6 text-xs text-muted-foreground">Hypothetical example for illustration only. It is not a client case or a prediction.</p>
            </div>
            {sc.visual && (
              <div className="lg:col-span-6" data-reveal>
                {sc.visual === 'profit' ? <ProfitExample compact /> : <ScenarioBars />}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Approach + tools */}
      <Section tone="dark" pad="lg">
        <Container>
          <SectionHeading eyebrow="How we work" title="A clear, collaborative process." className="mb-12" />
          <StepList steps={WORKING_APPROACH} />
          {d.tools.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-display text-2xl font-medium">Explore related tools</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {d.tools.map((slug) => {
                  const t = toolBySlug(slug);
                  return <LinkCard key={slug} href={`/tools/${slug}`} icon={t.icon} title={t.name} text={t.short} />;
                })}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* FAQ + related */}
      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="mb-8 font-display text-3xl font-medium">Frequently asked questions</h2>
              <FaqList items={d.faqs} />
              <Notice className="mt-10" title="Scope of this service">{d.scope} See our <a className="text-primary underline underline-offset-4" href="/policies/disclosures">Important Disclosures</a>.</Notice>
            </div>
            <aside className="lg:col-span-5" aria-labelledby="related-heading">
              <h2 id="related-heading" className="mb-6 font-display text-2xl font-medium">Related services</h2>
              <ul className="space-y-3">
                {d.related.map((slug) => {
                  const r = serviceBySlug(slug);
                  return (
                    <li key={slug}>
                      <a href={`/services/${slug}`} className="group flex gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary/60">
                        <Icon name={r.icon} className="mt-0.5 shrink-0 text-primary" />
                        <span>
                          <span className="block font-medium group-hover:text-primary">{r.name}</span>
                          <span className="mt-1 block text-sm font-light leading-snug text-muted-foreground">{r.short}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={`Discuss ${s.name.toLowerCase().startsWith('premium') ? 'a complex decision' : 'your situation'} with NVeston.`}
        text="A 15-minute introductory conversation is the simplest way to explore whether NVeston can help. Share your preferred time and we will follow up by email to confirm."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: contactHref(s.topic), label: 'Send a written question' }}
      />
    </>
  );
}
