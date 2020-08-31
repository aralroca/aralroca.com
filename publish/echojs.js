const fetch = require('isomorphic-unfetch')

async function deployToEcho({ title }, url) {
  return fetch('https://www.echojs.com/api/submit', {
    method: 'post',
    credentials: 'include',
    headers: {
      Referer: 'https://www.echojs.com/submit',
      Cookie: `auth=${process.env.ECHO_AUTH}`,
    },
    body: new URLSearchParams({
      apisecret: process.env.ECHO_JS,
      text: '',
      url,
      title,
      news_id: -1,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      if (r.status === 'err') console.log('echo.js -> KO', r.error)
      else console.log('echo.js -> OK')
    })
    .catch((e) => console.log('echo.js -> KO', e))
}

module.exports = deployToEcho
