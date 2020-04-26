import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Tag({ label, search = '', onClick }) {
  const { pathname, asPath } = useRouter()
  const tag = label.toLowerCase()
  const tags = search.split(' ').map((t) => t.toLowerCase())
  const isActive = tags.includes(tag)
  let href = `/blog?q=${label}`

  if (pathname === '/blog') {
    href = asPath === pathname ? `/blog?q=${label}` : `${asPath}+${label}`
  }

  if (isActive) {
    const q = tags.filter((t) => t !== tag).join('+')
    href = q ? `/blog?q=${q}` : '/blog'
  }

  return (
    <Link href={href}>
      <a onClick={onClick} className={`tag ${isActive ? 'active' : ''}`}>
        {label}
      </a>
    </Link>
  )
}
