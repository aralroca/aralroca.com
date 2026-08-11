import { PostList } from '@/islands/post-list';
import pageMeta from '@/seo';
import getAllPosts from '@/utils/getAllPosts';

export const meta = pageMeta({ title: 'Blog - Aral Roca', canonical: '/blog' });

export default function Blog() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    date: post.date,
    metadata: {
      title: post.metadata.title,
      tags: post.metadata.tags,
      description: post.metadata.description,
      cover_image_mobile: post.metadata.cover_image_mobile,
    },
    timeToRead: {
      text: post.timeToRead.text,
    },
  }));
  const tags = [
    ...new Set(
      posts.flatMap((post) =>
        post.metadata.tags.split(',').map((tag) => tag.trim()),
      ),
    ),
  ];

  return <PostList initial={{ posts, tags }} />;
}
