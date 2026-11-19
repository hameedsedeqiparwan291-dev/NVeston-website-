import React from 'react';
import { SERVICES, contactHref } from '../content/catalog.js';
import { WORKING_APPROACH } from '../content/services.js';
import { FOUNDER } from '../site/config.js';
import { PageHero, Section, Container, SectionHeading, StepList, CtaBand, TextLink, BulletList, ButtonLink } from '../components/site/ui.jsx';

const PRINCIPLES = [
  { title: 'Clarity over complexity', text: 'If an analysis cannot be explained in plain language, it is not finished. We translate financial complexity into choices people can act on.' },
  { title: 'Evidence over assertion', text: 'Conclusions should follow from data and reasoning that can be examined. We show our assumptions and cite our sources.' },
  { title: 'Honesty about uncertainty', text: 'We are clear about what is known, what is assumed and what remains uncertain. We prepare for a range of outcomes rather than promising one.' },
  { title: 'Accountability', text: 'We take responsibility for how every conclusion is reasoned and communicated, and for staying within the boundaries of what we do.' },
  { title: 'Your decision, your control', text: 'We provide analysis and perspective. Your decisions, and the information you share with us, remain yours.' },
  { title: 'Long-term perspective', text: 'Sound financial decisions are rarely about the next month alone. We consider durability, resilience and the years ahead.' },
];

export default function AboutPage({ route }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="About NVeston"
        title="A financial intelligence firm built on disciplined analysis."
        lead="NVeston exists to help people and businesses understand their finances clearly enough to make better decisions, with analysis that is rigorous, honest about uncertainty and explained in plain language."
      >
        <ButtonLink href="/services">Explore our services</ButtonLink>
        <ButtonLink href="/founder" variant="secondary">Founder &amp; Leadership</ButtonLink>
      </PageHero>

      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow mb-4">Who we are</span>
              <h2 className="font-display text-3xl font-medium leading-tight md:text-4xl">A focused firm, with a clear purpose.</h2>
            </div>
            <div className="space-y-5 text-[1.05rem] font-light leading-relaxed text-foreground/85 lg:col-span-7" data-reveal>
              <p>NVeston LLC is a Massachusetts-based financial intelligence and strategic advisory firm, operating on a remote-first basis within the United States. It was founded and is led by {FOUNDER.name}, Founder &amp; Managing Member.</p>
              <p>Our work is analysis and decision support. We help individuals understand their income, spending, debt and resilience; help business owners understand profit, cash flow, pricing and growth; translate economic and market developments into practical implications; and bring structure to complex strategic decisions.</p>
              <p>NVeston is a young firm with a clear focus: careful, personal analytical work delivered with the discipline and clarity of an established institution.</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="dark" pad="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            <div data-reveal>
              <span className="eyebrow mb-4">Mission</span>
              <p className="font-display text-2xl leading-snug md:text-3xl">To make disciplined financial analysis accessible and understandable, so that individuals and businesses can make better-informed decisions about their money and their future.</p>
            </div>
            <div data-reveal>
              <span className="eyebrow mb-4">Philosophy</span>
              <p className="font-light leading-relaxed text-muted-foreground">
                Capital deserves direction, whether it is a household’s savings or a company’s cash. Our work rests on three ideas that have guided NVeston from the start: <strong className="font-medium text-foreground">disciplined analysis</strong>, grounded in evidence rather than emotion; <strong className="font-medium text-foreground">structural insight</strong>, looking beneath the surface for what actually drives an outcome; and <strong className="font-medium text-foreground">adaptive frameworks</strong>, built for a range of possible futures rather than a single forecast.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" pad="lg">
        <Container>
          <SectionHeading eyebrow="Operating principles" title="How we work, and what you can expect from us." className="mb-12" />
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-card p-7" data-reveal>
                <h3 className="font-display text-xl font-medium">{p.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark" pad="lg">
        <Container>
          <SectionHeading eyebrow="Our analytical approach" title="Understand. Analyze. Architect. Apply & Evolve." className="mb-12" />
          <StepList steps={WORKING_APPROACH} />
        </Container>
      </Section>

      <Section tone="light" pad="lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <span className="eyebrow mb-4">Today and tomorrow</span>
              <h2 className="font-display text-3xl font-medium leading-tight">What we do today, and where we are headed.</h2>
              <p className="mt-5 font-light leading-relaxed text-muted-foreground">We are precise about the difference between what we offer today and what we are building toward.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6">
              <div>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-primary">Today</h3>
                <BulletList items={[
                  'Six areas of analysis and decision support',
                  'Free educational tools on this website',
                  'HAMI, an AI assistant for general questions',
                  'Introductory consultations by request',
                ]} />
              </div>
              <div>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Our long-term ambition</h3>
                <BulletList items={[
                  'A growing library of research and publications',
                  'Additional analytical tools and products',
                  'A larger research-driven organization',
                  'Any regulated services only if and when properly authorized',
                ]} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" pad="md">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-medium">Our services</h2>
              <ul className="mt-5 space-y-2">
                {SERVICES.map((s) => <li key={s.slug}><TextLink href={`/services/${s.slug}`}>{s.name}</TextLink></li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium">Regulatory transparency</h2>
              <p className="mt-5 text-sm font-light leading-relaxed text-muted-foreground">
                NVeston LLC is a Massachusetts limited liability company. Our Important Disclosures explain its regulatory status and the scope of our services in full.
              </p>
              <TextLink href="/policies/disclosures" className="mt-4">Read our Important Disclosures</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Start with a conversation."
        text="A 15-minute introductory consultation is the simplest way to see whether NVeston can help with what you are facing."
        primary={{ href: contactHref('consultation'), label: 'Request an introductory consultation' }}
        secondary={{ href: '/founder', label: 'Meet the founder' }}
      />
    </>
  );
}
