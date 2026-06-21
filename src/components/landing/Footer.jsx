import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/NVeston Logo.png"
            alt="NVeston"
            className="h-10 w-auto"
          />
          <span className="text-muted-foreground text-xs font-inter font-light">
            &mdash; Strategic Capital Advisory
          </span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#services" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
            Services
          </a>

          <a href="#approach" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
            Approach
          </a>

          <a href="#clients" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
            Who We Serve
          </a>

          <a href="#philosophy" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
            Philosophy
          </a>

          <a href="#contact" className="text-xs font-inter text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase">
            Contact
          </a>
        </div>

        <p className="text-xs font-inter text-muted-foreground/60">
          © NVeston. All rights reserved.
        </p>
      </div>
    </footer>
  );
}