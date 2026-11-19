export const SITE_URL = 'https://www.nveston.com';

// Draft content (unreviewed articles) is only built when VITE_SHOW_DRAFTS=true
// (`npm run build:preview`) or in the local dev server. Production builds exclude it.
export const SHOW_DRAFTS = import.meta.env.VITE_SHOW_DRAFTS === 'true' || Boolean(import.meta.env.DEV);

export const ORG = {
  name: 'NVeston',
  legalName: 'NVeston LLC',
  descriptor: 'Financial intelligence and strategic advisory',
  email: 'contact@nveston.com',
  location: 'United States · Remote First',
  registration:
    'NVeston LLC is registered as a Massachusetts limited liability company. This is a corporate registration only; it is not registration as an investment adviser, broker-dealer, or other regulated financial services provider.',
  logo: '/brand/nveston-logo-192.png',
  shareImage: '/brand/nveston-share-630.jpg',
};

export const FOUNDER = {
  name: 'Hamidullah Nazari',
  title: 'Founder & Managing Member',
  linkedin: 'https://www.linkedin.com/in/hamidullah-nazari-2886a3296',
  image: '/images/hamidullah-nazari-nveston-founder.jpg',
  image480: '/images/hamidullah-nazari-nveston-founder-480.jpg',
  alt: 'Hamidullah Nazari, Founder and Managing Member of NVeston LLC',
};

export const absoluteUrl = (path) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
