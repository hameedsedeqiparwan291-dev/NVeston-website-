// Lightweight index of the site's sections. Used by navigation, footer, routes and
// cross-links. Full page content lives in the section-specific content modules.

export const SERVICES = [
  {
    slug: 'personal-financial-services',
    name: 'Personal Financial Services',
    short: 'See where your money goes, what you can comfortably afford, and how today’s choices shape the years ahead.',
    icon: 'wallet',
    topic: 'cashflow',
  },
  {
    slug: 'financial-markets-portfolio-intelligence',
    name: 'Financial Markets & Portfolio Intelligence',
    short: 'Understand what is happening in financial markets, why it matters, and the principles behind diversification and risk.',
    icon: 'chart',
    topic: 'analysis',
  },
  {
    slug: 'macro-market-intelligence',
    name: 'Macro & Market Intelligence',
    short: 'Translate inflation, interest rates and economic shifts into what they could mean for your household or business.',
    icon: 'globe',
    topic: 'analysis',
  },
  {
    slug: 'risk-scenario-analysis',
    name: 'Risk & Scenario Analysis',
    short: 'See how changes in sales, costs or borrowing would affect you, and prepare your response before they happen.',
    icon: 'shield',
    topic: 'analysis',
  },
  {
    slug: 'entrepreneur-business-advisory',
    name: 'Entrepreneur & Business Advisory',
    short: 'Understand profit, cash flow, pricing and growth so you can run a stronger, more financially sustainable business.',
    icon: 'briefcase',
    topic: 'expansion',
  },
  {
    slug: 'premium-strategic-advisory',
    name: 'Premium Strategic Advisory',
    short: 'A deeper, tailored analytical engagement for complex, high-stakes decisions with long-term consequences.',
    icon: 'compass',
    topic: 'strategy',
  },
];

export const SEGMENTS = [
  {
    slug: 'individuals',
    name: 'Individuals & Households',
    navName: 'Individuals',
    short: 'Clarity about income, spending, debt and the decisions that shape your financial future.',
  },
  {
    slug: 'small-businesses',
    name: 'Small Businesses',
    navName: 'Small Businesses',
    short: 'Practical analysis of profit, cash flow and costs for owners who run the business every day.',
  },
  {
    slug: 'entrepreneurs',
    name: 'Entrepreneurs & Founders',
    navName: 'Entrepreneurs',
    short: 'Testing the numbers behind a new venture before committing savings, time and borrowed money.',
  },
  {
    slug: 'market-participants',
    name: 'Market Participants',
    navName: 'Market Participants',
    short: 'Context on markets, the economy and risk for people who want to understand the forces behind the headlines.',
  },
];

export const TOOLS = [
  {
    slug: 'business-profitability',
    name: 'Business Profitability Analyzer',
    short: 'See your profit and margin today, then test how changes in revenue and costs would change them.',
    icon: 'percent',
  },
  {
    slug: 'cash-flow',
    name: 'Cash Flow Simulator',
    short: 'Follow your cash month by month and see why a profitable business can still run short.',
    icon: 'waves',
  },
  {
    slug: 'break-even',
    name: 'Break-Even Analyzer',
    short: 'Find how much you need to sell to cover your costs and reach a profit target.',
    icon: 'target',
  },
  {
    slug: 'debt-financing',
    name: 'Debt & Financing Calculator',
    short: 'Estimate payments and total interest, and compare two borrowing options side by side.',
    icon: 'landmark',
  },
  {
    slug: 'financial-resilience',
    name: 'Financial Resilience Assessment',
    short: 'An educational check of your reserves, debt and flexibility, with plain-language observations.',
    icon: 'lifebuoy',
  },
];

export const INSIGHT_CATEGORIES = [
  { slug: 'business', name: 'Business Intelligence', short: 'Profit, cash, pricing and the mechanics of running a business.' },
  { slug: 'economy', name: 'Economic Intelligence', short: 'Interest rates, inflation and the economic forces behind everyday decisions.' },
  { slug: 'financial-markets', name: 'Financial Markets', short: 'How markets work, what moves them and how to read them calmly.' },
  { slug: 'risk-strategy', name: 'Risk & Strategy', short: 'Thinking clearly about uncertainty, scenarios and trade-offs.' },
];

export const serviceBySlug = (slug) => SERVICES.find((s) => s.slug === slug);
export const segmentBySlug = (slug) => SEGMENTS.find((s) => s.slug === slug);
export const toolBySlug = (slug) => TOOLS.find((s) => s.slug === slug);
export const categoryBySlug = (slug) => INSIGHT_CATEGORIES.find((s) => s.slug === slug);

// Consultation topics understood by the contact form (?topic=…).
export const CONTACT_TOPICS = {
  consultation: 'Request a 15-Minute Introductory Consultation',
  expansion: 'Business Expansion / New Project',
  cashflow: 'Cash Flow & Financial Planning',
  analysis: 'Financial Analysis & Scenario Planning',
  strategy: 'Strategic Advisory',
  general: 'General Inquiry',
};

export const contactHref = (topic = 'consultation') => `/contact?topic=${topic}#contact`;
