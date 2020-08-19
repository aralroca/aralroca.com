const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const deployToDevTo = require('./dev-to')
const deployToEcho = require('./echojs')
const deployToFacebook = require('./facebook')
const deployToHackerNews = require('./hacker-news')
const deployToLinkedin = require('./linkedin')
const deployToTwitter = require('./twitter')
const newsletter = require('./newsletter')

function getNewPost() {
  const today = new Date()

  return fs.readdirSync('posts')
    .map((slug) => matter(
      fs.readFileSync(path.join('posts', slug))
    ))
    .find(p => {
      const created = new Date(p.data.created)

      return (
        !p.data.dev_to && // Is empty only when is unpublished
        created.getDate() === today.getDate() &&
        created.getMonth() === today.getMonth() &&
        created.getFullYear() === today.getFullYear()
      )
    })
}

async function deploy() {
  const post = getNewPost()

  if (!post) {
    console.log('No new post detected to publish.')
    process.exit()
  }

  const devToLink = await deployToDevTo(post)

  await Promise.all([
    deployToEcho(post, devToLink),
    deployToFacebook(post, devToLink),
    deployToHackerNews(post, devToLink),
    deployToLinkedin(post, devToLink),
    deployToTwitter(post),
    newsletter(post),
  ])
}

console.log('Start publishing')
deploy()
  .then(() => {
    console.log('Published!')
    process.exit()
  })
  .catch(e => {
    console.log('ERROR publishing:', e)
    process.exit()
  })
