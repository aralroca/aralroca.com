import Head from 'next/head'

export default function Donate() {
  return (
    <>
      <Head>
        <title key="title">Donate - Aral Roca</title>
      </Head>
      <h1>Donate</h1>
      <p>
        Few years ago I realized that I wanted to be useful and now, with your
        support, I'll be able to focus on contributing as much as possible to
        the Open-Source community. Thank you so much ♥️
      </p>
      <a
        href="https://github.com/sponsors/aralroca"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read more about me and what I do
      </a>

      <hr className="donate-wrapper-separator" />
      <div className="donate-wrapper">
        <div>
          <h2>Monthly donations</h2>
          <ul>
            <li>
              <a
                href="https://github.com/sponsors/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Sponsors
              </a>
            </li>
            <li>
              <a
                href="https://ko-fi.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ko-fi.com
              </a>
            </li>
            <li>
              <a
                href="https://www.patreon.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Patreon
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2>One-time donations</h2>
          <ul>
            <li>
              <a
                href="https://www.buymeacoffee.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                BuyMeACoffee.com
              </a>
            </li>
            <li>
              <a
                href="https://ko-fi.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ko-fi.com
              </a>
            </li>
            <li>
              <a
                href="https://www.paypal.me/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                PayPal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
