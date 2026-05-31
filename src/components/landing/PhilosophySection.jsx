import React from 'react';
import { motion } from 'framer-motion';

const PHILOSOPHY_IMAGE =
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b3cbb81eeb7f1fe5fc635e/a4e3a89a8_generated_32c2f7c2.png';

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-32 px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Our Philosophy
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight mb-8">
              Capital Deserves <span className="text-primary italic">Direction</span>
            </h2>

            <div className="space-y-6">
              <p className="font-inter text-base font-light text-muted-foreground leading-relaxed">
                Markets reward clarity, not reaction. NVeston was built on the belief that intelligent capital positioning requires more than forecasts — it requires disciplined frameworks, structural insight, and the ability to adapt as conditions evolve.
              </p>
              <p className="font-inter text-base font-light text-muted-foreground leading-relaxed">
                Rather than reacting to short-term noise, we focus on the deeper forces shaping markets. Structural shifts in capital flows, macroeconomic conditions, and global trends often create opportunities that surface-level analysis overlooks.
              </p>
              <p className="font-inter text-base font-light text-muted-foreground leading-relaxed">
                Our role is to help investors and decision-makers navigate these complexities with clarity, discipline, and long-term perspective.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-px h-10 bg-primary/40 shrink-0 mt-1" />
                <div>
                  <div className="font-display text-base font-medium text-foreground mb-1">Disciplined Thinking</div>
                  <div className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                    Decisions grounded in structured analysis rather than market emotion.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-px h-10 bg-primary/40 shrink-0 mt-1" />
                <div>
                  <div className="font-display text-base font-medium text-foreground mb-1">Structural Perspective</div>
                  <div className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                    Understanding how macro forces, capital flows, and policy shifts reshape opportunity.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-px h-10 bg-primary/40 shrink-0 mt-1" />
                <div>
                  <div className="font-display text-base font-medium text-foreground mb-1">Adaptive Positioning</div>
                  <div className="font-inter text-sm font-light text-muted-foreground leading-relaxed">
                    Strategies designed to evolve with changing environments.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-sm overflow-hidden border border-border/50">
              <img
                src={PHILOSOPHY_IMAGE}
                alt="Strategic compass representing NVeston's guiding philosophy"
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-primary/20 rounded-sm hidden lg:block" />
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/10 rounded-sm hidden lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}