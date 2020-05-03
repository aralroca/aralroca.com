import Head from 'next/head'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

import Newsletter from '../../components/Newsletter'
import Tag from '../../components/Tag'
import filterSearch from '../../utils/filterSearch'
import niceDateText from '../../utils/niceDateText'
import PostItem from '../../components/PostItem'

function Searcher({ search, onSearch }) {
  const label = 'Search posts'

  return (
    <input
      className="post-searcher"
      defaultValue={search}
      onChange={onSearch}
      ariaLabel={label}
      placeholder={label}
      type="text"
    />
  )
}

export default function Blog({ posts, tags }) {
  const router = useRouter()
  const key = useRef(Date.now())
  const [search, setSearch] = useState(router.query.q || '')

  const filteredPosts = search ? posts.filter(filterSearch(search)) : posts

  function onSearch(e) {
    const val = e.target.value.toLowerCase()
    const url = val ? `/blog?q=${e.target.value.toLowerCase()}` : '/blog'
    router.replace(url, undefined, { shallow: true })
  }


  // Update state from search param
  useEffect(() => setSearch(router.query.q), [router.query.q])

  return (
    <>
      <Head>
        <title key="title">Blog - Aral Roca</title>

        {router.asPath !== router.pathname && (
          <meta key="noIndex" name="robots" content="noindex, follow" />
        )}
      </Head>
      <h1>Blog</h1>

      <Searcher key={key.current} search={search} onSearch={onSearch} />

      <div className="tags" style={{ marginTop: 10 }}>
        {tags.map((tag) => (
          <Tag
            onClick={() => (key.current = Date.now())}
            key={tag}
            label={tag}
            search={search}
          />
        ))}
      </div>

      {filteredPosts.map((post) => <PostItem key={post.slug} {...post} />)}

      {filteredPosts.length === 0 && (
        <div style={{ marginTop: 50, textAlign: 'center' }}>
          Can't find what you're looking for? Try using{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/search?q=site%3Aaralroca.com+${search}`}
          >
            Google
          </a>
          .
        </div>
      )}
      <Newsletter />
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs
    .readdirSync('posts')
    .map((slug) => {
      const { data, content } = matter(
        fs.readFileSync(path.join('posts', slug))
      )
      return {
        slug: slug.replace('.md', ''),
        metadata: data,
        timeToRead: readingTime(content),
        date: niceDateText(new Date(data.created)),
      }
    })
    .sort((a, b) => new Date(b.metadata.created) - new Date(a.metadata.created))

  const tags = posts.reduce((t, post) => {
    const postTags = post.metadata.tags.split(',')
    postTags.forEach((tag) => {
      const trimmedTag = tag.trim()
      if (!t.includes(trimmedTag)) t.push(trimmedTag)
    })
    return t
  }, [])

  return { props: { posts, tags } }
}
