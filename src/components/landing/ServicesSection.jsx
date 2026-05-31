import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Layers, RefreshCw } from 'lucide-react';

const services = [
  {
    icon: TrendingUp,
    title: 'Disciplined Analysis',
    description: 'Rigorous evaluation of market conditions, asset dynamics, and macroeconomic signals—cutting through noise to focus on what truly drives capital outcomes.',
  },
  {
    icon: Layers,
    title: 'Structural Insight',
    description: 'Understanding how capital flows, policy shifts, and global trends shape opportunity—revealing connections that traditional analysis often misses.',
  },
  {
    icon: RefreshCw,
    title: 'Adaptive Frameworks',
    description: 'Decision frameworks that adjust as conditions change—helping capital remain resilient across cycles, volatility, and structural shifts.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
            What We Do
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
            Three Pillars of <span className="text-primary italic">Capital Clarity</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="p-8 lg:p-10 rounded-sm border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all duration-500">
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                  <service.icon size={22} className="text-primary" />
                </div>

                <h3 className="font-display text-xl font-medium text-foreground mb-4 tracking-tight">
                  {service.title}
                </h3>

                <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-primary/50 to-transparent transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}