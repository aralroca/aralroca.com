const fetch = require('isomorphic-unfetch')

async function deployToTwitter(article) {
  const url = `https://aralroca.com/blog/${article.slug}`

  return fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'POST',
    headers: {
      Authorization: `OAuth
      oauth_consumer_key="${process.env.TWITTER_KEY}",
      oauth_nonce="${process.env.TWITTER_KEY_TOKEN}",
      oauth_signature="${process.env.TWITTER_ACCESS_KEY}",
      oauth_signature_method="HMAC-SHA1",
      oauth_timestamp="${Date.now()}",
      oauth_token="${process.env.TWITTER_ACCESS_TOKEN}",
      oauth_version="1.0"`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      status: getStatus(url, article),
      attachment_url: url,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r)
      console.log('twitter -> OK')
    })
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
