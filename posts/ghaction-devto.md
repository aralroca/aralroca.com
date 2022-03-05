---
title: GitHub action to publish your blog post to dev.to
created: 09/02/2020
description: Learn how to automatize publishing to dev.to from your GitHub repo.
tags: webdev, javascript
cover_image: /images/cover-images/18_cover_image.jpg
cover_image_mobile: /images/cover-images/18_cover_image_mobile.jpg
cover_color: '#09081A'
dev_to: github-action-to-publish-your-blog-post-to-dev-to-1jcc
---

I started writing when I joined [dev.to](https://dev.to/) in 2017, joining the community motivated me.

After a few articles I decided to create my own personal [blog](https://aralroca.com/blog). However, I've always wanted to continue contributing to dev.to. That's why I post articles on my personal blog and then share them on dev.to with the canonical. I suppose it's a standard practice and more than one of you are doing it.

In order to make my life a little easier, I've recently made a GitHub action that posts directly to dev.to when it detects a new article on my blog.

## How I detect a new post

To know if the article is new and needs to be published, you can use the markdown metadata to find out. In my case, I keep the **date of publication** as metadata (in case I want to publish it another day even if it's merged to master).

Then, once it's posted to dev.to with the GitHub action I create another metadata so it gets tagged as published.

Why? Because the GitHub action will run:

- Whenever something is **pushed to master**.
- **Every day** at 17:00 UTC.

This way, marking the post as already published, we avoid publishing it twice if we push an article to master at 16:00.

<figure align="center">
  <img src="/images/blog-images/ghaction-devto.png" alt="GH action diagram to publish to dev.to" class="center transparent" />
  <figcaption><small>GH action diagram to publish to dev.to</small></figcaption>
</figure>

## GitHub action in action

```yml
name: Publishing post

on:
  push:
    branches: [master]
  schedule:
    - cron: '0 17 */1 * *'

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]

    steps:
      - uses: actions/checkout@v2

      - name: Publishing post
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - run: yarn install --pure-lockfile
      - run: yarn run publish:post
        env:
          DEV_TO: ${{ secrets.DEV_TO }} 
      - run: |
          git config user.name aralroca
          git config user.email aral-rg@hotmail.com
          git add -A
          git diff --quiet && git diff --staged --quiet || git commit -m "[bot] Published to dev.to"
          git push origin master
```

What does it do?

1. Programs the action on **push to master** and **every day at 17:00** UTC using a cron.
1. Installs dependencies with `yarn install --pure-lockfile`
1. Sets environment variable `DEV_TO` using [GitHub secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets). This is required for our script.
1. Runs our script to publish to dev.to
1. Commits and pushes to master only when there are changes.

## Script to publish to dev.to

In our `package.json` file we have to indicate that the script runs our node file:

```json
{
  "scripts": {
    "publish:post": "node ./publish/index.js"
  }
}
```

This is the content of our script that publishes articles to **dev.to**:

```js
async function deploy() {
  const post = getNewPost()

  if (!post) {
    console.log('No new post detected to publish.')
    process.exit()
  }

  await deployToDevTo(post)
}

console.log('Start publishing')
deploy()
  .then(() => {
    console.log('Published!')
    process.exit()
  })
  .catch((e) => {
    console.log('ERROR publishing:', e)
    process.exit(1)
  })
```

The `getNewPost` function returns the post already formatted in the way **dev.to** needs, `null` in case that there aren't new posts:

```js
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const deployToDevTo = require('./dev-to')

function getNewPost() {
  const today = new Date()

  return (
    fs
      .readdirSync('posts')
      .map((slug) => {
        const post = matter(fs.readFileSync(path.join('posts', slug)))
        return { ...post, slug }
      })
      .filter((p) => {
        const created = new Date(p.data.created)

        return (
          !p.data.published_devto &&
          created.getDate() === today.getDate() &&
          created.getMonth() === today.getMonth() &&
          created.getFullYear() === today.getFullYear()
        )
      })
      .map(({ slug, data, content }) => {
        const id = slug.replace('.md', '')
        const canonical = `https://aralroca.com/blog/${id}`
        const body = `***Original article: ${canonical}***\n${content}`

        return {
          body_markdown: body,
          canonical_url: canonical,
          created: data.created,
          description: data.description,
          main_image: data.cover_image,
          published: true,
          series: data.series,
          slug,
          tags: data.tags,
          title: data.title,
        }
      })[0] || null
  )
}
```

I use the `gray-matter` library to retrieve the markdown metadata and its content.

Here's the `deployToDevTo` function used in our script:

```js
const fetch = require('isomorphic-unfetch')
const path = require('path')
const fs = require('fs')

function createPost(article) {
  return fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': process.env.DEV_TO,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ article }),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log('dev.to -> OK', `https://dev.to/aralroca/${res.slug}`)
      return res.slug
    })
    .catch((e) => {
      console.log('dev.to -> KO', e)
    })
}

async function deployToDevTo(article) {
  const devToId = await createPost(article)

  if (!devToId) return

  const postPath = path.join('posts', article.slug)
  const post = fs.readFileSync(postPath).toString()
  let occurrences = 0

  // Write 'published_devto' metadata before the second occurrence of ---
  fs.writeFileSync(
    postPath,
    post.replace(/---/g, (m) => {
      occurrences += 1
      if (occurrences === 2) return `published_devto: true\n${m}`
      return m
    })
  )
}
```

We request to the [dev.to API](https://docs.dev.to/api/) to upload the article and then modify our markdown file to add the `published_devto: true` metadata. This way, our GitHub action will detect that there are changes to upload to master.

## Conclusions

In this short article we've seen how to create a GitHub action to post automatically our personal blog new articles to [dev.to](https://dev.to). I hope you find it useful.
