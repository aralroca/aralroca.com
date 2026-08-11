import pageMeta from '@/seo';

export const meta = pageMeta({ title: 'Aral Roca', robots: 'noindex' });

export default function Page404() {
  return (
    <div class="page-404">
      <h1>404</h1>
      <h2>This page could not be found.</h2>
    </div>
  );
}
