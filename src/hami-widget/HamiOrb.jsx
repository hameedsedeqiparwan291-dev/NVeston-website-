// =============================================================================
// HAMI Widget — visual identity (approved symbol)
// =============================================================================
//
// Four-point gold star with a hidden H, an asymmetric orbital ring that passes
// behind the star, and a small orbital sphere. Same artwork as
// public/brand/hami-symbol.svg. Static: no glow or animation. Shown on the
// navy avatar backgrounds defined in widget.css.

import React, { useId } from 'react';

const STAR =
  'M771 145 C763 300 742 400 692 429 C650 451 535 457 432 460 C535 463 650 469 692 491 C742 520 763 640 771 790 ' +
  'C779 640 800 520 850 491 C892 469 1007 463 1110 460 C1007 457 892 451 850 429 C800 400 779 300 771 145 Z ' +
  'M771 262 C769 345 752 415 718 446 L824 446 C790 415 773 345 771 262 Z ' +
  'M718 476 L824 476 C793 510 774 580 771 655 C768 580 749 510 718 476 Z';

const RING =
  'M402 468 a381 110 0 1 0 762 0 a381 110 0 1 0 -762 0 Z M431 468 a352 100 0 1 0 704 0 a352 100 0 1 0 -704 0 Z';

// Optical sizing: at small sizes (button, header, message labels) the ring and
// sphere are drawn slightly heavier so they stay visible; same geometry.
const RING_SMALL =
  'M402 468 a381 110 0 1 0 762 0 a381 110 0 1 0 -762 0 Z M443 468 a340 92 0 1 0 680 0 a340 92 0 1 0 -680 0 Z';

export default function HamiOrb({ size = 32, active = false, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const gold = `hami-mark-gold-${uid}`;
  const mask = `hami-mark-mask-${uid}`;
  const small = size <= 40;
  return (
    <svg
      width={size}
      height={size}
      viewBox="415 100 740 740"
      className={`hami-orb${active ? ' hami-orb--active' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gold} x1="470" y1="150" x2="1100" y2="780" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7D47E" />
          <stop offset="0.5" stopColor="#E2AE45" />
          <stop offset="1" stopColor="#C38A2B" />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="-400" width="1600" height="1600">
          <rect x="0" y="-400" width="1600" height="1600" fill="#fff" />
          <path d="M783 468 L1017 -297 L324 -187 L-14 534 Z" fill="#000" />
          <path d="M783 468 L735 605 L657 1225 L1150 1100 L830 570 Z" fill="#000" />
          <circle cx="988" cy="285" r={small ? 38 : 31} fill="#000" />
        </mask>
      </defs>
      <g fill={`url(#${gold})`}>
        <g mask={`url(#${mask})`}>
          <path fillRule="evenodd" transform="rotate(-22.8 783 468)" d={small ? RING_SMALL : RING} />
        </g>
        <path fillRule="evenodd" d={STAR} />
        <circle cx="988" cy="285" r={small ? 25 : 19} />
      </g>
    </svg>
  );
}
