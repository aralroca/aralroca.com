const fetch = require('isomorphic-unfetch')

async function deployToEcho({ title }, url) {
  return fetch('https://www.echojs.com/api/submit', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      apisecret: process.env.ECHO_JS,
      text: '',
      url,
      title,
      news_id: -1,
    }),
  })
    .then(() => console.log('echo.js -> OK'))
    .catch((e) => console.log('echo.js -> KO', e))
}

module.exports = deployToEcho
