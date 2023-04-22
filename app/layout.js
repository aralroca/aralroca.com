import Link from "next/link"
import ChangeTheme from "../components/ChangeTheme"
import getCanonical from "../utils/getCanonical"

import '../styles/main.css'
import '../styles/highlightcode.css'

const title = 'Aral Roca'
const description = "Aral Roca's personal web site. Open source does tend to be more stable software. It's the right way to do things."
const image = 'https://aralroca.com/images/profile_full.jpg'

export const metadata = {
  title,
  description,
  keywords: ['javascript', 'developer', 'open source', 'software engineer', 'preact', 'react', 'machine learning', 'js', 'barcelona', 'spain'],
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@aralroca',
    images: [image],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title,
    type: 'website',
    description,
    url: 'https://aralroca.com',
    siteName: 'Aral Roca',
    images: [
      {
        url: image,
        width: 1233,
        height: 1233,
      },
    ],
    locale: 'en-US',
  }
}

export default function RootLayout({ children, params }) {
  let pathname = 'todo'
  let pageProps = {}
  let asPath = 'todo'
  const isActive = (link) => (pathname.startsWith(link) ? 'active' : '')
  const mainClass = params.slug ? 'blog' : ''
  const url = getCanonical(asPath)

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ad1457" />
        <meta name="monetization" content="$ilp.uphold.com/QjjKbnm6Dazp" />
        <link
          key="canonical"
          rel="canonical"
          href={pageProps.data?.canonical || url}
        />
        <link
          rel="search"
          href="https://aralroca.com/search.xml"
          type="application/opensearchdescription+xml"
          title="Aral Roca"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          defer
          src="https://www.googletagmanager.com/gtag/js?id=UA-80705550-1"
        ></script>
      </head>
      <body className="light">
        <script
          dangerouslySetInnerHTML={{
            __html: `
           (function() {
             var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
             window.__onThemeChange = function() {};
             function setTheme(newTheme) {
               window.__theme = newTheme;
               preferredTheme = newTheme;
               var theme = newTheme === 'system'
               ? darkQuery.matches ? 'dark' : 'light'
               : newTheme;
               document.body.className = theme;
               var twitter = parent.document.querySelector('meta[name="twitter:widgets:theme"]');
               if(twitter) twitter.content = theme;
                 
               window.__onThemeChange(newTheme);
             }
             var preferredTheme;
             try {
               preferredTheme = localStorage.getItem('theme');
             } catch (err) { }
             window.__setPreferredTheme = function(newTheme) {
               setTheme(newTheme);
               try {
                 localStorage.setItem('theme', newTheme);
               } catch (err) {}
             }
             darkQuery.addListener(function(e) {
               window.__setPreferredTheme(e.matches ? 'dark' : 'light')
             });
             setTheme(preferredTheme || 'system');
           })();
           
           // Google analytics
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());

           gtag('config', 'UA-80705550-1');
         `,
          }}
        />
        <header>
          <Link href="/" title="Go to homepage" className="logo">
            <img
              alt="Aral Roca's personal web site"
              src="/images/logo.svg"
              width={48}
              height={48}
            />
            <span>Aral Roca.</span>
          </Link>
          <nav>
            <Link href="/blog" className={isActive('/blog')}>
              Blog
            </Link>
            <Link href="/thanks" className={isActive('/thanks')}>
              Support
            </Link>
          </nav>
        </header>
        <main className={mainClass}>
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
          <ChangeTheme />
        </footer>
      </body>
    </html>
  )
}
