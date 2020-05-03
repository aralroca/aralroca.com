export default function getCanonical(asPath) {
  return 'https://aralroca.com' + asPath.replace(/(\?|#).*/, '')
}
