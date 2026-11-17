import React, { Suspense, lazy, useEffect, useState } from 'react';

// Renders children only after hydration. Used for browser-only features
// (HAMI, the contact form's time-zone detection) so server HTML stays deterministic.
export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : fallback;
}

const ContactSection = lazy(() => import('../landing/ContactSection.jsx'));

// The existing, approved consultation form. Server HTML contains an anchor
// placeholder so /#contact and /contact#contact links resolve before hydration.
export function ContactFormMount() {
  const placeholder = <section id="contact" className="min-h-[1100px] lg:min-h-[900px]" aria-label="Contact form loading" />;
  return (
    <ClientOnly fallback={placeholder}>
      <Suspense fallback={placeholder}>
        <ScrollToHash />
        <ContactSection />
      </Suspense>
    </ClientOnly>
  );
}

function ScrollToHash() {
  useEffect(() => {
    if (window.location.hash !== '#contact') return;
    const t = setTimeout(() => document.getElementById('contact')?.scrollIntoView({ block: 'start', behavior: 'instant' }), 60);
    return () => clearTimeout(t);
  }, []);
  return null;
}

const HamiMount = lazy(() => import('./HamiMount.jsx'));

// HAMI loads after the page is idle so it never competes with page content.
export function DeferredHami() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 1200);
    return () => clearTimeout(t);
  }, []);
  return ready ? (
    <Suspense fallback={null}>
      <HamiMount />
    </Suspense>
  ) : null;
}
