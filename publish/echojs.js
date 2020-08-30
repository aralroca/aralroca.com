const fetch = require('isomorphic-unfetch')

async function deployToEcho({ title }, url) {
  return fetch('https://www.echojs.com/api/submit', {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://www.echojs.com/submit',
      Cookie: `auth=${process.env.ECHO_AUTH}`,
    },
    body: JSON.stringify({
      apisecret: process.env.ECHO_JS,
      text: '',
      url,
      title,
      news_id: -1,
    }),
  })
    .then((r) => r.json())
    .then((r) => console.log('echo.js -> OK', r))
    .catch((e) => console.log('echo.js -> KO', e))
}

module.exports = deployToEcho
