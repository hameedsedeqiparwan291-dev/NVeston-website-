// =============================================================================
// HAMI Widget — Typing Indicator
// =============================================================================

import React from 'react';
import HamiOrb from './HamiOrb.jsx';

export default function TypingIndicator() {
  return (
    <div
      className="hami-msg-row hami-msg-row--assistant"
      role="status"
      aria-label="HAMI is typing"
      aria-live="polite"
    >
      <div className="hami-msg-label" aria-hidden="true"><HamiOrb size={18} active />HAMI</div>
      <div className="hami-typing" aria-hidden="true">
        <span className="hami-dot" />
        <span className="hami-dot" />
        <span className="hami-dot" />
      </div>
    </div>
  );
}
