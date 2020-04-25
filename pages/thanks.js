import Head from 'next/head'
import Link from 'next/link'

export default function Supporters() {
  return (
    <div className="supporters">
      <Head>
        <title key="title">Supporters - Aral Roca</title>
      </Head>
      <h1>Supporters</h1>
      <p className="description">
        Thank you for making my Open-Source work possible.{' '}
        <u>You're awesome!</u>
      </p>

      <h2>🌕 Platinum supporters</h2>
      <em>None.</em>

      <h2>🌔 Silver supporters</h2>
      <em>None.</em>

      <h2>🌓 Supporters</h2>
      <em>None.</em>

      <h2>Become a supporter</h2>
      <p>
        <Link href="/donate">
          <a>Support my open source work </a>
        </Link>
      </p>
    </div>
  )
}
