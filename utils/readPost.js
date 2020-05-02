const fs = require('fs')
const marked = require('marked')
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
      return hljs.highlight(validLanguage, code).value
    },
  })

  const { data, content } = matter(markdownWithMetadata)
  const __html = marked(content).replace(/<img /g, '<img loading="lazy" ')

  return {
    data,
    date: niceDateText(new Date(data.created)),
    __html,
    timeToRead: readingTime(content),
  }
}

module.exports = readPost
