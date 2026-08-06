// =============================================================================
// HAMI Widget — Footer Disclaimer
// =============================================================================

import React from 'react';

/**
 * @param {{ config: import('./widget.config.js').default }} props
 */
export default function Footer({ config }) {
  const { footer } = config;

  return (
    <div className="hami-footer" role="contentinfo">
      {footer.disclaimer}{' '}
      {footer.termsHref && (
        <a href={footer.termsHref} aria-label={`Read NVeston ${footer.termsLabel}`}>
          {footer.termsLabel}
        </a>
      )}
    </div>
  );
}
