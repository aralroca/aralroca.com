async function deployToDevTo(post) {
  const apiKey = process.env.DEV_TO
  console.log('@todo deployToDevTo', Boolean(apiKey))
}

module.exports = deployToDevTo