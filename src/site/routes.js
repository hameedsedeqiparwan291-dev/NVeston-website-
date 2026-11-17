import { SERVICES, SEGMENTS, TOOLS, INSIGHT_CATEGORIES } from '../content/catalog.js';
import { ARTICLES } from '../content/articles-index.js';
import { SHOW_DRAFTS } from './config.js';

// Each route is pre-rendered to static HTML at build time (scripts/prerender.mjs)
// and hydrated in the browser (src/entry-client.jsx).

const PAGES = {
  home: () => import('../pages/HomePage.jsx'),
  services: () => import('../pages/ServicesIndexPage.jsx'),
  service: () => import('../pages/ServicePage.jsx'),
  segments: () => import('../pages/SegmentsIndexPage.jsx'),
  segment: () => import('../pages/SegmentPage.jsx'),
  tools: () => import('../pages/ToolsIndexPage.jsx'),
  'tool-business-profitability': () => import('../pages/tools/ProfitabilityTool.jsx'),
  'tool-cash-flow': () => import('../pages/tools/CashFlowTool.jsx'),
  'tool-break-even': () => import('../pages/tools/BreakEvenTool.jsx'),
  'tool-debt-financing': () => import('../pages/tools/LoanTool.jsx'),
  'tool-financial-resilience': () => import('../pages/tools/ResilienceTool.jsx'),
  insights: () => import('../pages/InsightsPage.jsx'),
  article: () => import('../pages/ArticlePage.jsx'),
  about: () => import('../pages/AboutPage.jsx'),
  founder: () => import('../pages/FounderPage.jsx'),
  contact: () => import('../pages/ContactPage.jsx'),
  faq: () => import('../pages/FaqPage.jsx'),
  legal: () => import('../pages/LegalPage.jsx'),
  notfound: () => import('../pages/NotFoundPage.jsx'),
};

export const VISIBLE_ARTICLES = ARTICLES.filter((a) => a.status === 'published' || SHOW_DRAFTS);
export const INSIGHTS_ENABLED = VISIBLE_ARTICLES.length > 0;

const crumbs = (...items) => [{ name: 'Home', path: '/' }, ...items];
const SERVICES_CRUMB = { name: 'Services', path: '/services' };
const SEGMENTS_CRUMB = { name: 'Who We Serve', path: '/who-we-serve' };
const TOOLS_CRUMB = { name: 'Tools & Resources', path: '/tools' };
const INSIGHTS_CRUMB = { name: 'Intelligence & Insights', path: '/insights' };

const RAW_ROUTES = [
  {
    path: '/',
    page: 'home',
    title: 'NVeston | Financial Intelligence & Strategic Advisory',
    description:
      'NVeston helps individuals, business owners and entrepreneurs understand their finances, test their options and make better-informed decisions through disciplined, plain-language analysis.',
    section: 'home',
  },
  {
    path: '/services',
    page: 'services',
    title: 'Services | NVeston',
    description:
      'Six areas of financial analysis and strategic decision support, from personal finances and cash flow to market intelligence, risk scenarios and complex business decisions.',
    section: 'services',
    breadcrumbs: crumbs(SERVICES_CRUMB),
  },
  ...SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    page: 'service',
    params: { slug: s.slug },
    title: `${s.name} | NVeston`,
    description: s.short,
    section: 'services',
    breadcrumbs: crumbs(SERVICES_CRUMB, { name: s.name, path: `/services/${s.slug}` }),
  })),
  {
    path: '/who-we-serve',
    page: 'segments',
    title: 'Who We Serve | NVeston',
    description:
      'NVeston works with individuals, small businesses, entrepreneurs and market participants who want clearer financial understanding before they make important decisions.',
    section: 'segments',
    breadcrumbs: crumbs(SEGMENTS_CRUMB),
  },
  ...SEGMENTS.map((s) => ({
    path: `/who-we-serve/${s.slug}`,
    page: 'segment',
    params: { slug: s.slug },
    title: `${s.name} | Who We Serve | NVeston`,
    description: s.short,
    section: 'segments',
    breadcrumbs: crumbs(SEGMENTS_CRUMB, { name: s.name, path: `/who-we-serve/${s.slug}` }),
  })),
  {
    path: '/tools',
    page: 'tools',
    title: 'Tools & Resources | NVeston',
    description:
      'Free interactive calculators for profitability, cash flow, break-even, borrowing costs and financial resilience. Calculations run privately in your browser.',
    section: 'tools',
    breadcrumbs: crumbs(TOOLS_CRUMB),
  },
  ...TOOLS.map((t) => ({
    path: `/tools/${t.slug}`,
    page: `tool-${t.slug}`,
    params: { slug: t.slug },
    title: `${t.name} | NVeston Tools`,
    description: t.short,
    section: 'tools',
    breadcrumbs: crumbs(TOOLS_CRUMB, { name: t.name, path: `/tools/${t.slug}` }),
  })),
  ...(INSIGHTS_ENABLED
    ? [
        {
          path: '/insights',
          page: 'insights',
          params: {},
          title: 'NVeston Intelligence | Insights & Analysis',
          description:
            'Clear, practical analysis of business finance, the economy, financial markets and risk — written to help you understand what matters and why.',
          section: 'insights',
          breadcrumbs: crumbs(INSIGHTS_CRUMB),
        },
        ...INSIGHT_CATEGORIES.filter((c) => VISIBLE_ARTICLES.some((a) => a.category === c.slug)).map((c) => ({
          path: `/insights/${c.slug}`,
          page: 'insights',
          params: { category: c.slug },
          title: `${c.name} | NVeston Intelligence`,
          description: c.short,
          section: 'insights',
          breadcrumbs: crumbs(INSIGHTS_CRUMB, { name: c.name, path: `/insights/${c.slug}` }),
        })),
        ...VISIBLE_ARTICLES.map((a) => {
          const cat = INSIGHT_CATEGORIES.find((c) => c.slug === a.category);
          return {
            path: `/insights/${a.category}/${a.slug}`,
            page: 'article',
            params: { slug: a.slug },
            title: `${a.title} | NVeston Intelligence`,
            description: a.summary,
            section: 'insights',
            ogType: 'article',
            article: a,
            draft: a.status !== 'published',
            breadcrumbs: crumbs(INSIGHTS_CRUMB, { name: cat.name, path: `/insights/${cat.slug}` }, { name: a.title, path: `/insights/${a.category}/${a.slug}` }),
          };
        }),
      ]
    : []),
  {
    path: '/about',
    page: 'about',
    title: 'About NVeston | Financial Intelligence & Strategic Advisory',
    description:
      'Learn what NVeston is, how it works, the principles behind its analysis, and how the company intends to grow — stated plainly and without overstatement.',
    section: 'about',
    schemaType: 'AboutPage',
    breadcrumbs: crumbs({ name: 'About NVeston', path: '/about' }),
  },
  {
    path: '/founder',
    page: 'founder',
    // Head for this route is preserved verbatim from the approved production page (see head.js).
    title: 'Hamidullah Nazari | Founder & Managing Member | NVeston',
    description:
      'Meet Hamidullah Nazari, Founder and Managing Member of NVeston LLC. Explore his professional background, finance education, and leadership philosophy.',
    section: 'about',
    breadcrumbs: crumbs({ name: 'About NVeston', path: '/about' }, { name: 'Founder & Leadership', path: '/founder' }),
  },
  {
    path: '/contact',
    page: 'contact',
    title: 'Contact & Consultations | NVeston',
    description:
      'Request a 15-minute introductory consultation or send NVeston a general inquiry. Share your preferred time and we will follow up by email.',
    section: 'contact',
    schemaType: 'ContactPage',
    breadcrumbs: crumbs({ name: 'Contact', path: '/contact' }),
  },
  {
    path: '/faq',
    page: 'faq',
    title: 'Frequently Asked Questions | NVeston',
    description: 'Answers to common questions about NVeston, its services, consultations, tools and the boundaries of its work.',
    section: 'about',
    breadcrumbs: crumbs({ name: 'Frequently Asked Questions', path: '/faq' }),
  },
  {
    path: '/policies/privacy',
    page: 'legal',
    params: { doc: 'privacy' },
    title: 'Privacy Policy | NVeston',
    description: 'How NVeston collects, uses and protects the information you share through this website.',
    section: 'legal',
    breadcrumbs: crumbs({ name: 'Privacy Policy', path: '/policies/privacy' }),
  },
  {
    path: '/policies/terms',
    page: 'legal',
    params: { doc: 'terms' },
    title: 'Terms of Use | NVeston',
    description: 'The terms that govern your use of the NVeston website, tools and content.',
    section: 'legal',
    breadcrumbs: crumbs({ name: 'Terms of Use', path: '/policies/terms' }),
  },
  {
    path: '/policies/disclosures',
    page: 'legal',
    params: { doc: 'disclosures' },
    title: 'Important Disclosures | NVeston',
    description: 'What NVeston is and is not, the nature of its analysis, and the limitations of its website content and tools.',
    section: 'legal',
    breadcrumbs: crumbs({ name: 'Important Disclosures', path: '/policies/disclosures' }),
  },
];

export const NOT_FOUND = {
  path: '/404',
  page: 'notfound',
  title: 'Page not found | NVeston',
  description: 'The page you were looking for could not be found. Explore NVeston’s services, tools and insights instead.',
  noindex: true,
  load: PAGES.notfound,
};

export const routes = RAW_ROUTES.map((r) => ({ ...r, load: PAGES[r.page] }));

export const normalizePath = (p) => {
  const clean = (p || '/').split(/[?#]/)[0].replace(/\/index\.html$/, '/');
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/';
};

export const matchRoute = (path) => routes.find((r) => r.path === normalizePath(path)) || null;
