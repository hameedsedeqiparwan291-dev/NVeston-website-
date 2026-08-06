// =============================================================================
// HAMI Widget — Floating Launcher Button
// =============================================================================

import React from 'react';
import { X } from 'lucide-react';

/**
 * @param {{
 *   isOpen:            boolean,
 *   onToggle:          () => void,
 *   reminderText?:     string | null,
 *   onReminderDismiss?: () => void,
 *   config:            import('./widget.config.js').default
 * }} props
 */
export default function WidgetLauncher({
  isOpen,
  onToggle,
  reminderText      = null,
  onReminderDismiss = null,
  config,
}) {
  return (
    <div className="hami-launcher-wrap">
      {/* Reminder tooltip — shown once per session after inactivity */}
      {reminderText && !isOpen && (
        <div
          className="hami-reminder"
          role="status"
          aria-live="polite"
          onClick={onReminderDismiss ?? undefined}
        >
          {reminderText}
        </div>
      )}

      <button
        className="hami-launcher"
        onClick={onToggle}
        aria-label={isOpen
          ? 'Close HAMI'
          : `${config.assistant.launcherLabel} — NVeston AI Assistant`
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <>
            <span className="hami-launcher-avatar" aria-hidden="true">
              <X size={15} strokeWidth={2.5} />
            </span>
            <span className="hami-launcher-label">Close</span>
          </>
        ) : (
          <>
            <span className="hami-launcher-avatar" aria-hidden="true">H</span>
            <span className="hami-launcher-label">{config.assistant.launcherLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}
