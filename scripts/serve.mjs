// Minimal static server for reviewing the production build locally.
// Mirrors Vercel's static behaviour: /path and /path/ serve /path/index.html,
// unknown paths serve 404.html with a 404 status.  Usage: npm run serve [-- port]
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2]) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const target = path.normalize(path.join(dist, decoded));
  if (!target.startsWith(dist)) return null;
  for (const candidate of [target, path.join(target, 'index.html')]) {
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch { /* try next */ }
  }
  return null;
}

http
  .createServer(async (req, res) => {
    const file = await resolveFile(req.url);
    const status = file ? 200 : 404;
    const body = await fs.readFile(file || path.join(dist, '404.html'));
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(file || '.html')] || 'application/octet-stream' });
    res.end(body);
  })
  .listen(port, () => console.log(`NVeston preview: http://localhost:${port}`));
