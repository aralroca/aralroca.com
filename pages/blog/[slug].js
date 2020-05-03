import Head from 'next/head'
import fs from 'fs'

import Newsletter from '../../components/Newsletter'
import Tag from '../../components/Tag'
import clearPage from '../../utils/clearPage'
import readPost from '../../utils/readPost'

export default function Post({ date, __html, data, timeToRead }) {
  const tags = data.tags.split(',')

  return (
    <>
      <Head>
        <title key="title">{data.title}</title>
        <meta key="meta-title" name="title" content={data.title} />
        <meta
          key="meta-description"
          name="description"
          content={data.description}
        />
        <meta key="meta-tags" name="keywords" content={data.tags} />
        <meta name="twitter:title" content={data.title} />
        <meta
          key="meta-og-image"
          property="og:image"
          content={'https://aralroca.com' + data.cover_image}
        />
        <meta key="meta-og:title" property="og:title" content={data.title} />
        <meta
          key="meta-og:description"
          property="og:description"
          content={data.description}
        />
      </Head>
      <div style={{
        backgroundColor: data.cover_color,
        backgroundImage: `url(${data.cover_image})`,
        backgroundSize: 'cover',
        marginLeft: -30,
        marginTop: -30,
        maxWidth: 'calc(100% + 60px)',
        paddingTop: '48%',
        width: 960,
      }} />
      <h1 className="post-title">{data.title}</h1>
      <p className="post-info">{`${date} • ${timeToRead.text}`}</p>
      <div className="tags" style={{ marginBottom: 30 }}>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <div className="post" dangerouslySetInnerHTML={{ __html }} />
      <Newsletter />
    </>
  )
}

/**
 * Load all the slugs corresponding to all mardown filenames.
 */
export const getStaticPaths = async () => {
  const files = fs.readdirSync('posts').map(clearPage)
  const paths = files.map((slug) => ({ params: { slug } }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const post = readPost(slug)
  return {
    props: {
      ...post,
      __html: post.__html.replace(/<img /g, '<img loading="lazy" '),
    },
  }
}
