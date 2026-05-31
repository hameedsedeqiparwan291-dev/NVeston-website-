import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = `New Inquiry from ${form.name}`;
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0AProfile: ${form.type}%0D%0A%0D%0AMessage:%0D%0A${form.message}`;

    window.location.href = `mailto:contact@nveston.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <section id="contact" className="py-32 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <span className="text-xs font-inter font-medium tracking-[0.3em] uppercase text-primary/70 mb-4 block">
              Get in Touch
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-6">
              Begin a <span className="text-primary italic">Conversation</span>
            </h2>

            <p className="font-inter text-sm font-light text-muted-foreground leading-relaxed mb-10">
              Every engagement begins with understanding. Whether you are an individual, investor, entrepreneur, or organization, NVeston provides disciplined analysis, strategic insight, and tailored advisory support designed around your objectives.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
                    Email
                  </p>
                  <p className="font-inter text-sm text-foreground">
                    contact@nveston.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <p className="font-inter text-sm text-foreground">
                    United States — Remote First
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="w-full bg-card/50 border border-border focus:border-primary/40 rounded-sm h-12 font-inter text-sm px-4 outline-none"
                  />
                </div>

                <div>
                  <label className="font-inter text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-card/50 border border-border focus:border-primary/40 rounded-sm h-12 font-inter text-sm px-4 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-inter text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                  I am a...
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-card/50 border border-border focus:border-primary/40 rounded-sm h-12 font-inter text-sm px-4 outline-none text-foreground"
                >
                  <option value="">Select your profile</option>
                  <option value="Individual Investor">Individual Investor</option>
                  <option value="Institutional Investor">Institutional Investor</option>
                  <option value="Business / Family Office">Business / Family Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-inter text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Briefly describe your objectives and how we may assist."
                  rows={5}
                  className="w-full bg-card/50 border border-border focus:border-primary/40 rounded-sm font-inter text-sm px-4 py-3 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-inter font-medium text-sm tracking-wide rounded-sm hover:bg-primary/90 transition-all duration-300 inline-flex items-center justify-center"
              >
                Send Inquiry
                <ArrowRight size={16} className="ml-2" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}