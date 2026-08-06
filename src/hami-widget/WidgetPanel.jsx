// =============================================================================
// HAMI Widget — Chat Panel
// Container for the full chat interface. Positioned above the launcher.
// =============================================================================

import React from 'react';
import WidgetHeader  from './WidgetHeader.jsx';
import Conversation  from './Conversation.jsx';
import ChatInput     from './ChatInput.jsx';
import Footer        from './Footer.jsx';

/**
 * @param {{
 *   chat:         ReturnType<import('./useWidgetChat.js').useWidgetChat>,
 *   onClose:      () => void,
 *   focusSignal?: number,
 *   config:       import('./widget.config.js').default
 * }} props
 */
export default function WidgetPanel({ chat, onClose, focusSignal = 0, config }) {
  const { messages, isTyping, showConsultation, isHealthy, send, retry, reset } = chat;
  const hasMessages = messages.length > 0;

  return (
    <div
      className="hami-panel"
      role="dialog"
      aria-modal="true"
      aria-label={`${config.assistant.name} — ${config.assistant.subtitle}`}
    >
      {/* Gold accent bar */}
      <div className="hami-panel-accent" aria-hidden="true" />

      {/* Header */}
      <WidgetHeader
        config={config}
        onClose={onClose}
        onReset={hasMessages ? reset : undefined}
      />

      {/* Messages + health banner */}
      <Conversation
        messages={messages}
        isTyping={isTyping}
        showConsultation={showConsultation}
        isHealthy={isHealthy}
        onSend={send}
        onRetry={retry}
        config={config}
      />

      {/* Input — disabled when backend is offline to prevent queuing requests */}
      <ChatInput
        onSend={send}
        disabled={isTyping || !isHealthy}
        focusSignal={focusSignal}
        config={config}
      />

      {/* Disclaimer */}
      <Footer config={config} />
    </div>
  );
}
