const fs = require('fs')
const globby = require('globby')
const clearPage = require('./clearPage')

const allowedPages = [
  'pages',
  '!pages/_*',
  '!pages/**/[*',
  '!pages/api',
  '!pages/404.js',
]

async function generateSitemap() {
  const posts = fs.readdirSync('posts').map(clearPage)
  const pages = (await globby(allowedPages)).map(clearPage)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${posts
      .map((post) => {
        return `
          <url>
            <loc>https://aralroca.com/blog/${post}</loc>
          </url>`
      })
      .join('')}
      ${pages
        .map((page) => {
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
