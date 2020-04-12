import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1.0"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="light-theme">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
