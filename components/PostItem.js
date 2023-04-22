"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import PostInfo from '../components/PostInfo'

export default function PostItem({ slug, metadata, date, timeToRead }) {
  const router = useRouter()

  async function navigate() {
    await router.push(`/blog/${slug}`)
    window.scrollTo(0, 0)
  }

  return (
    <div
      onClick={navigate}
      className="post-list-item"
      title={metadata.description}
      aria-label={metadata.description}
    >
      <div className="image-wrapper">
        <img loading="lazy" height={50} width={110} src={metadata.cover_image_mobile} alt={metadata.title} />
      </div>
      <div className="info">
        <Link href={`/blog/${slug}`}>
          <h2>{metadata.title}</h2>
        </Link>
        <PostInfo date={date} timeToRead={timeToRead} hideAuthor />
      </div>
    </div>
  )
}
