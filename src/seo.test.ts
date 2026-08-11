import { describe, expect, it } from 'bun:test';
import pageMeta, { DEFAULT_DESCRIPTION, DEFAULT_TAGS } from './seo';

const headContent = (meta: ReturnType<typeof pageMeta>, name: string) =>
  meta.head?.find((tag) => tag.attrs?.name === name)?.attrs?.content;

describe('pageMeta', () => {
  it('applies the site-wide defaults', () => {
    const meta = pageMeta({ title: 'Aral Roca' });

    expect(meta.description).toBe(DEFAULT_DESCRIPTION);
    expect(meta.image).toBe('https://aralroca.com/images/profile_full.jpg');
    expect(meta.twitter).toEqual({ creator: '@aralroca' });
    expect(headContent(meta, 'keywords')).toBe(DEFAULT_TAGS);
    expect(headContent(meta, 'theme-color')).toBe('#ad1457');
  });

  it('lets a page override description, image and keywords', () => {
    const meta = pageMeta({
      description: 'A post',
      image: '/cover.jpg',
      keywords: 'ai, rust',
    });

    expect(meta.description).toBe('A post');
    expect(meta.image).toBe('/cover.jpg');
    expect(headContent(meta, 'keywords')).toBe('ai, rust');
  });

  it('appends page-specific head tags after the site ones', () => {
    const meta = pageMeta({
      head: [{ tag: 'meta', attrs: { name: 'twitter:widgets:theme' } }],
    });

    expect(meta.head?.at(-1)?.attrs?.name).toBe('twitter:widgets:theme');
  });
});
