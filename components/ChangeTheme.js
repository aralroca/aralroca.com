export default function ChangeTheme() {
  const isNode = typeof window === 'undefined'
  const theme = isNode ? undefined : window.__theme || 'system'

  function onChangeTheme(e) {
    const {value} = e.target
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    window.__setPreferredTheme(value === 'system' ? system : value)
    if(value === 'system') localStorage.removeItem('theme')
  }

  if(isNode) return null

  return (
    <select value={theme} className="change-theme" onChange={onChangeTheme}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}
