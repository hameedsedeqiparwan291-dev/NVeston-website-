// =============================================================================
// HAMI Widget — Chat Input
// Auto-growing textarea. Enter = send. Shift+Enter = newline.
// =============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * @param {{
 *   onSend:       (text: string) => void,
 *   disabled?:    boolean,
 *   focusSignal?: number,
 *   config:       import('./widget.config.js').default
 * }} props
 */
export default function ChatInput({ onSend, disabled = false, focusSignal = 0, config }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content, capped at 3 lines
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [value]);

  // Focus the textarea whenever focusSignal increments.
  // Used by HAMIWidget to auto-focus after the welcome message appears.
  useEffect(() => {
    if (!focusSignal) return;
    textareaRef.current?.focus();
  }, [focusSignal]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="hami-input-area">
      <div className="hami-input-row">
        <textarea
          ref={textareaRef}
          className="hami-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about NVeston…"
          rows={1}
          disabled={disabled}
          aria-label="Type your message to HAMI"
          aria-multiline="true"
        />
        <button
          className="hami-send-btn"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          type="button"
        >
          <ArrowUp size={15} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
