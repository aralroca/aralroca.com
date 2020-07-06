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
          >
            <a className={`badge ${num === currentPage ? 'current' : ''}`}
            >{num} </a>
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
