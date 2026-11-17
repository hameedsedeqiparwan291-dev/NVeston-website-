import React, { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { DeferredHami } from './ClientOnly.jsx';
import { DraftBanner } from './ui.jsx';

function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const fold = window.innerHeight * 0.92;
    const pending = [...document.querySelectorAll('[data-reveal]')].filter((el) => el.getBoundingClientRect().top > fold);
    pending.forEach((el) => el.classList.add('reveal-pending'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('reveal-in');
        e.target.classList.remove('reveal-pending');
        io.unobserve(e.target);
      }),
      { rootMargin: '0px 0px -6% 0px' },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Layout({ route, children }) {
  useScrollReveal();
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      {route?.draft && (
        <DraftBanner>Draft — this publication is awaiting founder review and is excluded from production builds.</DraftBanner>
      )}
      <Header route={route} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <DeferredHami />
    </>
  );
}
