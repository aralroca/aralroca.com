import Head from 'next/head'
import fs from 'fs'
import marked from 'marked'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import { useRouter } from 'next/router'
import niceDateText from '../../utils/niceDateText'
import getCanonical from '../../utils/getCanonical'

export default function Post({ date, __html, data, timeToRead }) {
  const { asPath } = useRouter()
  const url = getCanonical(asPath)

  return (
    <>
      <Head>
        <title key="title">{data.title}</title>
        <meta key="meta-title" title="description" content={data.description} />
        <meta key="meta-tags" name="keywords" content={data.tags} />
        <link key="canonical" rel="canonical" href={url} />
        <meta key="meta-og:url" property="og:url" content={url} />
        <meta
          key="meta-og-image"
          property="og:image"
          content={data.cover_image}
        />
        <meta key="meta-og:title" property="og:title" content={data.title} />
        <meta
          key="meta-og:description"
          property="og:description"
          content={data.description}
        />
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
