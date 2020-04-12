import Link from 'next/link'
import Head from 'next/head'
import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import niceDateText from '../../utils/niceDateText'

export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>Blog - Aral Roca</title>
      </Head>
      <h1>Blog</h1>
      {posts.map((post) => {
        return (
          <div className="post-list-item" key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <a>
                <h2>{post.metadata.title}</h2>
              </a>
            </Link>
            <p className="post-info">{`${post.date} • ${post.timeToRead.text}`}</p>
            <p>{post.metadata.description}</p>
          </div>
        )
      })}
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs.readdirSync('posts').map((slug) => {
    const { data, content } = matter(fs.readFileSync(path.join('posts', slug)))
    return {
      slug: slug.replace('.md', ''),
      metadata: data,
      timeToRead: readingTime(content),
      date: niceDateText(new Date(data.created)),
    }
  })

  return { props: { posts } }
}
