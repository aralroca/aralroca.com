export default function clearPage(page: string) {
  return page
    .replace('pages', '')
    .replace('.js', '')
    .replace('.md', '')
    .replace('/index', '');
}
