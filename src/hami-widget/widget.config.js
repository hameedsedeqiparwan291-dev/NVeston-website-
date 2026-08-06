// =============================================================================
// HAMI Widget — Configuration (NVeston Website integration copy)
// =============================================================================
//
// This file is identical to the HAMI V2 source except for the API section.
// API calls are routed to the Railway backend via VITE_HAMI_API_URL.
//
// Set in Vercel project settings:
//   VITE_HAMI_API_URL = https://your-app.railway.app
//
// Set locally in .env.local:
//   VITE_HAMI_API_URL = https://your-app.railway.app
//
// Do NOT commit .env.local to version control.
// =============================================================================

// Railway backend origin — set via environment variable.
// Falls back to empty string (relative URLs) if not set.
const RAILWAY_URL = import.meta.env.VITE_HAMI_API_URL ?? '';

const WIDGET_CONFIG = {

  // ── Company ────────────────────────────────────────────────────────────────
  company: {
    name:    'NVeston',
    tagline: 'Institutional intelligence, accessible to all.',
  },

  // ── Assistant ──────────────────────────────────────────────────────────────
  assistant: {
    name:           'HAMI',
    subtitle:       'NVeston AI Assistant',
    launcherLabel:  'Ask HAMI',
    statusLabel:    'Available',
    welcomeTitle:   "Hello, I'm HAMI",
    welcomeBody:    "NVeston's AI intelligence assistant. Ask me about our services, investment philosophy, or how NVeston can help you.",
  },

  // ── Theme ──────────────────────────────────────────────────────────────────
  theme: {
    primary:      '#0D1F35',
    primaryHover: '#162A47',
    accent:       '#C9A84C',
    accentLight:  '#DCC07A',
    accentPale:   '#F3E9C8',
    surface:      '#F4F6F9',
    border:       '#E0E5ED',
    borderStrong: '#CBD2DC',
    textPrimary:  '#0D1F35',
    textSecondary:'#3D4F63',
    muted:        '#738096',
    white:        '#FFFFFF',
    onlineGreen:  '#22C55E',
    errorRed:     '#EF4444',
  },

  // ── Panel Dimensions ───────────────────────────────────────────────────────
  panel: {
    width:  440,
    height: 660,
  },

  // ── API ────────────────────────────────────────────────────────────────────
  // Points to the Railway backend via VITE_HAMI_API_URL environment variable.
  // The backend uses cors() with no origin restriction, so direct calls work.
  api: {
    baseUrl:      `${RAILWAY_URL}/api/nveston`,
    chatEndpoint: `${RAILWAY_URL}/api/nveston/chat`,
  },

  // ── Suggested Questions ────────────────────────────────────────────────────
  suggestedQuestions: [
    'What services does NVeston offer?',
    'How does NVeston approach investment analysis?',
    'What is the NEX Triangle framework?',
    'How can NVeston help with my portfolio?',
    'Tell me about your investment philosophy',
    'How do I request a consultation?',
  ],

  // ── Lead Capture ───────────────────────────────────────────────────────────
  consultation: {
    title:       'Ready to go deeper?',
    body:        'A conversation with the NVeston team can explore your specific situation in more depth.',
    buttonLabel: 'Request a Consultation',
    buttonHref:  '/contact',
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    disclaimer: 'HAMI provides general information only. Not investment advice.',
    termsLabel: 'Terms',
    termsHref:  '/policies/terms',
  },
};

export default WIDGET_CONFIG;
