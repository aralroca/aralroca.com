const clear = t => t.trim().toLowerCase()

/**
 * @todo Simplify using regex?
 */
export default function filterSearch(search = '') {
  return ({ metadata } = {}) => {
    const { title: t = '', description: d = '', tags: ts = '' } = metadata
    const words = [...t.split(' '), ...d.split(' '), ...ts.split(',')].map(clear)
    const wordsToSearch = search.split(' ').map(clear)

    return wordsToSearch.every(word => words.some(w => w.includes(word)))
  }
}
