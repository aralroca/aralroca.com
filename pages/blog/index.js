import Link from 'next/link'
import Head from 'next/head'
import fs from 'fs'

export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>Blog - Aral Roca</title>
      </Head>
      <h1>All my posts</h1>
      {posts.map((post) => {
        return (
          <div key={post}>
            <Link href={`/blog/${post}`}>
              <a>{`/blog/${post}`}</a>
            </Link>
          </div>
        )
      })}
    </>
  )
}

export const getStaticProps = async () => {
  const files = fs.readdirSync('posts')
  return {
    props: {
      posts: files.map((filename) => filename.replace('.md', '')),
    },
  }
}
