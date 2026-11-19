import React from 'react';
import { SERVICES, SEGMENTS, TOOLS, INSIGHT_CATEGORIES, contactHref } from '../content/catalog.js';
import { WORKING_APPROACH } from '../content/services.js';
import { INSIGHTS_ENABLED, VISIBLE_ARTICLES } from '../site/routes.js';
import { FOUNDER } from '../site/config.js';
import {
  Section, Container, SectionHeading, ButtonLink, TextLink, LinkCard, StepList, HeroTexture, Icon, IllustrativeTag,
} from '../components/site/ui.jsx';
import { NeedsSelector, ProfitExample } from '../components/site/interactive.jsx';
import { FinancialIntelligenceVisual, GlobeVisual } from '../components/site/visuals.jsx';
import { ContactFormMount } from '../components/site/ClientOnly.jsx';

const SCENARIOS = [
  {
    title: 'Profitable, but short of cash',
    text: 'Customers pay 60 days after the work is done, but staff and suppliers are paid this month. As sales grow, the business funds more work before the money arrives, and the bank balance can fall even as profit rises.',
    href: '/tools/cash-flow',
    cta: 'Explore the Cash Flow Simulator',
  },
  {
    title: 'A second location',
    text: 'Before committing, an owner needs to weigh start-up costs, financing payments, expected revenue and operating costs, and to know what happens if the new site takes a year longer to reach break-even.',
    href: '/services/entrepreneur-business-advisory',
    cta: 'Entrepreneur & Business Advisory',
  },
  {
    title: 'Covering the bills, without a cushion',
    text: 'Someone earns enough to pay every bill, but debt payments and thin savings mean one unexpected expense could tip the balance. Seeing the numbers clearly is the first step toward a sturdier position.',
    href: '/tools/financial-resilience',
    cta: 'Take the Resilience Assessment',
  },
];

const PRINCIPLES = [
  { title: 'Disciplined Analysis', text: 'Conclusions follow from structured work and evidence, never from momentum, headlines or preference.' },
  { title: 'Structural Insight', text: 'We look beneath the surface for the forces that actually drive an outcome: costs, timing, rates, concentration.' },
  { title: 'Adaptive Frameworks', text: 'Plans built for a range of outcomes, with assumptions written down so they can be revisited as conditions change.' },
];

export default function HomePage() {
  const featured = VISIBLE_ARTICLES.filter((a) => a.featured).slice(0, 3);
  return (
    <>
      {/* Hero */}
      <Section tone="dark" pad="none" className="relative overflow-hidden border-b border-border">
        <HeroTexture />
        <Container className="relative grid gap-12 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="eyebrow mb-6">Financial intelligence &amp; strategic advisory</span>
            <h1 className="font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Better decisions start with a <span className="italic text-primary">clearer picture.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              NVeston helps individuals, business owners and entrepreneurs understand their finances, test their options and act with confidence, backed by disciplined analysis explained in plain language.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="#how-we-help">Find how NVeston can help</ButtonLink>
              <ButtonLink href={contactHref('consultation')} variant="secondary">Request an introductory consultation</ButtonLink>
            </div>
          </div>
          <div className="pt-10 sm:pt-6 lg:col-span-5 lg:pt-0">
            <FinancialIntelligenceVisual />
          </div>
        </Container>
      </Section>

      {/* What NVeston is, in one line each */}
      <Section tone="navy" pad="sm" className="border-b border-border">
        <Container>
          <dl className="grid gap-8 md:grid-cols-3">
            {[
              ['What we do', 'Analyze your financial situation and the decisions in front of you, and explain what we find in plain language.'],
              ['Who we serve', 'Individuals, small businesses, entrepreneurs and people who want to understand markets and the economy.'],
              ['What you gain', 'A clear view of your options, the trade-offs between them and the risks worth preparing for.'],
            ].map(([t, d]) => (
              <div key={t} className="border-l border-primary/50 pl-5" data-reveal>
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{t}</dt>
                <dd className="mt-2 text-[0.95rem] font-light leading-relaxed text-foreground/85">{d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Needs selector */}
      <Section tone="light" id="how-we-help" labelledBy="how-heading" pad="lg">
        <Container>
          <SectionHeading
            id="how-heading"
            eyebrow="Start with your situation"
            title="How can NVeston help you?"
            lead="Choose the statement closest to where you are today. We will point you to the analysis, tools and next steps most relevant to you."
            className="mb-12"
          />
          <NeedsSelector />
        </Container>
      </Section>

      {/* Services */}
      <Section tone="dark" id="services" labelledBy="services-heading" pad="lg">
        <Container>
          <div className="mb-14 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <SectionHeading
                id="services-heading"
                eyebrow="Our services"
                title="Six disciplines. One purpose: clearer decisions."
                lead="Each service applies the same analytical discipline to a different kind of question, from household budgets to complex strategic choices."
              />
              <ButtonLink href="/services" variant="secondary" className="mt-8">All services</ButtonLink>
            </div>
            <div className="lg:col-span-5">
              <GlobeVisual />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <LinkCard key={s.slug} href={`/services/${s.slug}`} icon={s.icon} meta={String(i + 1).padStart(2, '0')} title={s.name} text={s.short} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Practical value */}
      <Section tone="paper" labelledBy="value-heading" pad="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionHeading
                id="value-heading"
                eyebrow="What analysis looks like in practice"
                title="Small changes in the right place can matter a great deal."
                lead="A business with $50,000 in monthly revenue and $45,000 in expenses earns $5,000 a month. Move the slider to see what a modest reduction in expenses would mean over a year."
              />
              <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground" data-reveal>
                The real work is finding which costs can change without hurting revenue, and whether the change will last. That is where careful analysis earns its keep.
              </p>
            </div>
            <div className="lg:col-span-7" data-reveal>
              <ProfitExample />
            </div>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {SCENARIOS.map((s) => (
              <article key={s.title} className="flex flex-col rounded-sm border border-border bg-card p-6 md:p-7" data-reveal>
                <IllustrativeTag>Common scenario</IllustrativeTag>
                <h3 className="mt-5 font-display text-xl font-medium">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">{s.text}</p>
                <TextLink href={s.href} className="mt-6">{s.cta}</TextLink>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Approach */}
      <Section tone="dark" id="approach" labelledBy="approach-heading" pad="lg">
        <Container>
          <SectionHeading
            id="approach-heading"
            eyebrow="Our approach"
            title="A deliberate process, built around your decision."
            lead="Financial analysis is not about predicting the future with certainty. It is about understanding your position and the range of possible outcomes well enough to choose wisely."
            className="mb-14"
          />
          <StepList steps={WORKING_APPROACH} />
        </Container>
      </Section>

      {/* Who we serve */}
      <Section tone="light" id="clients" labelledBy="clients-heading" pad="lg">
        <Container>
          <SectionHeading id="clients-heading" eyebrow="Who we serve" title="Built for people who want to understand before they decide." className="mb-14" />
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s) => (
              <a key={s.slug} href={`/who-we-serve/${s.slug}`} className="group flex flex-col bg-card p-7 transition-colors hover:bg-background" data-reveal>
                <span className="font-display text-xl font-medium group-hover:text-primary">{s.name}</span>
                <span className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">{s.short}</span>
                <span className="mt-6 text-sm font-medium text-primary">Learn more →</span>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tools */}
      <Section tone="navy" labelledBy="tools-heading" pad="lg">
        <Container>
          <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="tools-heading"
              eyebrow="Tools & resources"
              title="Explore your own numbers."
              lead="Free calculators that run entirely in your browser. Nothing you enter is stored, tracked or sent anywhere."
            />
            <ButtonLink href="/tools" variant="secondary">All tools</ButtonLink>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <a href={`/tools/${t.slug}`} className="group flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/60" data-reveal>
                  <Icon name={t.icon} className="text-primary" size={22} />
                  <span className="mt-6 font-display text-lg leading-snug group-hover:text-primary">{t.name}</span>
                  <span className="mt-2 text-xs font-light leading-relaxed text-muted-foreground">{t.short}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Insights */}
      {INSIGHTS_ENABLED && featured.length > 0 && (
        <Section tone="light" labelledBy="insights-heading" pad="lg">
          <Container>
            <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeading id="insights-heading" eyebrow="NVeston Intelligence" title="Clear thinking on business, the economy and risk." />
              <ButtonLink href="/insights" variant="secondary">All insights</ButtonLink>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featured.map((a) => (
                <LinkCard
                  key={a.slug}
                  href={`/insights/${a.category}/${a.slug}`}
                  meta={`${INSIGHT_CATEGORIES.find((c) => c.slug === a.category).name}${a.status !== 'published' ? ' · Draft' : ''}`}
                  title={a.title}
                  text={a.summary}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Philosophy + founder */}
      <Section tone="dark" id="philosophy" labelledBy="philosophy-heading" pad="lg" className="border-y border-border">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading
                id="philosophy-heading"
                eyebrow="Our philosophy"
                title={<>Capital deserves <span className="italic text-primary">direction.</span></>}
                lead="Every decision about money, whether a household budget, a price change or an expansion, is better made with a clear view of the facts, an honest view of the risks and a plan for more than one outcome."
              />
              <div className="mt-10 space-y-7">
                {PRINCIPLES.map((p) => (
                  <div key={p.title} className="flex gap-5" data-reveal>
                    <span aria-hidden="true" className="mt-1 h-12 w-px shrink-0 bg-primary/50" />
                    <div>
                      <h3 className="font-display text-lg font-medium">{p.title}</h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-muted-foreground">{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-5" aria-label="Founder & Leadership" data-reveal>
              <div className="rounded-sm border border-border bg-card p-7">
                <span className="eyebrow mb-6">Leadership</span>
                <div className="flex items-center gap-5">
                  <img src={FOUNDER.image480} alt={FOUNDER.alt} width="480" height="561" loading="lazy" decoding="async" className="h-24 w-20 rounded-sm object-cover object-top" />
                  <div>
                    <p className="font-display text-xl">{FOUNDER.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{FOUNDER.title}, NVeston LLC</p>
                  </div>
                </div>
                <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground">
                  NVeston is led by its founder, who directs the firm’s strategy and analytical work with a focus on building a research-driven organization.
                </p>
                <TextLink href="/founder" className="mt-6">Meet NVeston’s founder</TextLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Contact (existing approved form) */}
      <div className="theme-dark bg-background">
        <ContactFormMount />
      </div>
    </>
  );
}
