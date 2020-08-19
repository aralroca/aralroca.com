import { useState } from 'react'

function Arrows(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path d="M17 8.517L12 3 7 8.517M7 15.48l5 5.517 5-5.517"></path>
    </svg>
  )
}

function Dark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  )
}

function Light() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2"></path>
      <path d="M12 21v2"></path>
      <path d="M4.22 4.22l1.42 1.42"></path>
      <path d="M18.36 18.36l1.42 1.42"></path>
      <path d="M1 12h2"></path>
      <path d="M21 12h2"></path>
      <path d="M4.22 19.78l1.42-1.42"></path>
      <path d="M18.36 5.64l1.42-1.42"></path>
    </svg>
  )
}

function System() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
    >
      <path d="M2 13.381h20M8.66 19.05V22m6.84-2.95V22m-8.955 0h10.932M4 19.05h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v13.05a2 2 0 002 2z"></path>
    </svg>
  )
}

export default function ChangeTheme() {
  const isNode = typeof window === 'undefined'
  const [theme, setTheme] = useState(
    isNode ? undefined : window.__theme || 'system'
  )
  const right = {
    dark: 30,
    system: 15,
    light: 27,
  }[theme]

  function onChangeTwitterEmbedTheme() {
    const theme = document.body.className
    parent.document.querySelectorAll('iframe[src]').forEach((iframe) => {
      if (!iframe.src.startsWith('https://platform.twitter.com')) return
      if (!iframe.src.includes('theme=')) iframe.src += `&theme=${theme}`
      else iframe.src = iframe.src.replace(/theme=(dark|light)/g, `theme=${theme}`)
    })
  }

  function onChangeTheme(e) {
    const { value } = e.target
    window.__setPreferredTheme(value)
    setTheme(value)
    onChangeTwitterEmbedTheme()
  }

  if (isNode) return null

  return (
    <div className="change-theme">
      {theme === 'dark' && <Dark />}
      {theme === 'system' && <System />}
      {theme === 'light' && <Light />}
      <select
        title="Choose another theme"
        aria-label="Choose another theme"
        value={theme}
        onChange={onChangeTheme}
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <Arrows style={{ right }} />
    </div>
  )
}
