import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { SERVICES, SEGMENTS, TOOLS, contactHref } from '../../content/catalog.js';
import { INSIGHTS_ENABLED } from '../../site/routes.js';
import { ORG, FOUNDER } from '../../site/config.js';

const linkCls = 'text-sm font-light text-muted-foreground transition-colors hover:text-primary';

function Column({ title, links }) {
  return (
    <div>
      <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-foreground">{title}</h2>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className={linkCls} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {l.label}
              {l.external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-dark border-t border-border bg-background">
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href="/" className="inline-flex items-center gap-3" aria-label="NVeston home">
              <img src="/brand/nveston-logo-96.png" alt="" width="44" height="44" loading="lazy" className="h-11 w-11 rounded-[2px]" />
              <span className="font-display text-xl text-foreground">NVeston</span>
            </a>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
              Financial intelligence and strategic advisory. Disciplined analysis, explained clearly, to support better-informed decisions.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={15} aria-hidden="true" className="text-primary" />
                <a href={`mailto:${ORG.email}`} className="hover:text-primary">{ORG.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={15} aria-hidden="true" className="text-primary" />
                {ORG.location}
              </li>
            </ul>
            <a href={contactHref('consultation')} className="mt-8 inline-flex items-center rounded-sm border border-primary/60 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Request an introductory consultation
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:col-span-8">
            <Column title="Services" links={SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))} />
            <Column
              title="Who We Serve"
              links={[...SEGMENTS.map((s) => ({ href: `/who-we-serve/${s.slug}`, label: s.navName })), { href: '/who-we-serve', label: 'Overview' }]}
            />
            <Column title="Tools" links={TOOLS.map((t) => ({ href: `/tools/${t.slug}`, label: t.name.replace(/ (Analyzer|Simulator|Calculator|Assessment)$/, '') }))} />
            <Column
              title="Company"
              links={[
                { href: '/about', label: 'About NVeston' },
                { href: '/founder', label: 'Founder & Leadership' },
                ...(INSIGHTS_ENABLED ? [{ href: '/insights', label: 'Intelligence & Insights' }] : []),
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact' },
                { href: FOUNDER.linkedin, label: 'Founder on LinkedIn', external: true },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="max-w-4xl text-xs font-light leading-relaxed text-muted-foreground">
            {ORG.registration} NVeston provides financial analysis, strategic insight and decision support. Website content and tools are for general information and analysis; they are not personalized investment, legal, tax or accounting advice. Past results and hypothetical examples do not guarantee future outcomes.
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {year} {ORG.legalName}. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><a href="/policies/privacy" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="/policies/terms" className="hover:text-primary">Terms of Use</a></li>
              <li><a href="/policies/disclosures" className="hover:text-primary">Important Disclosures</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
