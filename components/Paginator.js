import pageBadges from 'js-paging'
import Link from 'next/link'

export default function Pagination({ href, currentPage, pages }) {
  return (
    <div className="paginator">
      {pageBadges({ currentPage, pages }).map((num, index) =>
        num ? (
          <Link
            key={`page-${num}`}
            href={href(num)}
            shallow
            className={`badge ${num === currentPage ? 'current' : ''}`}
          >
            {num}
          </Link>
        ) : (
          <span key={`separator-${index}`} className="separator">
            ...
          </span>
        )
      )}
    </div>
  )
}
