export default function getCanonical(asPath) {
  return 'https://www.aralroca.com' + asPath.replace(/(\?|#).*/, '')
}
