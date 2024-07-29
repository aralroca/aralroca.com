import fs from 'node:fs';
import path from 'node:path';
import readingTime from 'reading-time';
import matter from 'gray-matter';
import niceDateText from './niceDateText';

export type Post = {
  slug: string;
  metadata: {
    title: string;
    description: string;
    created: string;
    tags: string;
    cover_image_mobile: string;
    series: string;
  };
  timeToRead: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  date: string;
  data: any;
};

const isProd = process.env.NODE_ENV === 'production';
const POSTS_PATH = path.join(process.cwd(), 'src', 'posts');

export default function getAllPosts(): Post[] {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((slug) => !slug.startsWith('draft-') || !isProd)
    .map((slug) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(POSTS_PATH, slug)),
      );
      return {
        slug: slug.replace('.md', ''),
        metadata: data,
        timeToRead: readingTime(content),
        date: niceDateText(new Date(data.created)),
      } as Post;
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.created).getTime() -
        new Date(a.metadata.created).getTime(),
    );
}
