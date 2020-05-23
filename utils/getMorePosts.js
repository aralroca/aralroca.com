import getAllPosts from './getAllPosts'

export default function getMorePosts({ data }, slug) {
  const tags = data.tags.split(',').map((l) => l.trim())
  const posts = getAllPosts()
  .filter(p => p.slug !== slug)
  .map((post) => ({
    relatedTags: tags.reduce(
      (num, tag) => (post.metadata.tags.includes(tag) ? num + 1 : num),
      0
    ),
    ...post,
  }))
  .sort((a, b) => {
     // More related tags
     if (a.relatedTags < b.relatedTags) return 1
     if (a.relatedTags > b.relatedTags) return -1

     const dateA = new Date(a.metadata.created)
     const dateB = new Date(b.metadata.created)

     // Date
     if (dateA < dateB) return 1
     if (dateA > dateB) return -1

    return 0
  })
  .slice(0, 4)

  return posts
}
