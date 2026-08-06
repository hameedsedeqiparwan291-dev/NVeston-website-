// =============================================================================
// HAMI Widget — Chat State Hook (Phase 10: Production Resilience)
// =============================================================================
//
// Resilience features:
//   - Client-side retry with exponential backoff (300 / 700 / 1500 ms)
//   - Retries on: network errors, timeouts, HTTP 429, HTTP 500-599
//   - Fail-fast on: HTTP 400, 401, 403, 404 (won't recover with retries)
//   - Typing indicator stays active during all retry attempts
//   - HAMI-branded fallback responses — never generic errors
//   - Original user message preserved on failure with Retry button
//   - Error telemetry posted to /api/nveston/chat/error (non-blocking)
//   - Health monitor polls /api/nveston/health every 30s
//   - Automatic recovery once health returns — no page refresh required
//   - Zero "something went wrong" messages visible to visitors
//
// =============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Retry policy
// ---------------------------------------------------------------------------

const RETRY_DELAYS_MS = [300, 700, 1500];
const MAX_ATTEMPTS    = RETRY_DELAYS_MS.length + 1; // 4 total (1 initial + 3 retries)
const REQUEST_TIMEOUT = 30_000; // 30 s

// ---------------------------------------------------------------------------
// HAMI fallback responses — professional, calm, branded.
// Never mention APIs, Anthropic, servers, or technical details.
// ---------------------------------------------------------------------------

const FALLBACK_RESPONSES = {
  backend_offline:
    "I'm temporarily unavailable due to a service interruption. Please try again shortly — I look forward to continuing our conversation.",

  connection_error:
    "I'm experiencing a temporary connection issue while preparing a response. Please try your question again in a few moments. If your matter is time-sensitive, you're also welcome to request a consultation with the NVeston team.",

  rate_limit:
    "I'm currently experiencing unusually high demand. Please try again shortly, and I'll be happy to continue our conversation.",

  timeout:
    "This request is taking longer than expected. Please try again in a moment, and we'll continue where we left off.",

  server_error:
    "I'm experiencing a temporary service issue. Please try again shortly — I'll be ready to assist with your question.",

  invalid_json:
    "I encountered an issue processing your request. Please try again — this is usually resolved within moments.",

  client_network:
    "It looks like your internet connection may have been interrupted. Please check your connection and try again.",

  unknown:
    "I'm temporarily unable to respond. Please try again in a moment. If the issue persists, you're welcome to request a consultation directly with the NVeston team.",
};

// ---------------------------------------------------------------------------
// Health monitor configuration
// ---------------------------------------------------------------------------

const HEALTH_POLL_INTERVAL_MS = 30_000;
const HEALTH_CHECK_TIMEOUT    = 5_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch with a hard timeout. Rejects with isTimeout=true if exceeded.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      const e = new Error('Request timed out');
      e.isTimeout = true;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Classify a fetch error or HTTP status into a category string.
 */
function classifyClientError(err, httpStatus) {
  if (err?.isTimeout)                              return 'timeout';
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'client_network';
  if (httpStatus === 429)                          return 'rate_limit';
  if (httpStatus >= 500 && httpStatus <= 599)      return 'server_error';
  if (err?.message?.toLowerCase().includes('failed to fetch')) return 'backend_offline';
  if (err?.message?.toLowerCase().includes('networkerror'))    return 'client_network';
  if (err?.category)                               return err.category;
  return 'unknown';
}

/**
 * True when a retry might resolve the error.
 */
function isRetryable(err, httpStatus) {
  if (err?.isTimeout)     return true;
  if (httpStatus === 429) return true;
  if (httpStatus >= 500)  return true;
  if (!httpStatus)        return true; // network-level — always retryable
  return false;           // 400, 401, 403, 404 — fail fast
}

/**
 * Return the branded HAMI fallback message for a given category.
 */
function getFallbackMessage(category) {
  return FALLBACK_RESPONSES[category] ?? FALLBACK_RESPONSES.unknown;
}

/**
 * Post error telemetry. Fire-and-forget — never throws.
 */
async function reportError(baseUrl, payload) {
  try {
    await fetch(`${baseUrl}/chat/error`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch { /* swallow */ }
}

// ---------------------------------------------------------------------------
// Health monitor hook
// ---------------------------------------------------------------------------

function useHealthMonitor(healthUrl) {
  const [isHealthy, setIsHealthy] = useState(true);
  const intervalRef = useRef(null);

  const check = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(healthUrl, {}, HEALTH_CHECK_TIMEOUT);
      setIsHealthy(res.ok);
    } catch {
      setIsHealthy(false);
    }
  }, [healthUrl]);

  useEffect(() => {
    const init = setTimeout(check, 2000); // slight delay on mount
    intervalRef.current = setInterval(check, HEALTH_POLL_INTERVAL_MS);
    return () => { clearTimeout(init); clearInterval(intervalRef.current); };
  }, [check]);

  return isHealthy;
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

/**
 * Manages all widget chat state with full production resilience.
 *
 * @param {{ config: import('./widget.config.js').default }} opts
 */
export function useWidgetChat({ config }) {
  const [messages,         setMessages]         = useState([]);
  const [isTyping,         setIsTyping]         = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);

  const sessionIdRef = useRef(null);
  const historyRef   = useRef([]);

  const isHealthy = useHealthMonitor(`${config.api.baseUrl}/health`);

  // ---------------------------------------------------------------------------
  // Core fetch with retry loop
  // ---------------------------------------------------------------------------

  const sendWithRetry = useCallback(async (trimmed) => {
    let lastError  = null;
    let lastStatus = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetchWithTimeout(
          config.api.chatEndpoint,
          {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              message:   trimmed,
              sessionId: sessionIdRef.current,
              history:   historyRef.current,
            }),
          }
        );

        lastStatus = res.status;

        let data;
        try {
          data = await res.json();
        } catch {
          const e = new Error('Invalid JSON response');
          e.category = 'invalid_json';
          throw e;
        }

        if (!res.ok) {
          const e = new Error(data?.error ?? `HTTP ${res.status}`);
          e.httpStatus = res.status;
          throw e;
        }

        return { data, attempts: attempt + 1 };

      } catch (err) {
        lastError  = err;
        lastStatus = err?.httpStatus ?? lastStatus;

        const isLast = attempt === MAX_ATTEMPTS - 1;
        if (!isRetryable(err, lastStatus) || isLast) break;

        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }

    lastError.category   = lastError.category ?? classifyClientError(lastError, lastStatus);
    lastError.httpStatus = lastStatus;
    throw lastError;
  }, [config.api.chatEndpoint]);

  // ---------------------------------------------------------------------------
  // Public send
  // ---------------------------------------------------------------------------

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Backend confirmed offline — skip the request entirely
    if (!isHealthy) {
      setMessages(prev => [
        ...prev,
        { id: `u-${Date.now()}`,   role: 'user',     content: trimmed, timestamp: new Date() },
        { id: `f-${Date.now()+1}`, role: 'fallback', content: FALLBACK_RESPONSES.backend_offline,
          retryText: trimmed, timestamp: new Date() },
      ]);
      return;
    }

    setMessages(prev => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', content: trimmed, timestamp: new Date() },
    ]);
    setIsTyping(true);

    const startedAt = Date.now();

    try {
      const { data } = await sendWithRetry(trimmed);

      setMessages(prev => [
        ...prev,
        {
          id:        `a-${Date.now()}`,
          role:      'assistant',
          content:   data.response || '',
          citations: data.citations || [],
          timestamp: new Date(),
        },
      ]);

      if (data.sessionId)    sessionIdRef.current = data.sessionId;
      if (data.leadCaptured) setShowConsultation(true);

      historyRef.current = [
        ...historyRef.current,
        { role: 'user',      content: trimmed },
        { role: 'assistant', content: data.response || '' },
      ].slice(-20);

    } catch (err) {
      const category  = err?.category ?? classifyClientError(err, err?.httpStatus);
      const latencyMs = Date.now() - startedAt;

      // Show HAMI fallback — styled as an assistant message (navy), never red error box
      setMessages(prev => [
        ...prev,
        {
          id:        `f-${Date.now()}`,
          role:      'fallback',
          content:   getFallbackMessage(category),
          retryText: trimmed,
          timestamp: new Date(),
        },
      ]);

      // Non-blocking telemetry
      reportError(config.api.baseUrl, {
        sessionId:       sessionIdRef.current,
        visitorQuestion: trimmed.slice(0, 500),
        errorCategory:   category,
        httpStatus:      err?.httpStatus ?? null,
        retryAttempts:   MAX_ATTEMPTS - 1,
        latencyMs,
      });

    } finally {
      setIsTyping(false);
    }
  }, [sendWithRetry, isHealthy, config.api.baseUrl]);

  // ---------------------------------------------------------------------------
  // Retry — remove fallback message and resend the original question
  // ---------------------------------------------------------------------------

  const retry = useCallback((originalText) => {
    setMessages(prev =>
      prev.filter(m => !(m.role === 'fallback' && m.retryText === originalText))
    );
    send(originalText);
  }, [send]);

  // ---------------------------------------------------------------------------
  // Inject a predefined welcome message (not AI-generated)
  // Called by HAMIWidget on first-visit auto-open.
  // ---------------------------------------------------------------------------

  const injectWelcome = useCallback((text) => {
    setMessages([{
      id:        'hami-welcome',
      role:      'assistant',
      content:   text,
      timestamp: new Date(),
    }]);
  }, []);

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    setShowConsultation(false);
    sessionIdRef.current = null;
    historyRef.current   = [];
  }, []);

  return { messages, isTyping, showConsultation, isHealthy, send, retry, reset, injectWelcome };
}
