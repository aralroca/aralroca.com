const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_KEY_TOKEN,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN,
})

const post = (data) =>
  new Promise((res, rej) =>
    client.post('statuses/update', data, (error) => {
      if (error) rej(error)
      else res()
    })
  )

async function deployToTwitter(article) {
  const url = `https://aralroca.com/blog/${article.slug}`

  return post({
    status: getStatus(url, article),
    attachment_url: url,
  })
    .then(() => console.log('twitter -> OK'))
    .catch((e) => console.log('twitter -> KO', e))
}

function getStatus(url, { title, description, tags }) {
  const hashtags =
    tags
      .replace(/,/g, '')
      .split(' ')
      .reduce((s, c) => `${s}#${c} `, '')
      .trim() + ' #CodeNewbie #100DaysOfCode'

  switch (Math.floor(Math.random() * 6) + 1) {
    case 1:
      return `New post 🎉
    
"${description}"

👉 ${url}

${hashtags}`
    case 2:
      return `New article to my blog: "${title}" 🔥
    
${description}

${hashtags}`
    case 3:
      return `I just wrote a new post ☄️
    
→ ${url}

${description}

${hashtags}`
    case 4:
      return `"${title}" · New post 🚀

${description}

${hashtags}`
    case 5:
    default:
      return `${title} ${hashtags} ${url}`
  }
}

module.exports = deployToTwitter
