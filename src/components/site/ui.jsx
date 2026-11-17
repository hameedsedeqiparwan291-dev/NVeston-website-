import React from 'react';
import {
  ArrowRight, ArrowUpRight, Wallet, ChartLine, Globe, Shield, Briefcase, Compass, Percent, Waves, Target,
  Landmark, LifeBuoy, Info, TriangleAlert, User, Store, Rocket, TrendingUp, Scale, Layers, Lightbulb,
  BookOpen, Calculator, MessageSquare, Lock, FileText, Clock,
} from 'lucide-react';

export const ICONS = {
  wallet: Wallet, chart: ChartLine, globe: Globe, shield: Shield, briefcase: Briefcase, compass: Compass,
  percent: Percent, waves: Waves, target: Target, landmark: Landmark, lifebuoy: LifeBuoy, user: User,
  store: Store, rocket: Rocket, trending: TrendingUp, scale: Scale, layers: Layers, lightbulb: Lightbulb,
  book: BookOpen, calculator: Calculator, message: MessageSquare, lock: Lock, file: FileText, clock: Clock,
};

export function Icon({ name, size = 20, className = '', ...rest }) {
  const C = ICONS[name] || Info;
  return <C size={size} className={className} aria-hidden="true" strokeWidth={1.6} {...rest} />;
}

const cx = (...c) => c.filter(Boolean).join(' ');

const PAD = { none: '', sm: 'py-14 md:py-16', md: 'py-20 md:py-24', lg: 'py-24 md:py-32' };

export function Section({ tone = 'dark', pad = 'md', id, className = '', children, labelledBy, as: Tag = 'section' }) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={cx(`theme-${tone} bg-background text-foreground`, PAD[pad], className)}>
      {children}
    </Tag>
  );
}

export function Container({ className = '', children, narrow = false }) {
  return <div className={cx('container-site', narrow && 'max-w-4xl', className)}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, lead, id, align = 'left', className = '', as: H = 'h2' }) {
  return (
    <div className={cx('max-w-3xl', align === 'center' && 'mx-auto text-center', className)} data-reveal>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <H id={id} className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-foreground md:text-[2.6rem]">
        {title}
      </H>
      {lead && <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground md:text-lg">{lead}</p>}
    </div>
  );
}

const BTN = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 border border-primary',
  secondary: 'border border-foreground/25 text-foreground hover:border-primary hover:text-primary',
  ghost: 'text-foreground hover:text-primary px-0',
};

export function ButtonLink({ href, children, variant = 'primary', icon = 'arrow', className = '', size = 'md', ...rest }) {
  const external = /^https?:/.test(href);
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cx(
        'group inline-flex items-center justify-center gap-2 rounded-sm font-inter font-medium tracking-wide transition-colors duration-300',
        size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-sm',
        variant === 'ghost' && 'py-1',
        BTN[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {icon && <Arrow size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function TextLink({ href, children, className = '' }) {
  return (
    <a href={href} className={cx('group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4', className)}>
      {children}
      <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

export function Breadcrumbs({ items }) {
  if (!items || items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-foreground/80">{c.name}</span>
              ) : (
                <>
                  <a href={c.path} className="hover:text-primary">{c.name}</a>
                  <span aria-hidden="true" className="text-muted-foreground/60">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHero({ route, eyebrow, title, lead, children, aside, tone = 'dark' }) {
  return (
    <Section tone={tone} pad="none" className="relative overflow-hidden border-b border-border pb-16 pt-12 md:pb-24 md:pt-16">
      <HeroTexture />
      <Container className="relative">
        <Breadcrumbs items={route?.breadcrumbs} />
        <div className={cx('grid gap-12', aside && 'lg:grid-cols-12 lg:items-end')}>
          <div className={aside ? 'lg:col-span-7' : 'max-w-4xl'}>
            {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
            <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
            {lead && <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">{lead}</p>}
            {children && <div className="mt-9 flex flex-wrap gap-4">{children}</div>}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </Container>
    </Section>
  );
}

// Fine survey-grid texture for dark hero areas; purely decorative.
export function HeroTexture() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]">
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="nv-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
          </pattern>
          <linearGradient id="nv-fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="nv-mask">
            <rect width="100%" height="100%" fill="url(#nv-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#nv-grid)" mask="url(#nv-mask)" />
      </svg>
    </div>
  );
}

export function Panel({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={cx('rounded-sm border border-border bg-card', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function LinkCard({ href, icon, title, text, meta, className = '' }) {
  return (
    <a
      href={href}
      className={cx(
        'group flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/60 md:p-7',
        className,
      )}
      data-reveal
    >
      {icon && (
        <span className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-primary/30 text-primary">
          <Icon name={icon} />
        </span>
      )}
      {meta && <span className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{meta}</span>}
      <span className="font-display text-xl font-medium leading-snug text-foreground">{title}</span>
      {text && <span className="mt-3 flex-1 text-sm font-light leading-relaxed text-muted-foreground">{text}</span>}
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Learn more
        <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  );
}

export function Notice({ tone = 'info', title, children, className = '' }) {
  const Ico = tone === 'warning' ? TriangleAlert : Info;
  return (
    <div
      className={cx(
        'flex gap-3 rounded-sm border p-4 text-sm leading-relaxed',
        tone === 'warning' ? 'border-negative/40 bg-negative/5' : tone === 'draft' ? 'border-primary/50 bg-primary/10' : 'border-border bg-muted/50',
        className,
      )}
      role={tone === 'warning' ? 'status' : undefined}
    >
      <Ico size={18} aria-hidden="true" className={cx('mt-0.5 shrink-0', tone === 'warning' ? 'text-negative' : 'text-primary')} />
      <div className="text-foreground/85">
        {title && <p className="mb-1 font-medium text-foreground">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function IllustrativeTag({ children = 'Illustrative example' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-primary">
      {children}
    </span>
  );
}

export function FaqList({ items, className = '' }) {
  return (
    <div className={cx('divide-y divide-border border-y border-border', className)}>
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="text-base md:text-[1.05rem]">{f.q}</span>
            <span aria-hidden="true" className="mt-1 text-primary transition-transform duration-300 group-open:rotate-45">
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" /></svg>
            </span>
          </summary>
          <div className="mt-3 max-w-measure text-[0.95rem] font-light leading-relaxed text-muted-foreground">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ eyebrow = 'Next step', title, text, primary, secondary, tone = 'navy' }) {
  return (
    <Section tone={tone} pad="md" className="border-y border-border">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center" data-reveal>
          <div className="lg:col-span-8">
            <span className="eyebrow mb-4">{eyebrow}</span>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">{title}</h2>
            {text && <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted-foreground">{text}</p>}
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            {primary && <ButtonLink href={primary.href}>{primary.label}</ButtonLink>}
            {secondary && (
              <ButtonLink href={secondary.href} variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function StepList({ steps, className = '' }) {
  return (
    <ol className={cx('grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4', className)}>
      {steps.map((s, i) => (
        <li key={s.title} className="bg-background p-6 md:p-7" data-reveal>
          <span className="font-display text-sm italic text-primary">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="mt-4 font-display text-xl font-medium">{s.title}</h3>
          <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function BulletList({ items, className = '' }) {
  return (
    <ul className={cx('space-y-3', className)}>
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground/85">
          <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-primary" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function DraftBanner({ children }) {
  return (
    <div className="theme-light border-b border-primary/40 bg-primary/10 text-foreground">
      <div className="container-site flex items-center gap-3 py-2.5 text-sm">
        <TriangleAlert size={16} aria-hidden="true" className="shrink-0 text-primary" />
        <span>{children}</span>
      </div>
    </div>
  );
}
