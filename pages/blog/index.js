import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

import Newsletter from '../../components/Newsletter'
import Pagination from '../../components/Paginator'
import PostItem from '../../components/PostItem'
import Tag from '../../components/Tag'
import filterSearch from '../../utils/filterSearch'
import getAllPosts from '../../utils/getAllPosts'

const itemsPerPage = 10

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
  const { query } = router
  const key = useRef(Date.now())
  const [search, setSearch] = useState(query.q || '')

  const filteredPosts = search ? posts.filter(filterSearch(search)) : posts
  const [currentPage, setCurrentPage] = useState(parseInt(query.page) || 1)
  const pages = Math.ceil(filteredPosts.length / itemsPerPage)
  const lastIndex = itemsPerPage * currentPage
  const firstIndex = lastIndex - itemsPerPage

  function onSearch(e) {
    const val = e.target.value.toLowerCase()
    const url = val ? `/blog?q=${e.target.value.toLowerCase()}` : '/blog'
    router.replace(url, undefined, { shallow: true })
  }

  // Update state from param
  useEffect(() => setSearch(query.q), [query.q])
  useEffect(() => setCurrentPage(parseInt(query.page) || 1), [query.page])

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

      {filteredPosts.slice(firstIndex, lastIndex).map((post) => (
        <PostItem key={post.slug} {...post} />
      ))}

      {pages > 1 && (
        <Pagination
          href={(p) => `/blog?q=${query.q || ''}&page=${p}`}
          currentPage={currentPage}
          pages={pages}
        />
      )}

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
  const posts = getAllPosts()
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
