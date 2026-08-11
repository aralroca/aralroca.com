import { ChangeTheme } from '@/islands/change-theme';

type LayoutProps = {
  children: unknown;
  ctx: { url: URL };
};

export default function Layout({ children, ctx }: LayoutProps) {
  const { pathname } = ctx.url;
  const isActive = (link: string) =>
    pathname.startsWith(link) ? 'active' : '';
  const mainClass = pathname.startsWith('/blog/') ? 'blog' : '';

  return (
    <>
      <script dangerHTML={`${initTheme.toString()};${initTheme.name}();`} />
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
          <a class={isActive('/blog')} href="/blog">
            Blog
          </a>
          <a class={isActive('/tools')} href="/tools">
            Tools
          </a>
          <a href="/thanks" class={isActive('/thanks')}>
            Support
          </a>
        </nav>
      </header>

      <main class={mainClass}>{children}</main>
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
    </>
  );
}

/** Runs inline as the first body node: paints the right theme before anything renders. */
function initTheme() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const pref = localStorage.getItem('theme') || 'system';
    const mode = pref === 'system' ? (dark.matches ? 'dark' : 'light') : pref;

    document.body.className = mode;
    document.body.dataset.themePref = pref;
  };

  apply();
  dark.addEventListener('change', () => {
    if ((localStorage.getItem('theme') || 'system') === 'system') apply();
  });
}
