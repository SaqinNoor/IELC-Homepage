import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://ielc-homepage.vercel.app';
const outDir = resolve(__dirname, '../dist');
const today = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', priority: '1.0' },
  { path: '/ec.html', priority: '0.8' },
  { path: '/8th-ec.html', priority: '0.7' },
  { path: '/7th-ec.html', priority: '0.7' },
  { path: '/6th-ec.html', priority: '0.7' },
  { path: '/5th-ec.html', priority: '0.7' },
  { path: '/events.html', priority: '0.8' },
];

const urls = pages.map(p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml generated');
