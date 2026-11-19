import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { ORG } from '../site/config.js';
import { PageHero, Section, Container, StepList, Notice } from '../components/site/ui.jsx';
import { ContactFormMount } from '../components/site/ClientOnly.jsx';

const STEPS = [
  { title: 'Share your request', text: 'Choose “Request a 15-Minute Introductory Consultation”, describe your question and propose a date, time and time zone that suit you.' },
  { title: 'We review it', text: 'We read every request personally and consider whether NVeston is well placed to help.' },
  { title: 'We confirm by email', text: 'We reply to coordinate a mutually convenient time. Appointments are not confirmed automatically.' },
  { title: 'A 15-minute conversation', text: 'A short introduction to understand your situation and discuss whether and how we could help. No obligation.' },
];

export default function ContactPage({ route }) {
  return (
    <>
      <PageHero
        route={route}
        eyebrow="Contact & consultations"
        title="Begin with a short conversation."
        lead="Request a 15-minute introductory consultation, or send a general question. We will review your message and reply by email."
      >
        <a href="#contact" className="inline-flex items-center rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go to the form</a>
        <a href={`mailto:${ORG.email}`} className="inline-flex items-center gap-2 rounded-sm border border-foreground/25 px-6 py-3 text-sm font-medium hover:border-primary hover:text-primary">
          <Mail size={16} aria-hidden="true" /> {ORG.email}
        </a>
      </PageHero>

      <Section tone="light" pad="md">
        <Container>
          <h2 className="mb-10 font-display text-3xl font-medium">How an introductory consultation works</h2>
          <StepList steps={STEPS} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Notice title="About the introductory consultation">
              It is an introductory discussion to understand your needs and how NVeston can help. Any formal engagement, with its scope and fees, is agreed separately in writing.
            </Notice>
            <Notice title="Your privacy">
              Please do not include account numbers, passwords, Social Security numbers or financial statements. Your message is delivered securely to {ORG.email}. See our <a className="text-primary underline underline-offset-4" href="/policies/privacy">Privacy Policy</a>.
            </Notice>
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={15} aria-hidden="true" className="text-primary" /> {ORG.location}
          </p>
        </Container>
      </Section>

      <div className="theme-dark bg-background">
        <ContactFormMount />
      </div>
    </>
  );
}
