function clearPage(page) {
  return page
    .replace('pages', '')
    .replace('.js', '')
    .replace('.md', '')
    .replace('/index', '')
}

module.exports = clearPage
