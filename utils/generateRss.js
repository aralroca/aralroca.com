const fs = require('fs')
const clearPage = require('./clearPage')
const readPost = require('./readPost')

async function generateRss() {
  const posts = fs.readdirSync('posts').map(clearPage)
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <atom:link href="https://aralroca.com/rss.xml" rel="self" type="application/rss+xml" />
        <title>Aral Roca</title>
        <description>Aral Roca's personal web site. Open source does tend to be more stable software. It's the right way to do things.</description>
        <link>https://aralroca.com</link>
        <lastBuildDate>${new Date().toGMTString()}</lastBuildDate>
      ${posts
        .map((post) => {
          const { data, __html } = readPost(post)
          const content = __html
            // Absoulte path for images and links
            // https://validator.w3.org/feed/docs/warning/ContainsRelRef.html
            .replace(/(src|href)="\//g, '$&/aralroca.com/')
            // Not iframes
            // https://validator.w3.org/feed/docs/warning/SecurityRisk.html
            .replace(/<iframe.*<\/iframe>/g, '')

          return `
            <item>
              <title>${data.title}</title>
              <description>${data.description}</description>
              <link>https://aralroca.com/blog/${post}</link>
              <guid isPermaLink="false">https://aralroca.com/blog/${post}/</guid>
              <pubDate>${new Date(data.created).toGMTString()}</pubDate>
              <content:encoded><![CDATA[${content}]]></content:encoded>
            </item>`
        })
        .join('')}
      </channel>
    </rss>`

  fs.writeFileSync('public/rss.xml', rss)
}

module.exports = generateRss
