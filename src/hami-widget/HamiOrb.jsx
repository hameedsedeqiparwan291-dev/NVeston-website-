// =============================================================================
// HAMI Widget — Intelligence Orb (visual identity)
// =============================================================================
//
// An illuminated gold core with two orbital paths and satellite nodes, on navy.
// Static by default; `active` adds a gentle orbit-and-pulse while HAMI is
// processing. Motion is disabled under prefers-reduced-motion (see widget.css).

import React, { useId } from 'react';

export default function HamiOrb({ size = 32, active = false, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const core = `hami-orb-core-${uid}`;
  const glow = `hami-orb-glow-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`hami-orb${active ? ' hami-orb--active' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={core} cx="40%" cy="36%" r="70%">
          <stop offset="0" stopColor="#FFF6DC" />
          <stop offset="0.45" stopColor="#E6C46A" />
          <stop offset="1" stopColor="#9A6F22" />
        </radialGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#D4A843" stopOpacity="0.55" />
          <stop offset="1" stopColor="#D4A843" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="20" cy="20" r="19" fill={`url(#${glow})`} className="hami-orb-halo" />

      <g className="hami-orb-orbits">
        <ellipse cx="20" cy="20" rx="15.5" ry="6" transform="rotate(-28 20 20)" fill="none" stroke="#E6C46A" strokeOpacity="0.9" strokeWidth="1.1" />
        <ellipse cx="20" cy="20" rx="15.5" ry="6" transform="rotate(32 20 20)" fill="none" stroke="#F4E9CF" strokeOpacity="0.55" strokeWidth="0.9" />
        <circle cx="6.3" cy="27.3" r="1.7" fill="#F4E9CF" />
        <circle cx="33.1" cy="28.2" r="1.4" fill="#E6C46A" />
        <circle cx="29.4" cy="9.6" r="1.2" fill="#F4E9CF" fillOpacity="0.8" />
      </g>

      <g className="hami-orb-core">
        <circle cx="20" cy="20" r="7.4" fill={`url(#${core})`} />
        <circle cx="20" cy="20" r="7.4" fill="none" stroke="#FFF6DC" strokeOpacity="0.35" strokeWidth="0.6" />
        <ellipse cx="17.6" cy="17.4" rx="2.4" ry="1.5" fill="#FFFFFF" fillOpacity="0.55" />
      </g>
    </svg>
  );
}
