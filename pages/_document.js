import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#ad1457" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com/"
            crossorigin
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Ruluko&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Raleway&display=swap"
            rel="stylesheet"
          />
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
                  document.body.className = newTheme === 'system'
                    ? darkQuery.matches ? 'dark' : 'light'
                    : newTheme;
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
