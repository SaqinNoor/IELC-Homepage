import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://ielc-homepage.vercel.app';
const outDir = resolve(__dirname, '../dist');
const today = new Date().toISOString().split('T')[0];

const pages = [
  {
    path: '/', priority: '1.0',
    images: ['/IELC-logo.svg', '/moderator%20image.webp', '/events-bg.webp']
  },
  {
    path: '/ec.html', priority: '0.8',
    images: ['/ec-bg.webp']
  },
  {
    path: '/8th-ec.html', priority: '0.7',
    images: ['/ec-bg.webp']
  },
  {
    path: '/7th-ec.html', priority: '0.7',
    images: ['/ec-bg.webp']
  },
  {
    path: '/6th-ec.html', priority: '0.7',
    images: ['/ec-bg.webp']
  },
  {
    path: '/5th-ec.html', priority: '0.7',
    images: ['/ec-bg.webp']
  },
  {
    path: '/events.html', priority: '0.8',
    images: [
      '/events-bg.webp',
      '/NELC/6nelc.webp', '/NELC/5nelc.webp', '/NELC/4nelc.webp',
      '/NELC/3nelc.webp', '/NELC/2nelc.webp', '/NELC/1nelc.webp',
      '/Eloquence/3eloquence.webp', '/Eloquence/2eloquence.webp', '/Eloquence/1eloquence.webp'
    ]
  },
];

const urls = pages.map(p => {
  const loc = `    <loc>${SITE_URL}${p.path}</loc>`;
  const lastmod = `    <lastmod>${today}</lastmod>`;
  const changefreq = '    <changefreq>monthly</changefreq>';
  const priority = `    <priority>${p.priority}</priority>`;
  const images = (p.images || []).map(img =>
    `      <image:image>\n        <image:loc>${SITE_URL}${img}</image:loc>\n      </image:image>`
  ).join('\n');
  return `  <url>\n${loc}\n${lastmod}\n${changefreq}\n${priority}\n${images}\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml generated with images');
