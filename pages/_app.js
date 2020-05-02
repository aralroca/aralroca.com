import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ChangeTheme from '../components/ChangeTheme'
import getCanonical from '../utils/getCanonical'

import '../styles/main.css'
import '../styles/highlightcode.css'

export default function Layout({ Component, pageProps }) {
  const { pathname, asPath } = useRouter()
  const isActive = (link) => (pathname.startsWith(link) ? 'active' : '')

  const data = {
    url: getCanonical(asPath),
    title: 'Aral Roca',
    description:
      "Aral Roca's personal web site. Open source does tend to be more stable software. It's the right way to do things.",
    cover_image: 'https://www.aralroca.com/images/profile.jpg',
    tags:
      'javascript, developer, open source, software engineer, preact, react, machine learning, js, barcelona, spain',
  }

  return (
    <>
      <Head>
        <title key="title">{data.title}</title>
        <meta key="meta-title" name="title" content={data.title} />
        <meta
          key="meta-description"
          name="description"
          content={data.description}
        />
        <meta key="meta-tags" name="keywords" content={data.tags} />
        <meta name="twitter:creator" content="@aralroca" />
        <meta name="twitter:title" content={data.title} />
        <link key="canonical" rel="canonical" href={data.url} />
        <meta key="meta-og:url" property="og:url" content={data.url} />
        <meta
          key="meta-og-image"
          property="og:image"
          content={data.cover_image}
        />
        <meta key="meta-og:title" property="og:title" content={data.title} />
        <meta
          key="meta-og:description"
          property="og:description"
          content={data.description}
        />
      </Head>
      <header>
        <Link href="/">
          <a title="Go to homepage" className="logo">
            <img
              alt="Aral Roca's personal web site"
              src="/images/logo.svg"
              width={48}
              height={48}
            />
            <span>Aral Roca.</span>
          </a>
        </Link>
        <nav>
          <Link href="/blog">
            <a className={isActive('/blog')}>Blog</a>
          </Link>
          <Link href="/thanks">
            <a className={isActive('/thanks')}>Supporters</a>
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
        <a
          title="RSS Feed"
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
        >
          rss
        </a>
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
        <a title="Contact me" href="mailto:contact@aralroca.com">
          contact@aralroca.com
        </a>
        <ChangeTheme />
      </footer>
    </>
  )
}
