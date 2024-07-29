import type { PostContent } from '@/utils/readPost';
import getAllPosts from './getAllPosts';

export default function getMorePosts({ data }: PostContent, slug: string) {
  const tags = data.tags.split(',').map((l: string) => l.trim());
  const posts = getAllPosts();

  const series = posts
    .filter(
      (p) =>
        typeof p.metadata.series === 'string' &&
        p.metadata.series === data.series,
    )
    .map(({ metadata, slug }) => ({ title: metadata.title, slug }))
    .reverse(); // sort asc instead of desc

  const related = posts
    .filter((p) => p.slug !== slug)
    .map((post) => ({
      relatedTags: tags.reduce(
        (num: string, tag: string) =>
          post.metadata.tags.includes(tag) ? num + 1 : num,
        0,
      ),
      ...post,
    }))
    .sort((a, b) => {
      // More related tags
      if (a.relatedTags < b.relatedTags) return 1;
      if (a.relatedTags > b.relatedTags) return -1;

      const dateA = new Date(a.metadata.created);
      const dateB = new Date(b.metadata.created);

      // Date
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;

      return 0;
    })
    .slice(0, 4);

  return [related, series];
}
