import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href="/blog">
        <a>Go to blog</a>
      </Link>
    </div>
  )
}
