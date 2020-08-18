import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

import PostInfo from '../components/PostInfo'
import useLoadOnViewport from '../hooks/useLoadOnViewport'

export default function PostItem({ slug, metadata, date, timeToRead }) {
  const [ref, isLoaded] = useLoadOnViewport()

  async function navigate() {
    await Router.push(`/blog/[slug]?slug=${slug}`, `/blog/${slug}`)
    window.scrollTo(0, 0)
  }

  return (
    <div
      ref={ref}
      onClick={navigate}
      className="post-list-item"
    >
      <div
        className="post-thumb"
        style={{
          '--thumb-img-mobile': isLoaded ? `url(${metadata.cover_image_mobile})` : 'none',
          '--thumb-img': isLoaded ? `url(${metadata.cover_image_vert})` : 'none',
          backgroundColor: metadata.cover_color,
        }}
      />
      <div>
        <Link
          href={`/blog/[slug]?slug=${slug}`}
          as={`/blog/${slug}`}
        >
          <a>
            <h2>{metadata.title}</h2>
          </a>
        </Link>
        <PostInfo date={date} timeToRead={timeToRead} hideAuthor />
        <p>{metadata.description}</p>
      </div>
    </div>
  )
}
