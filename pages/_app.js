import Link from 'next/link'
import Head from 'next/head'

import '../styles/main.css'

export default function Layout({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0"
        />
      </Head>
      <header>
        <Link href="/">
          <a title="Go to homepage" className="logo">
            Aral Roca.
          </a>
        </Link>
        <nav>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </nav>
      </header>

      <main>
        <Component {...pageProps} />
      </main>
      <footer>
        <a title="Contact me" href="mailto:aral-rg@hotmail.com">
          aral-rg@hotmail.com
        </a>
      </footer>
    </>
  )
}
