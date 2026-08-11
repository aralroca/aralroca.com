import pageBadges from 'js-paging';

export const ITEMS_PER_PAGE = 10;

/** The ?q= that clicking `tag` should lead to: toggles it in or out. */
export function toggledQuery(q: string, tag: string): string {
  const tags = q.split(' ').filter(Boolean);
  const active = tags.some((t) => t.toLowerCase() === tag.toLowerCase());
  const next = active
    ? tags.filter((t) => t.toLowerCase() !== tag.toLowerCase())
    : [...tags, tag];

  return next.join(' ');
}

export function Paginator({ state, derived, intents }: any) {
  const pages = Math.ceil(derived.filtered.length / ITEMS_PER_PAGE);

  if (pages <= 1) return null;

  return (
    <div class="paginator">
      {pageBadges({ currentPage: state.page, pages }).map(
        (num: number | null, index: number) =>
          num ? (
            <a
              key={`page-${num}`}
              href={`/blog?q=${state.q}&page=${num}`}
              onClick={intents.goPage.with({ page: num })}
              class={`badge ${num === state.page ? 'current' : ''}`}
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
  );
}

export function Tag({ label, q, intents }: any) {
  const isActive = q
    .split(' ')
    .some((t: string) => t.toLowerCase() === label.toLowerCase());
  const href = `/blog?q=${toggledQuery(q, label)}`;

  return (
    <a
      href={href}
      onClick={intents.toggleTag.with({ tag: label })}
      class={`tag ${isActive ? 'active' : ''}`}
    >
      {label}
    </a>
  );
}
