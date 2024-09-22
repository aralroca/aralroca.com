import type { Sitemap } from 'brisa';
import path from 'node:path';
import { fileSystemRouter } from 'brisa/server';

const origin = 'https://aralroca.com';

const pagesDir = path.join(import.meta.dirname, 'pages');
const postsDir = path.join(import.meta.dirname, 'posts');

const pages = fileSystemRouter({ dir: pagesDir });
const posts = fileSystemRouter({
  dir: postsDir,
  // Change the extension to .md
  fileExtensions: ['.md'],
});

const staticPages = pages.routes
  .filter(([pathname]) => pathname !== '/blog/[slug]' && pathname !== '/_404')
  .map(([pathname]) => ({ loc: origin + pathname }));

const dynamicPages = posts.routes.map(([pathname]) => ({
  loc: origin + '/blog' + pathname,
}));

export default [...staticPages, ...dynamicPages] satisfies Sitemap;
