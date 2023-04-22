"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import styles from './styles.module.css'

export default function BlogSeries({ title, series, ...props }) {
  const params = useSearchParams()
  const slug = params.get('slug')

  if (!series || !series.length) return null

  return (
    <div className={styles.blogSeries} {...props}>
      <div className={styles.title}>
        {title} ({series.length} Part Series)
      </div>
      {series.map((serie, index) => {
        const title = `${index + 1}) ${serie.title}`
        const key = `serie-${serie.slug}`

        if (serie.slug === slug) {
          return (
            <div
              key={key}
              className={[styles.blogSerie, styles.active].join(' ')}
            >
              {title}
            </div>
          )
        }

        return (
          <Link
            href={`/blog/[slug]?slug=${serie.slug}`}
            as={`/blog/${serie.slug}`}
            key={key}
            className={styles.blogSerie}
          >
            {title}
          </Link>
        )
      })}
    </div>
  )
}
