import { boot } from 'janux/client';
import { ChangeTheme } from '@/islands/change-theme';
import { PostList } from '@/islands/post-list';

boot({ defs: [ChangeTheme, PostList] });
