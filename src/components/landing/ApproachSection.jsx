import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'We begin by understanding your capital structure, objectives, risk tolerance, and time horizon through direct conversation and careful assessment.',
  },
  {
    number: '02',
    title: 'Analyze',
    description: 'We evaluate the broader environment — including macroeconomic conditions, sector dynamics, policy shifts, and global market forces — to understand where opportunities and risks are emerging.',
  },
  {
    number: '03',
    title: 'Architect',
    description: 'We design capital positioning frameworks tailored to your specific goals, focusing on structure, resilience, and long-term alignment rather than templated solutions.',
  },
  {
    number: '04',
    title: 'Execute & Evolve',
    description: 'We support disciplined execution while continuously refining strategy as market conditions evolve, helping ensure capital remains aligned with changing environments.',
  },
];

export default function ApproachSection() {
  return (
    <section id="approach" className="py-32 px-6 lg:px-8 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Our Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
            A Deliberate <span className="text-primary italic">Approach</span>
          </h2>
        </motion.div>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="group flex items-start gap-8 lg:gap-12 py-10 border-b border-border/50 last:border-0 hover:border-primary/20 transition-colors duration-500"
            >
              <span className="font-display text-4xl lg:text-5xl font-medium text-primary/20 group-hover:text-primary/50 transition-colors duration-500 shrink-0">
                {step.number}
              </span>

              <div>
                <h3 className="font-display text-xl lg:text-2xl font-medium text-foreground mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="font-inter text-sm lg:text-base font-light text-muted-foreground leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}