import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Building2 } from 'lucide-react';

const clients = [
  {
    icon: User,
    title: 'Individuals',
    description:
      'High-net-worth individuals focused on protecting and compounding wealth through disciplined, long-term capital positioning beyond short-term market noise.',
  },
  {
    icon: Briefcase,
    title: 'Investors',
    description:
      'Active and institutional investors seeking structural insight in portfolio construction, capital allocation, and risk calibration across evolving market environments.',
  },
  {
    icon: Building2,
    title: 'Businesses',
    description:
      'Companies and family offices navigating critical capital decisions — from treasury strategy to long-term investment positioning.',
  },
];

export default function ClientsSection() {
  return (
    <section id="clients" className="py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Who We Serve
          </span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
            Built for the <span className="text-primary italic">Deliberate</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group text-center"
            >
              <div className="w-16 h-16 rounded-full border border-border bg-card/50 flex items-center justify-center mx-auto mb-6 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500">
                <client.icon
                  size={24}
                  className="text-primary/70 group-hover:text-primary transition-colors duration-500"
                />
              </div>

              <h3 className="font-display text-xl font-medium text-foreground mb-3 tracking-tight">
                {client.title}
              </h3>

              <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {client.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}