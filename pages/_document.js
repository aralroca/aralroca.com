import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#ad1457" />
          <link rel="manifest" href="/manifest.json" />
          <script
            defer
            src="https://www.googletagmanager.com/gtag/js?id=UA-80705550-1"
          ></script>
        </Head>
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
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
