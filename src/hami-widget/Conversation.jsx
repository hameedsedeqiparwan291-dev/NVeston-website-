// =============================================================================
// HAMI Widget — Conversation
// Scrollable message list with welcome state, messages, typing indicator,
// and consultation card.
// =============================================================================

import React, { useEffect, useRef } from 'react';
import Message           from './Message.jsx';
import SuggestedQuestions from './SuggestedQuestions.jsx';
import TypingIndicator   from './TypingIndicator.jsx';
import ConsultationCard  from './ConsultationCard.jsx';

// ─── NVeston "N" Mark ────────────────────────────────────────────────────────

function NMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M5 22V4L14 17.5V4h2.5v18L8 8.5V22H5Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

// ─── Welcome State ────────────────────────────────────────────────────────────

function WelcomeState({ config, onSelect }) {
  return (
    <div className="hami-welcome">
      <div className="hami-welcome-logo" aria-hidden="true">
        <NMark />
      </div>
      <h2 className="hami-welcome-title">{config.assistant.welcomeTitle}</h2>
      <p className="hami-welcome-body">{config.assistant.welcomeBody}</p>
      <SuggestedQuestions
        questions={config.suggestedQuestions}
        onSelect={onSelect}
      />
    </div>
  );
}

// ─── Main Conversation ────────────────────────────────────────────────────────

// ─── Health Banner ────────────────────────────────────────────────────────────

function HealthBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background:   '#FEF3C7',
        borderBottom: '1px solid #FDE68A',
        padding:      '8px 16px',
        fontSize:     12,
        color:        '#92400E',
        textAlign:    'center',
        flexShrink:   0,
      }}
    >
      HAMI is temporarily unavailable. Your questions will be answered once service resumes.
    </div>
  );
}

/**
 * @param {{
 *   messages:         Array,
 *   isTyping:         boolean,
 *   showConsultation: boolean,
 *   isHealthy:        boolean,
 *   onSend:           (text: string) => void,
 *   onRetry:          (text: string) => void,
 *   config:           import('./widget.config.js').default
 * }} props
 */
export default function Conversation({
  messages,
  isTyping,
  showConsultation,
  isHealthy,
  onSend,
  onRetry,
  config,
}) {
  const scrollRef = useRef(null);
  const isEmpty   = messages.length === 0;

  // Scroll to bottom on new messages / typing changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top:      el.scrollHeight,
      behavior: isEmpty ? 'auto' : 'smooth',
    });
  }, [messages.length, isTyping, isEmpty]);

  return (
    <>
      {/* Health banner — only shown when backend is confirmed unavailable */}
      {!isHealthy && <HealthBanner />}

      <div
        ref={scrollRef}
        className="hami-body"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation with HAMI"
      >
        {isEmpty ? (
          <WelcomeState config={config} onSelect={onSend} />
        ) : (
          <>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} onRetry={onRetry} />
            ))}
            {showConsultation && <ConsultationCard config={config} />}
            {isTyping && <TypingIndicator />}
          </>
        )}
      </div>
    </>
  );
}
