import fs from 'node:fs';
import path from 'node:path';
import { Image, notFound, type PageMeta } from 'janux';

import BlogSeries from '@/components/BlogSeries';
import Newsletter from '@/components/Newsletter';
import PostInfo from '@/components/PostInfo';
import PostItem from '@/components/PostItem';
import pageMeta from '@/seo';
import addCustomPostWidgets from '@/utils/addCustomPostWidgets';
import clearPage from '@/utils/clearPage';
import getCanonical from '@/utils/getCanonical';
import getMorePosts from '@/utils/getMorePosts';
import readPost from '@/utils/readPost';

const POSTS_PATH = path.join(process.cwd(), 'src', 'posts');

type Params = { params: { slug: string } };

const exists = (slug: string) =>
  fs.existsSync(path.join(POSTS_PATH, `${slug}.md`));

/** Enumerates the concrete pages: the static prerender and the sitemap read this. */
export const staticParams = () =>
  fs.readdirSync(POSTS_PATH).map((file) => ({ slug: clearPage(file) }));

export function meta({ params }: Params): PageMeta {
  if (!exists(params.slug)) return {};
  const { data } = readPost(params.slug);
  const url = getCanonical(`/blog/${params.slug}`);

  return pageMeta({
    title: data.title,
    description: data.description,
    canonical: data.canonical || url,
    image: `https://aralroca.com${data.cover_image}`,
    keywords: data.tags,
    og: { type: 'article', url },
    head: [{ tag: 'meta', attrs: { name: 'twitter:widgets:theme' } }],
  });
}

export default async function Post({ params }: Params) {
  const { slug } = params;

  if (!exists(slug)) notFound();
  const post = readPost(slug);
  const [morePosts, series] = await getMorePosts(post, slug);
  const __html = await addCustomPostWidgets(post.__html);
  const { data, timeToRead, date } = post;
  const tags = data.tags.split(',');

  return (
    <>
      <div
        key={slug}
        style={{ '--cover-color': data.cover_color }}
        class="cover-image"
      >
        <Image
          priority
          src={data.cover_image}
          alt={data.title}
          width={840}
          aspectRatio="960/432"
          sizes="(max-width: 920px) 100vw, 840px"
          style={{ viewTransitionName: `img:${slug}` }}
        />
      </div>
      <h1 style={{ viewTransitionName: `title:${slug}` }} class="post-title">
        {data.title}
      </h1>
      <PostInfo date={date} timeToRead={timeToRead} />
      <div class="tags" style={{ marginBottom: 30 }}>
        {tags.map((tag: string) => (
          <a key={tag} href={`/blog?q=${tag}`} class="tag">
            {tag}
          </a>
        ))}
      </div>
      <BlogSeries
        key="series-top"
        title={data.series}
        series={series}
        currentSlug={slug}
      />
      <div class="post" dangerHTML={__html} />
      <BlogSeries
        style={{ marginTop: 40 }}
        key="series-bottom"
        title={data.series}
        series={series}
        currentSlug={slug}
      />
      <div class="end-post">
        {data.dev_to && (
          <>
            <a
              href={`https://dev.to/aralroca/${data.dev_to}#comments`}
              rel="noopener noreferrer"
              target="_blank"
              title="Discuss on Dev.to"
            >
              Discuss on Dev.to
            </a>
            <span> • </span>
          </>
        )}
        <a
          href={`https://twitter.com/search?q=${encodeURI(
            `https://aralroca.com/blog/${slug}`,
          )}`}
          rel="noopener noreferrer"
          target="_blank"
          title="Discuss on Twitter"
        >
          Discuss on Twitter
        </a>
        <span> • </span>
        <a
          href={`https://github.com/aralroca/aralroca.com/blob/master/src/posts/${slug}.md`}
          rel="noopener noreferrer"
          target="_blank"
          title="Edit post on GitHub"
        >
          Edit on GitHub
        </a>
      </div>
      <Newsletter />
      {morePosts.length > 0 && (
        <div style={{ marginBottom: 50 }}>
          <b class="related-posts-title">More...</b>
          {morePosts.map((p: any) => (
            <PostItem key={p.slug} {...p} />
          ))}
        </div>
      )}
    </>
  );
}
