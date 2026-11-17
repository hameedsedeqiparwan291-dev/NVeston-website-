import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BIOGRAPHY, LEADERSHIP_PERSPECTIVE } from '../content/founder.js';
import { FOUNDER } from '../site/config.js';
import { contactHref } from '../content/catalog.js';
import { Section, Container, Breadcrumbs, ButtonLink, HeroTexture } from '../components/site/ui.jsx';

export default function FounderPage({ route }) {
  return (
    <>
      <Section tone="dark" pad="none" className="relative overflow-hidden border-b border-border pb-20 pt-12 md:pb-28 md:pt-16">
        <HeroTexture />
        <Container className="relative">
          <Breadcrumbs items={route.breadcrumbs} />
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <figure className="relative mx-auto max-w-[360px] lg:mx-0 lg:max-w-[400px]">
                <div className="overflow-hidden rounded-sm border border-border/60 bg-card">
                  <img
                    src={FOUNDER.image}
                    srcSet={`${FOUNDER.image480} 480w, ${FOUNDER.image} 877w`}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 80vw"
                    width="877"
                    height="1026"
                    alt={FOUNDER.alt}
                    fetchpriority="high"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
                <div className="mt-6 h-px w-16 bg-primary/60" aria-hidden="true" />
              </figure>
            </div>

            <div className="lg:col-span-7">
              <span className="eyebrow mb-4">Founder &amp; Leadership</span>
              <h1 className="mb-4 font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">{FOUNDER.name}</h1>
              <p className="mb-10 text-sm tracking-wide text-muted-foreground">
                Founder &amp; Managing Member <span className="mx-1 text-primary/60">|</span> NVeston LLC
              </p>
              <div className="max-w-[65ch] space-y-6">
                {BIOGRAPHY.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-base font-light leading-relaxed text-foreground/80">
                    {paragraph}
                  </p>
                ))}
              </div>
              <a
                href={FOUNDER.linkedin}
                target="_blank"
                rel="me noopener noreferrer"
                className="mt-10 inline-flex items-center text-sm tracking-wide text-foreground transition-colors duration-300 hover:text-primary"
              >
                Hamidullah Nazari on LinkedIn
                <ArrowUpRight size={16} aria-hidden="true" className="ml-2 text-primary" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy" pad="lg">
        <Container className="max-w-3xl">
          <span className="eyebrow mb-4">Leadership Perspective</span>
          <div className="flex items-start gap-6" data-reveal>
            <div className="w-px shrink-0 self-stretch bg-primary/40" aria-hidden="true" />
            <p className="font-display text-xl font-normal leading-relaxed text-foreground/90 md:text-2xl">{LEADERSHIP_PERSPECTIVE}</p>
          </div>
        </Container>
      </Section>

      <Section tone="light" pad="md">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-medium">Learn more about NVeston</h2>
          <p className="mt-3 font-light leading-relaxed text-muted-foreground">
            Explore how NVeston works, the services it offers and how to begin a conversation.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/about" variant="secondary">About NVeston</ButtonLink>
            <ButtonLink href="/services" variant="secondary">Explore NVeston’s services</ButtonLink>
            <ButtonLink href={contactHref('consultation')}>Request an introductory consultation</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
