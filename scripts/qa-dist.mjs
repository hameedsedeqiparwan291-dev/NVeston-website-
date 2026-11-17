// Static QA for the pre-rendered build: metadata, headings, structured data,
// image alt text and internal links.  Usage: npm run qa   (after a build)
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => fs.stat(p).then(() => true, () => false);
async function resolves(href) {
  const clean = decodeURIComponent(href.split(/[?#]/)[0]);
  if (clean === '' || clean === '/') return exists(path.join(dist, 'index.html'));
  const target = path.join(dist, clean);
  return (await exists(path.join(target, 'index.html'))) || ((await exists(target)) && !(await fs.stat(target)).isDirectory());
}

const files = await walk(dist);
const problems = [];
const titles = new Map();
let pages = 0;
let links = 0;

for (const file of files) {
  const rel = '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\/$/, '');
  const html = await fs.readFile(file, 'utf8');
  const is404 = rel === '/404.html';
  const noindex = html.includes('name="robots" content="noindex');
  const flag = (m) => problems.push(`${rel || '/'}: ${m}`);
  pages += 1;

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) flag('missing <title>');
  else if (!noindex) {
    if (titles.has(title)) flag(`duplicate title with ${titles.get(title)}`);
    titles.set(title, rel || '/');
  }
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) flag('missing or short meta description');
  if (!noindex && !is404) {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const expected = `https://www.nveston.com${rel || '/'}`;
    if (canonical !== expected) flag(`canonical ${canonical} ≠ ${expected}`);
    if (!html.includes('property="og:image"')) flag('missing og:image');
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) flag(`${h1} <h1> elements`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { flag('invalid JSON-LD'); }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(m[0])) flag('img without alt');
  if (/>\s*(undefined|NaN|null)\s*</.test(html)) flag('renders undefined/NaN/null');

  const body = html.split('<body>')[1] || '';
  for (const m of body.matchAll(/href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    links += 1;
    if (!(await resolves(href))) flag(`broken link ${href}`);
    const hash = href.split('#')[1];
    if (hash && href.startsWith('/')) {
      const targetFile = path.join(dist, href.split(/[?#]/)[0], 'index.html');
      const target = (await exists(targetFile)) ? await fs.readFile(targetFile, 'utf8') : '';
      if (!target.includes(`id="${hash}"`)) flag(`anchor #${hash} missing on ${href.split('#')[0]}`);
    }
  }
}

console.log(`Checked ${pages} pages and ${links} internal links.`);
if (problems.length) {
  console.log(`${problems.length} problem(s):\n- ` + [...new Set(problems)].join('\n- '));
  process.exitCode = 1;
} else {
  console.log('No problems found.');
}
