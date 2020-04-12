import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import '../styles/main.css'

export default function Layout({ Component, pageProps }) {
  const { pathname } = useRouter()
  const isActive = (link) => (pathname.startsWith(link) ? 'active' : '')

  return (
    <>
      <Head>
        <title>Aral Roca</title>
      </Head>
      <header>
        <Link href="/">
          <a title="Go to homepage" className="logo">
            <img src="/images/logo.png" width={24} />
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
          <Link href="/donate">
            <a className={isActive('/donate')}>Donate</a>
          </Link>
        </nav>
      </header>

      <main>
        <Component {...pageProps} />
      </main>
      <footer>
        <div>
          <a
            href="https://twitter.com/aralroca"
            target="_blank"
            rel="noopener noreferrer"
          >
            twitter
          </a>
          <a
            href="https://github.com/aralroca"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <a
            href="https://stackoverflow.com/users/4467741/aral-roca"
            target="_blank"
            rel="noopener noreferrer"
          >
            stack overflow
          </a>
        </div>
        <a title="Contact me" href="mailto:contact@aralroca.com">
          contact@aralroca.com
        </a>
      </footer>
    </>
  )
}
