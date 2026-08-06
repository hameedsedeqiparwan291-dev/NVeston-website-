// =============================================================================
// HAMI Widget — Suggested Questions
// Shown in the welcome state before the first message is sent.
// =============================================================================

import React from 'react';

/**
 * @param {{
 *   questions: string[],
 *   onSelect:  (q: string) => void
 * }} props
 */
export default function SuggestedQuestions({ questions, onSelect }) {
  return (
    <div className="hami-suggestions" role="list" aria-label="Suggested questions">
      {questions.map((q) => (
        <button
          key={q}
          className="hami-suggestion"
          role="listitem"
          onClick={() => onSelect(q)}
          aria-label={`Ask: ${q}`}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
