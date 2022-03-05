import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'

import BlogSeries from '../../components/BlogSeries'
import Newsletter from '../../components/Newsletter'
import PostInfo from '../../components/PostInfo'
import PostItem from '../../components/PostItem'
import Tag from '../../components/Tag'
import addCustomPostWidgets from '../../utils/addCustomPostWidgets'
import clearPage from '../../utils/clearPage'
import getMorePosts from '../../utils/getMorePosts'
import readPost from '../../utils/readPost'

export default function Post({
  __html,
  data,
  date,
  morePosts,
  series,
  slug,
  timeToRead,
}) {
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
        <meta name="twitter:widgets:theme" />
        <meta name="keywords" content={data.tags} />
        <meta name="twitter:title" content={data.title} />
        <meta key="og:type" property="og:type" content="article" />
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
      <div
        key={slug}
        style={{ '--cover-color': data.cover_color }}
        className="cover-image"
      >
        <Image
          priority
          loading="eager"
          src={data.cover_image}
          width="960"
          height="432"
        />
      </div>
      <h1 className="post-title">{data.title}</h1>
      <PostInfo date={date} timeToRead={timeToRead} />
      <div className="tags" style={{ marginBottom: 30 }}>
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <BlogSeries key="series-top" title={data.series} series={series} />
      <div className="post" dangerouslySetInnerHTML={{ __html }} />
      <BlogSeries
        style={{ marginTop: 40 }}
        key="series-bottom"
        title={data.series}
        series={series}
      />
      <div className="end-post">
        {data.dev_to && (
          <>
            <a
              href={`https://dev.to/aralroca/${data.dev_to}#comments`}
              rel="noopener noreferrer"
              target="_blank"
              title="Discuss on Dev.to"
            >
              Discuss on Dev.to
            </a>
            <span> • </span>
          </>
        )}
        <a
          href={`https://twitter.com/search?q=${encodeURI(
            `https://aralroca.com/blog/${slug}`
          )}`}
          rel="noopener noreferrer"
          target="_blank"
          title="Discuss on Twitter"
        >
          Discuss on Twitter
        </a>
        <span> • </span>
        <a
          href={`https://github.com/aralroca/aralroca.com/blob/master/posts/${slug}.md`}
          rel="noopener noreferrer"
          target="_blank"
          title="Edit post on GitHub"
        >
          Edit on GitHub
        </a>
      </div>
      <Newsletter />
      {morePosts.length > 0 && (
        <div style={{ marginBottom: 50 }}>
          <b className="related-posts-title">More...</b>
          {morePosts.map((p) => (
            <PostItem key={p.slug} {...p} />
          ))}
        </div>
      )}
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
  const [morePosts, series] = await getMorePosts(post, slug)

  return {
    props: {
      ...post,
      __html: await addCustomPostWidgets(post.__html),
      morePosts,
      series,
      slug,
    },
  }
}
