import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, BarChart2, Globe, Shield, Lightbulb, Star } from 'lucide-react';

const services = [
  {
    icon: Wallet,
    title: 'Personal Financial Services',
    description: 'Budgeting, cash flow planning, debt management, savings strategies, and financial goal roadmaps.',
  },
  {
    icon: BarChart2,
    title: 'Investment & Portfolio Advisory',
    description: 'Portfolio reviews, risk analysis, asset allocation guidance, and long-term capital positioning.',
  },
  {
    icon: Globe,
    title: 'Macro & Market Intelligence',
    description: 'Market outlooks, macroeconomic analysis, sector insights, and opportunity identification.',
  },
  {
    icon: Shield,
    title: 'Risk & Scenario Analysis',
    description: 'Volatility assessment, stress testing, scenario analysis, and defensive allocation frameworks.',
  },
  {
    icon: Lightbulb,
    title: 'Entrepreneur & Business Advisory',
    description: 'Startup planning, business growth strategy, capital allocation, and strategic decision support.',
  },
  {
    icon: Star,
    title: 'Premium Strategic Advisory',
    description: 'Advanced consultation programs, cross-asset analysis, and high-level strategic positioning.',
  },
];

export default function DetailedServicesSection() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
            Tailored <span className="text-primary italic">Advisory</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 rounded-sm border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-500">
                <service.icon size={18} className="text-primary" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r from-primary/50 to-transparent transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}