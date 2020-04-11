import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Head from 'next/head'
import marked from 'marked'

export default function Post({ htmlString, data }) {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta title="description" content={data.description} />
      </Head>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  )
}

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

export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMetadata = fs
    .readFileSync(path.join('posts', slug + '.md'))
    .toString()

  const parsedMarkdown = matter(markdownWithMetadata)
  const htmlString = marked(parsedMarkdown.content).replace(
    '<img ',
    '<img loading="lazy" '
  )

  return {
    props: {
      htmlString,
      data: parsedMarkdown.data,
    },
  }
}
