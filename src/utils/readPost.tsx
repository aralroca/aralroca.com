import fs from 'node:fs';
// @ts-ignore
import { marked } from 'marked';
import matter from 'gray-matter';
import path from 'node:path';
import readingTime from 'reading-time';
import niceDateText from './niceDateText';

export type PostContent = {
  data: any;
  date: string;
  __html: string;
  timeToRead: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
};

const POST_PATH = path.join(process.cwd(), 'src', 'posts');

/**
 * Read post converting markdown to HTML + metadata
 */
export default function readPost(slug: string): PostContent {
  const markdownWithMetadata = fs
    .readFileSync(path.join(POST_PATH, slug + '.md'))
    .toString()

  marked.setOptions({
    highlight: (code: string, language: string) => {
      const hljs = require('highlight.js')
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
      return hljs.highlight(code, { language: validLanguage }).value
    },
  })

  const { data, content } = matter(markdownWithMetadata)

  return {
    data,
    date: niceDateText(new Date(data.created)),
    __html: marked(content),
    timeToRead: readingTime(content),
  }
}
