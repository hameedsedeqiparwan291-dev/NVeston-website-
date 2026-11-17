// Renders every route to static HTML after `vite build` and `vite build --ssr`.
// Output: dist/<route>/index.html, dist/404.html, dist/sitemap.xml, dist/robots.txt
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');
const SITE_URL = 'https://www.nveston.com';

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> / <!--app-html--> placeholders.');
}

const { render, routes, NOT_FOUND } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const fill = ({ head, html }) => template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);

let count = 0;
for (const route of routes) {
  const out = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path, 'index.html');
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, fill(await render(route.path)));
  count += 1;
}
await fs.writeFile(path.join(dist, '404.html'), fill(await render(NOT_FOUND.path)));

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => !r.noindex && !r.draft)
  .map((r) => `  <url>\n    <loc>${r.path === '/' ? `${SITE_URL}/` : SITE_URL + r.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`Pre-rendered ${count} routes + 404 page; sitemap lists ${urls.length} URLs.`);
