const fs = require('fs')
const { marked } = require('marked')
const matter = require('gray-matter')
const path = require('path')
const readingTime = require('reading-time')
const niceDateText = require('./niceDateText')

/**
 * Read post converting markdown to HTML + metadata
 */
function readPost(slug) {
  const markdownWithMetadata = fs
    .readFileSync(path.join('posts', slug + '.md'))
    .toString()

  marked.setOptions({
    highlight: function (code, language) {
      const hljs = require('highlight.js')
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
      return hljs.highlight(code, { language: validLanguage }).value
    },
  })

  const { data, content } = matter(markdownWithMetadata)

  return {
    data,
    date: niceDateText(new Date(data.created)),
    __html: marked(content),
    timeToRead: readingTime(content),
  }
}

module.exports = readPost
