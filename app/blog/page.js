import getAllPosts from '../../utils/getAllPosts'
import BlogClient from './blog.client'

async function loadData() {
  const posts = getAllPosts()
  const tags = posts.reduce((t, post) => {
    const postTags = post.metadata.tags.split(',')
    postTags.forEach((tag) => {
      const trimmedTag = tag.trim()
      if (!t.includes(trimmedTag)) t.push(trimmedTag)
    })
    return t
  }, [])

  return { posts, tags }
}

export default async function Blog() {
  const { posts, tags } = await loadData()

  return <BlogClient posts={posts} tags={tags} />
}

export async function generateMetadata({ params, searchParams }) {
  const metadata =  { title: 'Blog - Aral Roca' }

  if (searchParams.q || searchParams.page) {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}