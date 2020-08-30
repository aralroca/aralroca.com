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

  return fs
    .readdirSync('posts')
    .map((slug) => {
      const post = matter(fs.readFileSync(path.join('posts', slug)))
      return { ...post, slug }
    })
    .filter((p) => {
      const created = new Date(p.data.created)

      return (
        !p.data.dev_to && // Is empty only when is unpublished
        created.getDate() === today.getDate() &&
        created.getMonth() === today.getMonth() &&
        created.getFullYear() === today.getFullYear()
      )
    })
    .map(({ slug, data, content }) => {
      const id = slug.replace('.md', '')
      const img = data.cover_image || ''
      const canonical = `https://aralroca.com/blog/${id}`
      const body =
        `***Original article: ${canonical}***\n` +
        content
          .replace(/src="\//g, 'src="https://aralroca.com/')
          .replace(/href="\//g, 'href="https://aralroca.com/')
          .replace(/\[.*\]\(\/.*\)/g, (r) =>
            r.replace('(/', '(https://aralroca.com/')
          )

      return {
        body_markdown: body,
        canonical_url: canonical,
        created: data.created,
        description: data.description,
        main_image: img.startsWith('http') ? img : `https://aralroca.com${img}`,
        published: true,
        series: data.series,
        slug,
        tags: data.tags,
        title: data.title,
      }
    })[0]
}

async function deploy() {
  const post = getNewPost()

  // @todo remove (just for test)
  await deployToTwitter({
    slug: 'do-all-roads-lead-to-rome',
    title: 'Do all roads lead to Rome?',
    description:
      'Learn what Rome is, how it fits into the JavaScript ecosystem and my thoughts about it... Will Rome replace all the current tooling?',
    tags: 'webdev, javascript',
  })

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
  .catch((e) => {
    console.log('ERROR publishing:', e)
    process.exit()
  })
