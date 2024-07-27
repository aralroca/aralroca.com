const fs = require('node:fs')
const path = require('node:path')
const globby = require('globby')
const clearPage = require('./clearPage')

const POSTS_PATH = path.join(process.cwd(), 'src', 'posts')
const allowedPages = [
  'pages',
  '!pages/_*',
  '!pages/**/[*',
  '!pages/404.js',
]

async function generateSitemap() {
  const posts = fs.readdirSync(POSTS_PATH).map(clearPage)
  const pages = (await globby(allowedPages)).map(clearPage)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map((post: string) => {
        return `
          <url>
            <loc>https://aralroca.com/blog/${post}</loc>
          </url>`
      })
      .join('')}
      ${pages
      .map((page: string) => {
        return `
            <url>
              <loc>https://aralroca.com${page}</loc>
            </url>`
      })
      .join('')}
    </urlset>`

  fs.writeFileSync('public/sitemap.xml', sitemap)
}

module.exports = generateSitemap
