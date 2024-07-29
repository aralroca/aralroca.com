export default function getCanonical(path: string) {
  return 'https://aralroca.com' + path.replace(/(\?|#).*/, '');
}
