import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { SERVICES, SEGMENTS, TOOLS, INSIGHT_CATEGORIES, contactHref } from '../../content/catalog.js';
import { INSIGHTS_ENABLED, VISIBLE_ARTICLES } from '../../site/routes.js';
import { Icon } from './ui.jsx';

const GROUPS = [
  {
    key: 'services',
    label: 'Our Services',
    href: '/services',
    intro: 'Six areas of analysis that help you understand your situation, test your options and decide with confidence.',
    overview: 'All services',
    items: SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.name, text: s.short, icon: s.icon })),
  },
  {
    key: 'segments',
    label: 'Who We Serve',
    href: '/who-we-serve',
    intro: 'Start from your situation. Each page explains the challenges we see most often and how NVeston can help.',
    overview: 'Who we serve',
    items: SEGMENTS.map((s) => ({ href: `/who-we-serve/${s.slug}`, label: s.name, text: s.short })),
  },
  ...(INSIGHTS_ENABLED
    ? [{
        key: 'insights',
        label: 'Insights',
        href: '/insights',
        intro: 'NVeston Intelligence: clear, practical analysis of business, the economy, markets and risk.',
        overview: 'All insights',
        items: INSIGHT_CATEGORIES.filter((c) => VISIBLE_ARTICLES.some((a) => a.category === c.slug)).map((c) => ({ href: `/insights/${c.slug}`, label: c.name, text: c.short })),
      }]
    : []),
  {
    key: 'tools',
    label: 'Tools & Resources',
    href: '/tools',
    intro: 'Free calculators that run privately in your browser. Nothing you enter is stored or sent anywhere.',
    overview: 'All tools',
    items: TOOLS.map((t) => ({ href: `/tools/${t.slug}`, label: t.name, text: t.short, icon: t.icon })),
  },
  {
    key: 'about',
    label: 'About',
    href: '/about',
    intro: 'Who we are, how we work and the principles behind every analysis.',
    overview: 'About NVeston',
    items: [
      { href: '/about', label: 'About NVeston', text: 'Our purpose, approach and operating principles.' },
      { href: '/founder', label: 'Founder & Leadership', text: 'Hamidullah Nazari, Founder & Managing Member.' },
      { href: '/faq', label: 'Frequently Asked Questions', text: 'Consultations, tools and the boundaries of our work.' },
    ],
  },
];

export default function Header({ route }) {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const triggerRefs = useRef({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (open) {
        triggerRefs.current[open]?.focus();
        setOpen(null);
      }
      if (mobileOpen) setMobileOpen(false);
    };
    const onPointer = (e) => {
      if (open && headerRef.current && !headerRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const onBlurWithin = (e) => {
    if (open && headerRef.current && e.relatedTarget && !headerRef.current.contains(e.relatedTarget)) setOpen(null);
  };

  const current = route?.path;
  const activeGroup = GROUPS.find((g) => g.key === open);

  return (
    <header ref={headerRef} onBlur={onBlurWithin} className="theme-dark sticky top-0 z-50 border-b border-border bg-background">
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label="NVeston home">
          <img src="/brand/nveston-logo-96.png" alt="" width="44" height="44" className="h-11 w-11 rounded-[2px]" />
          <span className="hidden font-display text-lg tracking-wide text-foreground sm:inline">NVeston</span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {GROUPS.map((g) => {
              const isActive = route?.section === g.key;
              return (
                <li key={g.key}>
                  <button
                    ref={(el) => { triggerRefs.current[g.key] = el; }}
                    type="button"
                    aria-expanded={open === g.key}
                    aria-controls="nav-panel"
                    onClick={() => setOpen(open === g.key ? null : g.key)}
                    className={`relative flex items-center gap-1 px-3 py-2 text-[0.8rem] font-medium uppercase tracking-[0.08em] transition-colors hover:text-primary ${open === g.key || isActive ? 'text-primary' : 'text-foreground/80'}`}
                  >
                    {g.label}
                    <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-300 ${open === g.key ? 'rotate-180' : ''}`} />
                    {isActive && <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1.05rem] h-px bg-primary" />}
                  </button>
                </li>
              );
            })}
            <li>
              <a
                href="/contact"
                aria-current={current === '/contact' ? 'page' : undefined}
                className={`relative block px-3 py-2 text-[0.8rem] font-medium uppercase tracking-[0.08em] transition-colors hover:text-primary ${route?.section === 'contact' ? 'text-primary' : 'text-foreground/80'}`}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={contactHref('consultation')}
            className="hidden items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 xl:inline-flex"
          >
            Request a consultation
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-foreground lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      <div id="nav-panel" className={`absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-2xl shadow-black/40 ${activeGroup ? 'lg:block' : ''}`}>
        {activeGroup && (
          <div className="container-site grid gap-10 py-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-2xl text-foreground">{activeGroup.label}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{activeGroup.intro}</p>
              <a href={activeGroup.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4" onClick={() => setOpen(null)}>
                {activeGroup.overview}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:col-span-8">
              {activeGroup.items.map((it) => (
                <li key={it.href}>
                  <a
                    href={it.href}
                    aria-current={current === it.href ? 'page' : undefined}
                    onClick={() => setOpen(null)}
                    className="group flex gap-4 rounded-sm p-3 transition-colors hover:bg-card"
                  >
                    {it.icon && <Icon name={it.icon} size={18} className="mt-0.5 shrink-0 text-primary" />}
                    <span>
                      <span className={`block text-[0.95rem] font-medium group-hover:text-primary ${current === it.href ? 'text-primary' : 'text-foreground'}`}>{it.label}</span>
                      <span className="mt-1 block text-[0.8rem] font-light leading-snug text-muted-foreground">{it.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      <div id="mobile-nav" hidden={!mobileOpen} className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t border-border bg-background lg:hidden">
        <nav aria-label="Mobile" className="container-site pb-28 pt-6">
          <ul className="divide-y divide-border">
            {GROUPS.map((g) => (
              <li key={g.key}>
                <MobileGroup group={g} current={current} active={route?.section === g.key} />
              </li>
            ))}
            <li>
              <a href="/contact" className="block py-4 text-base font-medium text-foreground" aria-current={current === '/contact' ? 'page' : undefined}>
                Contact
              </a>
            </li>
          </ul>
          <a href={contactHref('consultation')} className="mt-6 flex w-full items-center justify-center rounded-sm bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground">
            Request a consultation
          </a>
        </nav>
      </div>
    </header>
  );
}

function MobileGroup({ group, current, active }) {
  const [expanded, setExpanded] = useState(active);
  const id = `m-${group.key}`;
  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center justify-between py-4 text-left text-base font-medium ${active ? 'text-primary' : 'text-foreground'}`}
      >
        {group.label}
        <ChevronDown size={18} aria-hidden="true" className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <ul id={id} hidden={!expanded} className="space-y-1 pb-4">
        <li>
          <a href={group.href} className="block py-2 pl-3 text-sm font-medium text-primary" aria-current={current === group.href ? 'page' : undefined}>
            {group.overview}
          </a>
        </li>
        {group.items.map((it) => (
          <li key={it.href}>
            <a href={it.href} aria-current={current === it.href ? 'page' : undefined} className={`block py-2 pl-3 text-sm ${current === it.href ? 'text-primary' : 'text-muted-foreground'}`}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
