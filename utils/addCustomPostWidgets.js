export default async function addCustomPostWidgets(html) {
  let res = html.replace(/<img /g, '<img loading="lazy" ')
  const tweets = html.match(/{% twitter (.*) %}/g)

  if (!tweets) return res

  for (let tweet of tweets) {
    const id = tweet.substring(11, tweet.length - 3)
    const url = `https://twitter.com/a/status/${id}`
    const r = await fetch(
      `https://publish.twitter.com/oembed?url=${url}&omit_script=1&align=center&hide_thread=1`
    )
      .then((r) => r.json())
      .catch((e) => ({ html: '' }))

    res = res.replace(tweet, r.html)
  }

  if (tweets) {
    res +=
      '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
  }

  return res
}
