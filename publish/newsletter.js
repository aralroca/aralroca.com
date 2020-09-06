const fetch = require('isomorphic-unfetch')

async function newsletter(post) {
  // @todo write correct email
  const url = 'https://aralroca.com/api/mailer'
  const { sent, response } = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': process.env.MANDRILL_API_KEY,
    },
    body: JSON.stringify({
      from: 'contact@aralroca.com',
      to: 'aral-rg@hotmail.com',
      subject: 'This is a test',
      html: `This email is <b>a test</b>!`,
    }),
  })
    .then((r) => r.json())
    .catch((e) => {
      console.log('newsletter -> KO', e)
      return {}
    })

  console.log('newsletter -> @todo', { sent, response })
}

module.exports = newsletter
