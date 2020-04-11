import Link from 'next/link'
import { useRouter } from 'next/router'

import '../styles/main.css'

export default function Layout({ Component, pageProps }) {
  const { pathname } = useRouter()
  const isActive = (link) => (pathname.startsWith(link) ? 'active' : '')

  return (
    <>
      <header>
        <Link href="/">
          <a title="Go to homepage" className="logo">
            Aral Roca.
          </a>
        </Link>
        <nav>
          <Link href="/blog">
            <a className={isActive('/blog')}>Blog</a>
          </Link>
          <Link href="/supporters">
            <a className={isActive('/supporters')}>Supporters</a>
          </Link>
          <Link href="/contact">
            <a className={isActive('/contact')}>Contact</a>
          </Link>
        </nav>
      </header>

      <main>
        <Component {...pageProps} />
      </main>
      <footer>
        <a title="Contact me" href="mailto:contact@aralroca.com">
          contact@aralroca.com
        </a>
      </footer>
    </>
  )
}
