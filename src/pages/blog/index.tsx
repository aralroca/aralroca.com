
import Newsletter from '@/components/Newsletter'
import getAllPosts from '@/utils/getAllPosts'
import type { RequestContext } from 'brisa'

export default function Blog({ }, { store }: RequestContext) {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    date: post.date,
    metadata: {
      title: post.metadata.title,
      tags: post.metadata.tags,
      description: post.metadata.description,
      cover_image_mobile: post.metadata.cover_image_mobile,
    },
    timeToRead: {
      text: post.timeToRead.text
    }
  }))
  const tags = posts.reduce((t, post) => {
    const postTags = post.metadata.tags.split(',')
    postTags.forEach((tag: string) => {
      const trimmedTag = tag.trim();
      if (!t.includes(trimmedTag)) t.push(trimmedTag)
    })
    return t
  }, [] as string[])

  store.set('tags', tags)
  store.set('posts', posts)
  store.transferToClient(['tags', 'posts'])

  return (
    <post-list tags={tags}>
      <h1 slot="title">Blog</h1>
      <Newsletter />
    </post-list>
  )
}
