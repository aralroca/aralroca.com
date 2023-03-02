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
      <div className="content">
        <p style={{ fontStyle: 'italic', color: '#666' }}>Creator and maintainer of:</p>
        <ul>
          <li>
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://github.com/aralroca/next-translate"
            >
              Next-translate
            </a>{' '}
            Tiny sized Next.js library for i18n that covers all basics needs.
          </li>
          <li>
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://github.com/aralroca/next-load"
            >
              Next-load
            </a>{' '}
            Next Load is a simple and lightweight library (~500B) that makes it easy to manage data loading and hydration in Next.js +13 app dir projects.
          </li>
          <li>
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://github.com/teafuljs/teaful"
            >
              Teaful
            </a>{' '}
            Tiny, easy and powerful React state management.
          </li>
          <li>
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://github.com/teafuljs/teaful-devtools"
            >
              Teaful DevTools
            </a>{' '}
            Browser extension for inspection Teaful applications.
          </li>
          <li>
            <a
              target="blank"
              rel="noopener noreferrer"
              href="https://github.com/teafuljs/teaful"
            >
              Etiketai
            </a>{' '}
            Etiketai is an online tool designed to label images, useful to
            train AI models.
          </li>
          <li style={{ fontStyle: 'italic' }}>... <a target="blank"
            rel="noopener noreferrer"
            href="https://github.com/aralroca?tab=repositories&q=&type=source&language=&sort=stargazers">More</a></li>
        </ul>

        <p>
          I've also contributed to other libraries resolving issues or developing
          new features.
        </p>
        <p>
          A few years ago I realized that I wanted to focus my efforts on being
          useful and that's why I like OSS so much, it's a nice way to approach
          tech to everybody and everywhere.
        </p>
      </div>
    </div>
  )
}
