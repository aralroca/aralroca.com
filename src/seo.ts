import type { HeadTag, PageMeta } from 'janux';

export const DEFAULT_DESCRIPTION =
  "Aral Roca's personal web site. Open source does tend to be more stable software. It's the right way to do things.";

export const DEFAULT_TAGS =
  'javascript, developer, open source, software engineer, preact, react, machine learning, js, barcelona, spain';

export const DEFAULT_IMAGE = 'https://aralroca.com/images/profile_full.jpg';

const SITE_HEAD: HeadTag[] = [
  { tag: 'meta', attrs: { name: 'theme-color', content: '#ad1457' } },
  { tag: 'link', attrs: { rel: 'shortcut icon', href: '/favicon.ico' } },
  { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.json' } },
  {
    tag: 'meta',
    attrs: { name: 'monetization', content: '$ilp.uphold.com/QjjKbnm6Dazp' },
  },
  {
    tag: 'link',
    attrs: {
      rel: 'search',
      href: 'https://aralroca.com/search.xml',
      type: 'application/opensearchdescription+xml',
      title: 'Aral Roca',
    },
  },
  {
    tag: 'link',
    attrs: {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Aral Roca',
      href: 'https://aralroca.com/rss.xml',
    },
  },
];

type SiteMeta = PageMeta & { keywords?: string };

/** Site-wide head + social defaults, merged with each page's own meta. */
export default function pageMeta({
  head = [],
  keywords,
  ...meta
}: SiteMeta = {}): PageMeta {
  return {
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    twitter: { creator: '@aralroca' },
    ...meta,
    head: [
      {
        tag: 'meta',
        attrs: { name: 'keywords', content: keywords ?? DEFAULT_TAGS },
      },
      ...SITE_HEAD,
      ...head,
    ],
  };
}
