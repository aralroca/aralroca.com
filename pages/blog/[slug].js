import fs from 'fs'
import path from 'path'
import readingTime from 'reading-time'
import matter from 'gray-matter'
import Head from 'next/head'
import marked from 'marked'
import niceDateText from '../../utils/niceDateText'

export default function Post({ date, __html, data, timeToRead }) {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta title="description" content={data.description} />
      </Head>
      <h1>{data.title}</h1>
      <p className="post-info">{`${date} • ${timeToRead.text}`}</p>
      <div className="post" dangerouslySetInnerHTML={{ __html }} />
    </>
  )
}

/**
 * Load all the slugs corresponding to all mardown filenames.
 */
export const getStaticPaths = async () => {
  const files = fs.readdirSync('posts')
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

/**
 * Read each post converting markdown to HTML + metadata
 */
export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMetadata = fs
    .readFileSync(path.join('posts', slug + '.md'))
    .toString()

  const { data, content } = matter(markdownWithMetadata)
  const __html = marked(content).replace(/<img /g, '<img loading="lazy" ')

  return {
    props: {
      data,
      date: niceDateText(new Date(data.created)),
      __html,
      timeToRead: readingTime(content),
    },
  }
}
