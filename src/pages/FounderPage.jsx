import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/hamidullah-nazari-2886a3296';

const BIOGRAPHY = [
  'Hamidullah Nazari is the Founder and Managing Member of NVeston LLC, a Massachusetts-based financial intelligence and strategic advisory firm.',
  'With a professional background spanning business management, operations, and strategic decision-making, Nazari brings a multidisciplinary perspective to financial analysis and business advisory. His approach emphasizes analytical discipline, thoughtful resource allocation, and the importance of translating complex financial information into practical business decisions.',
  'He holds a Bachelor of Business Administration in Management and is pursuing a Master of Business Administration in Finance at Clark University.',
  "As Founder and Managing Member, Nazari leads NVeston's strategic direction and development of financial intelligence capabilities, with a focus on building a research-driven organization that supports informed decision-making and long-term financial resilience.",
];

const LEADERSHIP_PERSPECTIVE =
  "Hamidullah's approach to leadership rests on disciplined analysis and intellectual honesty: being clear about what is known, what is assumed, and what remains uncertain. He believes sound decisions are built on evidence rather than assertion, on an honest view of risk rather than a single forecast, and on a long-term perspective rather than short-term reaction. At NVeston, that means accountability for every conclusion and a commitment to translating complexity into clarity.";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function FounderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center">
              <img src="/NVeston Logo.png" alt="NVeston" className="h-12 w-auto" />
            </a>
            <a
              href="/"
              className="hidden sm:inline-flex items-center text-sm font-inter font-light text-muted-foreground hover:text-primary transition-colors duration-300 tracking-wide uppercase"
            >
              <ArrowLeft size={14} className="mr-2" />
              NVeston
            </a>
          </div>

          <a
            href="/#contact"
            className="inline-flex items-center px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-inter font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all duration-300 tracking-wide"
          >
            Schedule Consultation
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="pt-20 pb-24 md:pt-28 md:pb-32 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-20 items-start">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <figure className="relative max-w-[360px] lg:max-w-[400px] mx-auto lg:mx-0">
                <div className="rounded-sm overflow-hidden border border-border/60 bg-card">
                  <img
                    src="/images/hamidullah-nazari-nveston-founder.jpg"
                    srcSet="/images/hamidullah-nazari-nveston-founder-480.jpg 480w, /images/hamidullah-nazari-nveston-founder.jpg 877w"
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 80vw"
                    width="877"
                    height="1026"
                    alt="Hamidullah Nazari, Founder and Managing Member of NVeston LLC"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                </div>
                <div className="h-px w-16 bg-primary/60 mt-6" aria-hidden="true" />
              </figure>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-7">
              <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
                Founder &amp; Leadership
              </span>

              <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-4">
                Hamidullah Nazari
              </h1>

              <p className="font-inter text-sm text-muted-foreground tracking-wide mb-10">
                Founder &amp; Managing Member <span className="text-primary/60 mx-1">|</span> NVeston LLC
              </p>

              <div className="space-y-6 max-w-[65ch]">
                {BIOGRAPHY.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="font-inter text-base font-light text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 md:py-28 px-6 lg:px-8 bg-card/30">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto">
            <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Leadership Perspective
            </span>
            <div className="flex items-start gap-6">
              <div className="w-px self-stretch bg-primary/40 shrink-0" aria-hidden="true" />
              <p className="font-display text-xl md:text-2xl font-normal text-foreground/90 leading-relaxed">
                {LEADERSHIP_PERSPECTIVE}
              </p>
            </div>
          </motion.div>
        </section>

        <section className="py-20 md:py-24 px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto">
            <div className="flex flex-col items-start gap-8">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="me noopener noreferrer"
                className="inline-flex items-center font-inter text-sm text-foreground hover:text-primary transition-colors duration-300 tracking-wide"
              >
                Hamidullah Nazari on LinkedIn
                <ArrowUpRight size={16} className="ml-2 text-primary" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="/#services"
                  className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 border border-border hover:border-primary/40 text-sm font-inter text-muted-foreground hover:text-primary rounded-sm transition-all duration-300 tracking-wide"
                >
                  Explore NVeston's services
                </a>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center whitespace-nowrap px-6 py-3 bg-primary text-primary-foreground text-sm font-inter font-medium rounded-sm hover:bg-primary/90 transition-all duration-300 tracking-wide"
                >
                  Request an introductory consultation
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center">
            <img src="/NVeston Logo.png" alt="NVeston" className="h-10 w-auto" />
          </a>

          <div className="flex items-center gap-8">
            <a href="/" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
              Home
            </a>
            <a href="/#contact" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
              Contact
            </a>
          </div>

          <p className="text-xs font-inter text-muted-foreground/60">
            © NVeston. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
