import fs from 'node:fs';
import path from 'node:path';
import clearPage from './clearPage';

const POSTS_PATH = path.join(process.cwd(), 'src', 'posts');
const PUBLIC_FILE = path.join(process.cwd(), 'src', 'public', 'sitemap.xml');

async function generateSitemap() {
  const posts = fs
    .readdirSync(POSTS_PATH)
    .map(clearPage)
    .filter((p) => !p.startsWith('draft-'));
  const pages = ['', '/thanks', '/blog'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map((post: string) => {
        return `
          <url>
            <loc>https://aralroca.com/blog/${post}</loc>
          </url>`;
      })
      .join('')}
      ${pages
        .map((page: string) => {
          return `
            <url>
              <loc>https://aralroca.com${page}</loc>
            </url>`;
        })
        .join('')}
    </urlset>`;

  fs.writeFileSync(PUBLIC_FILE, sitemap);
}

console.log('Generating sitemap...');
generateSitemap();
