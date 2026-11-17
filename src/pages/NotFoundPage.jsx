import React from 'react';
import { Section, Container, ButtonLink, HeroTexture } from '../components/site/ui.jsx';

export default function NotFoundPage() {
  return (
    <Section tone="dark" pad="none" className="relative overflow-hidden py-28 md:py-40">
      <HeroTexture />
      <Container className="relative max-w-3xl text-center">
        <span className="eyebrow mb-6">Error 404</span>
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl">This page could not be found.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
          The address may be mistyped, or the page may have moved. These are good places to continue:
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Homepage</ButtonLink>
          <ButtonLink href="/services" variant="secondary">Our services</ButtonLink>
          <ButtonLink href="/tools" variant="secondary">Tools</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Contact</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
