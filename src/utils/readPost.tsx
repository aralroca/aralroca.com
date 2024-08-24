import fs from 'node:fs';
// @ts-ignore
import { Marked, marked } from 'marked';
import matter from 'gray-matter';
import path from 'node:path';
import readingTime from 'reading-time';
import niceDateText from './niceDateText';
import { markedHighlight } from 'marked-highlight';

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
    .toString();
  const hljs = require('highlight.js');

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    }),
  );

  const { data, content } = matter(markdownWithMetadata);

  return {
    data,
    date: niceDateText(new Date(data.created)),
    __html: marked.parse(content).toString(),
    timeToRead: readingTime(content),
  };
}
