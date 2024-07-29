import pageBadges from 'js-paging';
import type { WebContext } from 'brisa';
import filterSearch from '@/utils/filterSearch';
import type { Post } from '@/utils/getAllPosts';

const itemsPerPage = 10;

export default function PostList(
  { tags }: { tags: string[] },
  { store, params, derived }: WebContext,
) {
  const filteredPosts = derived(() =>
    params.value?.q
      ? store.get<any>('posts').filter(filterSearch(params.value?.q))
      : store.get<any>('posts'),
  );
  const currentPage = derived(() => Number(params.value?.page || 1));
  const pages = derived(() =>
    Math.ceil(filteredPosts.value?.length / itemsPerPage),
  );
  const postsToShow = derived(() => {
    const lastIndex = itemsPerPage * currentPage.value;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredPosts.value?.slice(firstIndex, lastIndex);
  });

  return (
    <>
      <div class="blog-page-content">
        <div class="posts-box">
          <div class="blog-title">
            <slot name="title" />
            <div>{filteredPosts.value?.length} posts</div>
          </div>

          {postsToShow.value?.map?.(
            ({ slug, metadata, date, timeToRead }: Post) => (
              <a
                href={`/blog/${slug}`}
                key={slug}
                class="post-list-item"
                title={metadata.description}
                aria-label={metadata.description}
              >
                <div class="image-wrapper">
                  <img
                    loading="lazy"
                    height={50}
                    width={110}
                    src={metadata.cover_image_mobile}
                    alt={metadata.title}
                    style={{ viewTransitionName: 'img:' + slug }}
                  />
                </div>
                <div class="info">
                  <h2 style={{ viewTransitionName: 'title:' + slug }}>
                    {metadata.title}
                  </h2>
                  {PostInfo({ timeToRead, date, hideAuthor: true })}
                </div>
              </a>
            ),
          )}

          {pages.value > 1 && (
            <div class="paginator">
              {pageBadges({
                currentPage: currentPage.value,
                pages: pages.value,
              }).map((num: number, index: number) =>
                num ? (
                  <a
                    key={`page-${num}`}
                    href={`/blog?q=${params.value?.q || ''}&page=${num}`}
                    class={`badge ${num === currentPage.value ? 'current' : ''}`}
                  >
                    {num}{' '}
                  </a>
                ) : (
                  <span key={`separator-${index}`} class="separator">
                    ...
                  </span>
                ),
              )}
            </div>
          )}

          {filteredPosts.value?.length === 0 && (
            <div style={{ marginTop: 50, textAlign: 'center' }}>
              Can't find what you're looking for? Try using{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/search?q=site%3Aaralroca.com+${params.value.q}`}
              >
                Google
              </a>
              .
            </div>
          )}
        </div>

        <aside class="searcher-box">
          <div class="sticky">
            <input
              class="post-searcher"
              value={params.value?.q ?? ''}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                const q = input.value;
                history.replaceState(null, '', `/blog?q=${q}`);
              }}
              aria-label="Search posts"
              placeholder="Search posts"
              type="text"
            />
            <div class="tags" style={{ marginTop: 10 }}>
              {tags.map((tag) =>
                Tag({
                  key: tag,
                  label: tag,
                  q: params.value?.q ?? '',
                }),
              )}
            </div>
            <slot name="newsletter" />
          </div>
        </aside>
      </div>
    </>
  );
}

function PostInfo({
  date,
  timeToRead,
  hideAuthor,
}: { date: string; timeToRead: { text: string }; hideAuthor?: boolean }) {
  const authorElement = hideAuthor ? null : (
    <>
      {`by `}
      <a href="/">aralroca</a>
      {` on `}
    </>
  );

  return (
    <time datetime={date} class="post-info">
      {authorElement}
      {`${date} • ${timeToRead.text.replace(/ /g, '\u00A0')}`}
    </time>
  );
}

function Tag({
  key,
  label,
  q = '',
}: {
  label: string;
  key?: string;
  q: string;
}) {
  const tag = label.toLowerCase();
  const pathname =
    typeof window === 'undefined' ? '' : new URL(location.href).pathname;
  const tags = q.split(' ').map((t) => t.toLowerCase());
  const isActive = tags.includes(tag);
  let href = `/blog?q=${label}`;

  if (pathname === '/blog') {
    href = q ? `${pathname}?q=${q}+${label}` : `/blog?q=${label}`;
  }

  if (isActive) {
    const q = tags.filter((t) => t !== tag).join('+');
    href = q ? `/blog?q=${q}` : '/blog';
  }

  function onTag(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    history.replaceState(null, '', href);
  }

  return (
    <a
      key={key}
      onClick={onTag}
      href={href}
      class={`tag ${isActive ? 'active' : ''}`}
    >
      {label}
    </a>
  );
}
