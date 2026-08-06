// =============================================================================
// HAMI Widget — Single Message
// Renders HAMI (assistant), user, and error messages with markdown support.
// =============================================================================

import React from 'react';
import CitationBadge from './CitationBadge.jsx';

// ─── Inline Markdown Renderer ────────────────────────────────────────────────
//
// Handles **bold**, *italic*, `code` without an external markdown library.
// Keeps the widget dependency-free and the bundle small.

function renderInline(text, keyPrefix) {
  // Split on bold / italic / code tokens
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g);
  return segments.map((seg, i) => {
    const k = `${keyPrefix}-${i}`;
    if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4)
      return <strong key={k}>{seg.slice(2, -2)}</strong>;
    if (seg.startsWith('*')  && seg.endsWith('*')  && seg.length > 2 && !seg.startsWith('**'))
      return <em key={k}>{seg.slice(1, -1)}</em>;
    if (seg.startsWith('`')  && seg.endsWith('`')  && seg.length > 2)
      return <code key={k}>{seg.slice(1, -1)}</code>;
    return seg;
  });
}

function MarkdownContent({ text }) {
  if (!text) return null;

  const lines  = text.split('\n');
  const blocks = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (/^#{3,4}\s/.test(line)) {
      blocks.push(
        <h4 key={key++} className="hami-prose" style={{ fontSize: 13, fontWeight: 600, color: 'var(--hami-navy)', margin: '10px 0 3px' }}>
          {renderInline(line.replace(/^#{3,4}\s/, ''), `h4-${key}`)}
        </h4>
      );
      i++; continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={key++} className="hami-prose" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--hami-navy)', margin: '10px 0 4px' }}>
          {renderInline(line.slice(3), `h3-${key}`)}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h2 key={key++} className="hami-prose" style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--hami-navy)', margin: '12px 0 5px', letterSpacing: '-0.01em' }}>
          {renderInline(line.slice(2), `h2-${key}`)}
        </h2>
      );
      i++; continue;
    }

    // Unordered list — collect consecutive list items
    if (/^[-*•]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(<li key={i}>{renderInline(lines[i].replace(/^[-*•]\s/, ''), `li-${i}`)}</li>);
        i++;
      }
      blocks.push(<ul key={key++} className="hami-prose ul">{items}</ul>);
      continue;
    }

    // Ordered list — collect consecutive list items
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i}>{renderInline(lines[i].replace(/^\d+\.\s/, ''), `li-${i}`)}</li>);
        i++;
      }
      blocks.push(<ol key={key++} className="hami-prose ol">{items}</ol>);
      continue;
    }

    // Blank line — ignored (paragraph spacing comes from CSS margins)
    if (!line.trim()) { i++; continue; }

    // Paragraph
    blocks.push(
      <p key={key++} className="hami-prose p">
        {renderInline(line, `p-${key}`)}
      </p>
    );
    i++;
  }

  return <div className="hami-prose">{blocks}</div>;
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

function Timestamp({ date }) {
  if (!(date instanceof Date)) return null;
  return (
    <time
      className="hami-msg-time"
      dateTime={date.toISOString()}
      aria-label={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    >
      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </time>
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────

function AssistantMessage({ message }) {
  const hasCitations = Array.isArray(message.citations) && message.citations.length > 0;
  return (
    <div className="hami-msg-row hami-msg-row--assistant" role="article" aria-label="HAMI response">
      <div className="hami-msg-label" aria-hidden="true">HAMI</div>
      <div className="hami-msg hami-msg--assistant">
        <MarkdownContent text={message.content} />
        {hasCitations && (
          <div className="hami-citations" aria-label="Sources">
            {message.citations.map((cit, idx) => (
              <CitationBadge key={cit.id || idx} citation={cit} index={idx} />
            ))}
          </div>
        )}
      </div>
      <Timestamp date={message.timestamp} />
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="hami-msg-row hami-msg-row--user" role="article" aria-label="Your message">
      <div className="hami-msg hami-msg--user">{message.content}</div>
      <Timestamp date={message.timestamp} />
    </div>
  );
}

// ─── Fallback message ─────────────────────────────────────────────────────────
//
// Displayed when all retries are exhausted. Styled identically to an
// assistant message so the experience remains calm and branded.
// Includes a Retry button that resends the original question.

function FallbackMessage({ message, onRetry }) {
  return (
    <div className="hami-msg-row hami-msg-row--assistant" role="article" aria-label="HAMI response">
      <div className="hami-msg-label" aria-hidden="true">HAMI</div>
      <div className="hami-msg hami-msg--assistant">
        <p className="hami-prose p">{message.content}</p>
        {message.retryText && onRetry && (
          <button
            className="hami-retry-btn"
            onClick={() => onRetry(message.retryText)}
            aria-label="Retry your question"
          >
            ↻ Try again
          </button>
        )}
      </div>
      <Timestamp date={message.timestamp} />
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Message({ message, onRetry }) {
  switch (message.role) {
    case 'assistant': return <AssistantMessage message={message} />;
    case 'user':      return <UserMessage      message={message} />;
    case 'fallback':  return <FallbackMessage  message={message} onRetry={onRetry} />;
    // Legacy error role — render as fallback (handles any old messages in state)
    case 'error':     return <FallbackMessage  message={message} onRetry={onRetry} />;
    default:          return null;
  }
}
