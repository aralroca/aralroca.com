import Head from 'next/head'
import Link from 'next/link'

export default function Supporters() {
  function donate() {
    const donateEl = document.querySelector('#donate')
    donateEl.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="supporters">
      <Head>
        <title key="title">Supporters - Aral Roca</title>
      </Head>
      <div className="support-head">
        <h1>Support</h1>
        <div onClick={donate} role="button" className="donate-btn">
          Donate 🧡
        </div>
      </div>

      <p className="description">
        Thank you for making my Open-Source work possible.{' '}
        <u>You're awesome!</u>
      </p>

      {/* <h2>Sponsors list</h2>

      <h3>🌕 Platinum</h3>
      <em>None.</em>

      <h3>🌖 Gold</h3>
      <em>None.</em>

      <h3>🌗 Silver</h3>
      <em>None.</em>

      <h3>🌘 Bronze</h3>
      <em>None.</em>

      <h2>Supporters list</h2>
      <h3>Top Supporters</h3>
      <em>None.</em>

      <h3>Open-Source Supporter</h3>
      <em>None.</em>

      <h3>Supporters</h3>
      <em>None.</em> */}

      <hr className="wrapper-separator" />
      <h2 id="donate">Donate</h2>
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
    </div>
  )
}
