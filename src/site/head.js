import { ORG, FOUNDER, SITE_URL, absoluteUrl } from './config.js';

// Builds the <head> markup for a pre-rendered route.

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON-LD is embedded in a <script>; escape "<" so content can never close the tag.
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

export const ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: ORG.legalName,
  alternateName: ORG.name,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}${ORG.logo}`,
  email: ORG.email,
  description:
    'NVeston LLC is a Massachusetts-based financial intelligence and strategic advisory firm providing analytical decision support to individuals, businesses and entrepreneurs.',
  founder: { '@id': `${SITE_URL}/founder#person` },
};

const breadcrumbNode = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
});

function structuredData(route) {
  const url = absoluteUrl(route.path);
  const graph = [ORGANIZATION_NODE];

  if (route.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: ORG.name,
      publisher: { '@id': ORGANIZATION_NODE['@id'] },
      inLanguage: 'en-US',
    });
  }

  if (route.page === 'article' && route.article) {
    const a = route.article;
    graph.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: a.title,
      description: a.summary,
      url,
      mainEntityOfPage: url,
      author: { '@id': ORGANIZATION_NODE['@id'] },
      publisher: { '@id': ORGANIZATION_NODE['@id'] },
      ...(a.publishedDate ? { datePublished: a.publishedDate } : {}),
      inLanguage: 'en-US',
    });
  } else {
    graph.push({
      '@type': route.schemaType || (route.page === 'insights' || route.path === '/services' || route.path === '/tools' || route.path === '/who-we-serve' ? 'CollectionPage' : 'WebPage'),
      '@id': `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': ORGANIZATION_NODE['@id'] },
      inLanguage: 'en-US',
    });
  }

  if (route.breadcrumbs) graph.push(breadcrumbNode(route.breadcrumbs));
  return jsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

// The approved, production-indexed founder page head — preserved field for field.
function founderHead(route) {
  const desc =
    'Meet Hamidullah Nazari, Founder and Managing Member of NVeston LLC. Explore his professional background, finance education, and leadership philosophy.';
  const img = `${SITE_URL}${FOUNDER.image}`;
  const profile = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://www.nveston.com/founder#profilepage',
    url: 'https://www.nveston.com/founder',
    name: 'Hamidullah Nazari | Founder & Managing Member | NVeston',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://www.nveston.com/founder#person',
      name: 'Hamidullah Nazari',
      jobTitle: 'Founder & Managing Member',
      url: 'https://www.nveston.com/founder',
      image: {
        '@type': 'ImageObject',
        url: img,
        width: 877,
        height: 1026,
        caption: FOUNDER.alt,
      },
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://www.nveston.com/#organization',
        name: 'NVeston LLC',
        url: 'https://www.nveston.com/',
        logo: 'https://www.nveston.com/NVeston%20Logo.png',
      },
      sameAs: [FOUNDER.linkedin],
    },
  };
  return [
    `<title>Hamidullah Nazari | Founder &amp; Managing Member | NVeston</title>`,
    `<link rel="canonical" href="https://www.nveston.com/founder" />`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="author" content="NVeston" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="NVeston" />`,
    `<meta property="og:title" content="Hamidullah Nazari | Founder &amp; Managing Member | NVeston" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="https://www.nveston.com/founder" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="877" />`,
    `<meta property="og:image:height" content="1026" />`,
    `<meta property="og:image:alt" content="${esc(FOUNDER.alt)}" />`,
    `<meta property="profile:first_name" content="Hamidullah" />`,
    `<meta property="profile:last_name" content="Nazari" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="Hamidullah Nazari | Founder &amp; Managing Member | NVeston" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${esc(FOUNDER.alt)}" />`,
    `<link rel="preload" as="image" href="${FOUNDER.image}" imagesrcset="${FOUNDER.image480} 480w, ${FOUNDER.image} 877w" imagesizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 80vw" />`,
    jsonLd(profile),
    jsonLd({ '@context': 'https://schema.org', ...breadcrumbNode(route.breadcrumbs) }),
  ].join('\n    ');
}

export function buildHead(route) {
  if (route.page === 'founder') return founderHead(route);

  const url = absoluteUrl(route.path);
  const image = `${SITE_URL}${route.image || ORG.shareImage}`;
  const noindex = route.noindex || route.draft;
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
  ];
  if (noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    tags.push(`<link rel="canonical" href="${url}" />`);
  }
  tags.push(
    `<meta property="og:type" content="${route.ogType || 'website'}" />`,
    `<meta property="og:site_name" content="NVeston" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    ...(noindex ? [] : [`<meta property="og:url" content="${url}" />`]),
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="NVeston" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  );
  if (!noindex) tags.push(structuredData(route));
  return tags.join('\n    ');
}
