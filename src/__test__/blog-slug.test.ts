import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { meta, staticParams } from '@/routes/blog/[slug]';

const POSTS_PATH = path.join(process.cwd(), 'src', 'posts');

describe('blog [slug] route', () => {
  it('staticParams enumerates every post', () => {
    const slugs = staticParams().map(({ slug }) => slug);
    const files = fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith('.md'));

    expect(slugs.length).toBe(files.length);
    expect(slugs).toContain('etiketai');
    expect(slugs.every((slug) => !slug.endsWith('.md'))).toBe(true);
  });

  it('meta derives the canonical from the slug', () => {
    const result = meta({ params: { slug: 'etiketai' } });

    expect(result.canonical).toBe('https://aralroca.com/blog/etiketai');
    expect(result.og?.type).toBe('article');
    expect(result.title).toBeTruthy();
    expect(result.description).toBeTruthy();
    expect(result.image).toStartWith('https://aralroca.com/');
  });

  it('meta honors a canonical override from the frontmatter', () => {
    const overridden = staticParams()
      .map(({ slug }) => meta({ params: { slug } }))
      .filter(
        (m) => m.canonical && !m.canonical.startsWith('https://aralroca.com'),
      );

    // The kitmul cross-post declares its canonical on kitmul.com.
    expect(overridden.length).toBeGreaterThan(0);
  });

  it('meta of an unknown slug stays empty (the page 404s)', () => {
    expect(meta({ params: { slug: 'nope-not-a-post' } })).toEqual({});
  });
});
