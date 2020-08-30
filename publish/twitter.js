const fetch = require('isomorphic-unfetch')

async function deployToTwitter(article) {
  return fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TWITTER}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ status: getStatus(article) }),
  })
    .then((r) => r.json())
    .then(r => {
      console.log(r)
      console.log('twitter -> OK')
    })
    .catch(e => console.log('twitter -> KO', e))
}

function getStatus({ slug, title, description, tags }) {
  const hashtags = tags
    .replace(/,/g, '')
    .split(' ')
    .reduce((s, c) => `${s}#${c} `, '')
    .trim() + ' #CodeNewbie #100DaysOfCode'

  const url = `https://aralroca.com/${slug}`

  switch (Math.floor(Math.random() * 6) + 1) {
    case 1: return `New post 🎉
    
"${description}"

👉 ${url}

${hashtags}`
    case 2: return `New article to my blog: "${title}" 🔥
    
${description}

${url}
${hashtags}`
    case 3: return `I just wrote a new post ☄️
    
→ ${url}

${description}

${hashtags}`
    case 4: return `"${title}" · New post 🚀

${description}

${hashtags}
    
${url}`
    case 5:
    default:
      return `${title} ${hashtags} ${url}`
  }
}

module.exports = deployToTwitter
