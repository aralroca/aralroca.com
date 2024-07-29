import type { RequestContext } from 'brisa';

type Props = {
  title: string;
  key: string;
  series: { title: string; slug: string }[];
  style?: Record<string, string | number>;
};

export default function BlogSeries(
  { key, title, series, style }: Props,
  { route: { query } }: RequestContext,
) {
  if (!series || !series.length) return null;

  return (
    <div key={key} class="blogSeries" style={style}>
      <div class="title">
        {title} ({series.length} Part Series)
      </div>
      {series.map((serie, index) => {
        const title = `${index + 1}) ${serie.title}`;
        const key = `serie-${serie.slug}`;

        if (serie.slug === query.slug) {
          return (
            <div key={key} class="blogSerie active">
              {title}
            </div>
          );
        }

        return (
          <a key={key} href={`/blog/${serie.slug}`} class="blogSerie">
            {title}
          </a>
        );
      })}
    </div>
  );
}
