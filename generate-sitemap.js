
import fs from 'fs';
import path from 'path';

const urls = ['/', '/login', '/signup'];
const domain = 'https://auxiliaire.netlify.app';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${domain}${url}</loc>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

fs.writeFileSync(path.join('public', 'sitemap.xml'), xml);
console.log('Sitemap generated.');