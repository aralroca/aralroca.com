"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, Fragment, use } from 'react'

import Newsletter from '../../components/Newsletter'
import Pagination from '../../components/Paginator'
import PostItem from '../../components/PostItem'
import Tag from '../../components/Tag'
import filterSearch from '../../utils/filterSearch'

const itemsPerPage = 10

function Searcher({ search, onSearch }) {
  const label = 'Search posts'

  return (
    <input
      className="post-searcher"
      defaultValue={search}
      onChange={onSearch}
      aria-label={label}
      placeholder={label}
      type="text"
    />
  )
}

export default function Blog({ posts, tags }) {
  const router = useRouter()
  const params = useSearchParams()
  const q = params.get('q')
  const page = params.get('page')
  const key = useRef(Date.now())
  const [search, setSearch] = useState(q || '')

  const filteredPosts = search ? posts.filter(filterSearch(search)) : posts
  const [currentPage, setCurrentPage] = useState(parseInt(page) || 1)
  const pages = Math.ceil(filteredPosts.length / itemsPerPage)
  const lastIndex = itemsPerPage * currentPage
  const firstIndex = lastIndex - itemsPerPage
  const postsToShow = filteredPosts.slice(firstIndex, lastIndex)

  function onSearch(e) {
    const val = e.target.value.toLowerCase()
    const url = val ? `/blog?q=${e.target.value.toLowerCase()}` : '/blog'
    router.replace(url, undefined, { shallow: true })
  }

  // Update state from param
  useEffect(() => setSearch(q || ''), [q])
  useEffect(() => setCurrentPage(parseInt(page) || 1), [page])

  return (
    <Fragment key={postsToShow.length ? 'non-empty' : 'empty'}>

      <div className="blog-page-content">

        <div className="posts-box">

          <div className="blog-title">
            <h1>Blog</h1>
            <div>
              {filteredPosts.length} posts
            </div>
          </div>

          {postsToShow.map((post) => (
            <PostItem key={post.slug} {...post} />
          ))}

          {pages > 1 && (
            <Pagination
              href={(p) => `/blog?q=${q || ''}&page=${p}`}
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
        </div>

        <aside className="searcher-box">
          <div className="sticky">
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
            <Newsletter />
          </div>
        </aside>
      </div>
    </Fragment>
  )
}

