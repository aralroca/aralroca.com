import { boot } from 'janux/client';
import { ChangeTheme } from '@/islands/change-theme';
import { PostList } from '@/islands/post-list';

/**
 * The blog list resumes on interaction, so a plain visit ships zero island
 * work before LCP. A deep link (?q= / ?page=) must correct the prerendered
 * page-1 HTML though, so only then the island mounts on load.
 */
const params = new URLSearchParams(location.search);

if (params.has('q') || params.has('page')) {
  document
    .querySelector('janux-island[data-jx^="post-list"]')
    ?.setAttribute('data-jx-eager', '');
}

boot({ defs: [ChangeTheme, PostList] });
