// =============================================================================
// HAMI Widget — Citation Badge
// =============================================================================

import React from 'react';
import { FileText } from 'lucide-react';

/**
 * @param {{ citation: { id: string, title: string, source?: string }, index: number }} props
 */
export default function CitationBadge({ citation, index }) {
  return (
    <span
      className="hami-citation"
      title={citation.source || citation.title}
      aria-label={`Source ${index + 1}: ${citation.title}`}
    >
      <span className="hami-citation-num">{index + 1}</span>
      <FileText size={10} strokeWidth={2} aria-hidden="true" />
      <span>{citation.title}</span>
    </span>
  );
}
