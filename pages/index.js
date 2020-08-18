export default function Home() {
  return (
    <div className="homepage">
      <img
        className="profile-picture"
        src="/images/profile.jpg"
        alt="Aral Roca profile's picture"
      />
      <h1>Aral Roca</h1>
      <h2>Software Engineer</h2>
      <p>
        Creator and maintainer of{' '}
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://github.com/vinissimus/next-translate"
        >
          next-translate
        </a>
        , a tiny sized Next.js library for i18n that covers all basics needs.
        I've also contributed to other libraries resolving issues or developing
        new features.
      </p>
      <p>
        A few years ago I realized that I wanted to focus my efforts on being
        useful and that's why I like OSS so much, it's a nice way to approach
        tech to everybody and everywhere. In the near future, I'd like to try
        mentorship and talks.
      </p>
      <blockquote className="quote">
        "I think, fundamentally, open source does tend to be more stable
        software. It's the right way to do things." — Linus Torvalds
      </blockquote>
    </div>
  )
}
