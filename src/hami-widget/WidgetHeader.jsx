// =============================================================================
// HAMI Widget — Panel Header
// =============================================================================

import React from 'react';
import { RotateCcw, X } from 'lucide-react';

/**
 * @param {{
 *   config:    import('./widget.config.js').default,
 *   onClose:   () => void,
 *   onReset?:  () => void,
 * }} props
 */
export default function WidgetHeader({ config, onClose, onReset }) {
  return (
    <div className="hami-header">
      {/* Identity */}
      <div className="hami-header-identity">
        <div className="hami-header-avatar" aria-hidden="true">H</div>
        <div className="hami-header-text">
          <span className="hami-header-name">{config.assistant.name}</span>
          <span className="hami-header-subtitle">
            <span className="hami-online-dot" aria-hidden="true" />
            {config.assistant.subtitle}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="hami-header-actions" role="group" aria-label="Panel controls">
        {onReset && (
          <button
            className="hami-header-btn"
            onClick={onReset}
            title="New conversation"
            aria-label="Start a new conversation"
          >
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        )}
        <button
          className="hami-header-btn"
          onClick={onClose}
          title="Close"
          aria-label="Close HAMI"
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
