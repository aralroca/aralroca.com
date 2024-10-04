import fs from 'node:fs';
import path from 'node:path';
import { dangerHTML, type RequestContext } from 'brisa';
import type { MatchedRoute } from 'bun';

import BlogSeries from '@/components/BlogSeries';
import Newsletter from '@/components/Newsletter';
import PostInfo from '@/components/PostInfo';
import PostItem from '@/components/PostItem';
import addCustomPostWidgets from '@/utils/addCustomPostWidgets';
import clearPage from '@/utils/clearPage';
import getMorePosts from '@/utils/getMorePosts';
import readPost from '@/utils/readPost';
import getCanonical from '@/utils/getCanonical';

export default async function Post({}, { store, route }: RequestContext) {
  const { slug } = route.params;
  const { data, date, morePosts, series, __html, tags, timeToRead } =
    store.get('post');

  return (
    <>
      <div
        key={slug}
        style={{ '--cover-color': data.cover_color }}
        class="cover-image"
      >
        <img
          loading="eager"
          src={data.cover_image}
          style={{ viewTransitionName: 'img:' + slug, aspectRatio: '960/432' }}
        />
      </div>
      <h1 style={{ viewTransitionName: 'title:' + slug }} class="post-title">
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
      <BlogSeries key="series-top" title={data.series} series={series} />
      <div class="post">{dangerHTML(__html)}</div>
      <BlogSeries
        style={{ marginTop: 40 }}
        key="series-bottom"
        title={data.series}
        series={series}
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
          href={`https://github.com/aralroca/aralroca.com/blob/master/posts/${slug}.md`}
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

async function loadPostData(route: MatchedRoute) {
  const {
    params: { slug },
  } = route;
  const post = readPost(slug);
  const [morePosts, series] = await getMorePosts(post, slug);
  const __html = await addCustomPostWidgets(post.__html);
  const { data, timeToRead, date } = post;
  const tags = data.tags.split(',');

  return { data, date, morePosts, series, __html, tags, timeToRead };
}

export async function Head({}, { store, route }: RequestContext) {
  const post = await loadPostData(route);
  const { data } = post;

  store.set('post', post);

  // TODO: Remove styles after this issue:
  // https://github.com/brisa-build/brisa/issues/156#issuecomment-2228440081
  return (
    <>
      <link
        id="canonical"
        rel="canonical"
        href={data?.canonical || getCanonical(route.pathname)}
      />
      <title id="title">{data.title}</title>
      <meta id="meta-title" name="title" content={data.title} />
      <meta
        id="meta-description"
        name="description"
        content={data.description}
      />
      <meta name="twitter:widgets:theme" />
      <meta id="meta-keywords" name="keywords" content={data.tags} />
      <meta id="meta-twitter-title" name="twitter:title" content={data.title} />
      <meta id="og:type" property="og:type" content="article" />
      <meta
        id="meta-og-image"
        property="og:image"
        content={'https://aralroca.com' + data.cover_image}
      />
      <meta id="meta-og:title" property="og:title" content={data.title} />
      <meta
        id="meta-og:description"
        property="og:description"
        content={data.description}
      />
    </>
  );
}

export const prerender = async () => {
  const POST_PATH = path.join(process.cwd(), 'src', 'posts');
  const files = fs.readdirSync(POST_PATH).map(clearPage);
  return files.map((slug) => ({ slug }));
};
