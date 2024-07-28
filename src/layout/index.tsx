import getCanonical from '@/utils/getCanonical';
import { dangerHTML, type RequestContext } from 'brisa'

const TITLE_BY_PATHNAME: Record<string, string> = {
  '/': 'Aral Roca',
  '/blog': 'Blog - Aral Roca',
  '/thanks': 'Supporters - Aral Roca',
} as const;

export default function Layout({ children }: any, { route }: RequestContext) {
  const { name, params, pathname } = route
  const isActive = (link: string) => name.startsWith(link) ? 'active' : ''
  const isDefaultMeta = name !== '/blog/[slug]'
  const mainClass = name.startsWith('/blog/') ? 'blog' : ''
  const hasParams = Object.keys(params).length > 0

  const data = {
    url: getCanonical(pathname),
    title: TITLE_BY_PATHNAME[name] || 'Aral Roca',
    description:
      "Aral Roca's personal web site. Open source does tend to be more stable software. It's the right way to do things.",
    cover_image: 'https://aralroca.com/images/profile_full.jpg',
    tags:
      'javascript, developer, open source, software engineer, preact, react, machine learning, js, barcelona, spain',
  }

  // TODO: Remove styles after this issue: 
  // https://github.com/brisa-build/brisa/issues/156#issuecomment-2228440081
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ad1457" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/main.css"></link>
        <link rel="stylesheet" href="/styles/highlightcode.css"></link>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {hasParams && <meta id="noIndex" name="robots" content="noindex, follow" />}
        {isDefaultMeta && (
          <>
            <title id="title">{data.title}</title>
            <meta name="monetization" content="$ilp.uphold.com/QjjKbnm6Dazp" />
            <meta id="meta-title" name="title" content={data.title} />
            <meta
              id="meta-description"
              name="description"
              content={data.description}
            />
            <meta id="meta-keywords" name="keywords" content={data.tags} />
            <meta id="meta-twitter-title" name="twitter:title" content={data.title} />
            <meta id="og:type" property="og:type" content="website" />
            <meta
              id="meta-og-image"
              property="og:image"
              content={data.cover_image}
            />
            <meta
              id="meta-og:title"
              property="og:title"
              content={data.title}
            />
            <meta
              id="meta-og:description"
              property="og:description"
              content={data.description}
            />
          </>
        )}
        <meta name="twitter:creator" content="@aralroca" />
        <meta id="meta-og:url" property="og:url" content={data.url} />
        <link
          rel="search"
          href="https://aralroca.com/search.xml"
          type="application/opensearchdescription+xml"
          title="Aral Roca"
        />
        <script
          defer
          src="https://www.googletagmanager.com/gtag/js?id=UA-80705550-1"
        ></script>
      </head>
      <body class="light">
        <script id="theme-loader">
          {dangerHTML(`
              // Google analytics
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-80705550-1');
            `)}
        </script>
        <header>
          <a href="/" title="Go to homepage" class="logo">
            <img
              alt="Aral Roca's personal web site"
              src="/images/logo.svg"
              width={48}
              height={48}
            />
            <span>Aral Roca.</span>
          </a>
          <nav>
            <a class={isActive('/blog')} href="/blog">Blog</a>
            <a href="/thanks" class={isActive('/thanks')}>Support</a>
          </nav>
        </header>

        <main class={mainClass}>
          {children}
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
          <change-theme skipSSR style={{ height: '28px', width: '118px' }}>
            <DarkSVG />
            <LightSVG />
            <SystemElement />
          </change-theme>
        </footer>
      </body>
    </html>
  )
}
function DarkSVG() {
  return (
    <svg
      slot="dark"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  )
}

function LightSVG() {
  return (
    <svg
      slot="light"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2"></path>
      <path d="M12 21v2"></path>
      <path d="M4.22 4.22l1.42 1.42"></path>
      <path d="M18.36 18.36l1.42 1.42"></path>
      <path d="M1 12h2"></path>
      <path d="M21 12h2"></path>
      <path d="M4.22 19.78l1.42-1.42"></path>
      <path d="M18.36 5.64l1.42-1.42"></path>
    </svg>
  )
}

function SystemElement() {
  return (
    <svg
      slot="system"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <path d="M2 13.381h20M8.66 19.05V22m6.84-2.95V22m-8.955 0h10.932M4 19.05h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v13.05a2 2 0 002 2z"></path>
    </svg>
  )
}

