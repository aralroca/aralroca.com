import type { WebContext } from "brisa"

export default function ChangeTheme({ }, { state }: WebContext) {
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const theme = state<string>(localStorage.getItem('theme') ?? 'system')
  const twitterMetaEl = parent.document.querySelector('meta[name="twitter:widgets:theme"]');

  function setTheme(newTheme: string) {
    const mode = newTheme === 'system'
      ? darkQuery.matches ? 'dark' : 'light'
      : newTheme;

    theme.value = newTheme;
    document.body.className = mode;
    if (twitterMetaEl) twitterMetaEl.setAttribute('content', mode);
  }

  function setPreferredTheme(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  darkQuery.addEventListener('change', (e) => {
    setPreferredTheme(e.matches ? 'dark' : 'light')
  });

  setTheme(theme.value || 'system');

  function onChangeTwitterEmbedTheme() {
    const theme = document.body.className
    parent.document.querySelectorAll('iframe[src]').forEach((iframe) => {
      if (!(iframe as HTMLIFrameElement).src.startsWith('https://platform.twitter.com')) return
      if (!(iframe as HTMLIFrameElement).src.includes('theme=')) (iframe as HTMLIFrameElement).src += `&theme=${theme}`
      else (iframe as HTMLIFrameElement).src = (iframe as HTMLIFrameElement).src.replace(/theme=(dark|light)/g, `theme=${theme}`)
    })
  }

  function onChangeTheme(e: any) {
    const { value } = e.target
    setPreferredTheme(value)
    onChangeTwitterEmbedTheme()
  }

  return (
    <label for="theme" class="change-theme">
      {theme.value === 'dark' && <slot name="dark" />}
      {theme.value === 'system' && <slot name="system" />}
      {theme.value === 'light' && <slot name="light" />}
      <select
        title="Choose another theme"
        aria-label="Choose another theme"
        onChange={onChangeTheme}
        id="theme"
      >
        <option selected={theme.value === "system"} value="system">System</option>
        <option selected={theme.value === "dark"} value="dark"> Dark</option>
        <option selected={theme.value === "light"} value="light">Light</option>
      </select>
    </label>
  )
}

declare global {
  interface Window {
    __theme: string
    __setPreferredTheme: (theme: string) => void
  }
}