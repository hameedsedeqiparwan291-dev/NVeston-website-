// =============================================================================
// HAMI Widget — Consultation Card
// Surfaces when the backend signals lead capture (leadCaptured: true).
// =============================================================================

import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

/**
 * @param {{ config: import('./widget.config.js').default }} props
 */
export default function ConsultationCard({ config }) {
  const { consultation } = config;

  return (
    <div className="hami-consult" role="complementary" aria-label="Consultation offer">
      <div className="hami-consult-eyebrow">
        <Calendar size={10} strokeWidth={2.5} aria-hidden="true" />
        NVeston Advisory
      </div>
      <div className="hami-consult-title">{consultation.title}</div>
      <div className="hami-consult-body">{consultation.body}</div>
      <a
        href={consultation.buttonHref}
        className="hami-consult-btn"
        aria-label={`${consultation.buttonLabel} — opens NVeston contact page`}
      >
        {consultation.buttonLabel}
        <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  );
}
