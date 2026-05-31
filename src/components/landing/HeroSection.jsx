import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="inline-block mb-8">
            <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/80 border border-primary/20 px-5 py-2 rounded-sm">
              Strategic Capital Advisory
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tight text-foreground mb-8">
            Position Capital{' '}
            <span className="text-primary italic">Intelligently</span>
            <br />
            in Changing Markets
          </h1>

          <p className="font-inter text-lg md:text-xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            Disciplined analysis. Structural insight. Adaptive decision frameworks designed for those who think beyond the cycle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-10 py-4 bg-primary text-primary-foreground font-inter font-medium text-sm tracking-wide rounded-sm hover:bg-primary/90 transition-all duration-300"
            >
              Begin a Conversation
            </a>

            <a
              href="#approach"
              className="px-10 py-4 border border-border text-foreground font-inter font-light text-sm tracking-wide rounded-sm hover:border-primary/40 hover:text-primary transition-all duration-300"
            >
              Our Approach
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}