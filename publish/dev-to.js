const fetch = require('isomorphic-unfetch')
const path = require('path')
const fs = require('fs')

function createPost(article) {
  return fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEV_TO
    },
    body: JSON.stringify({ article })
  })
    .then(r => r.json())
    .then(res => {
      console.log('dev.to -> OK', res.slug, res)
      return res.slug
    })
    .catch(e => {
      console.log('dev.to -> KO', e)
    })
}

async function deployToDevTo(article) {
  const devToId = await createPost(article)

  if (!devToId) return

  const postPath = path.join('posts', article.slug)
  const post = fs.readFileSync(postPath).toString()
  let occurrences = 0

  fs.writeFileSync(postPath, post.replace(/---/g, m => {
    occurrences += 1;
    if (occurrences === 2) return `dev_to: ${devToId}\n${m}`
    return m
  }))

  return devToId
}

module.exports = deployToDevTo