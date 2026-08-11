type Props = {
  title: string;
  key?: string;
  currentSlug: string;
  series: { title: string; slug: string }[];
  style?: Record<string, string | number>;
};

export default function BlogSeries({ title, series, style, currentSlug }: Props) {
  if (!series || !series.length) return null;

  return (
    <div class="blogSeries" style={style}>
      <div class="title">
        {title} ({series.length} Part Series)
      </div>
      {series.map((serie, index) => {
        const serieTitle = `${index + 1}) ${serie.title}`;
        const serieKey = `serie-${serie.slug}`;

        if (serie.slug === currentSlug) {
          return (
            <div key={serieKey} class="blogSerie active">
              {serieTitle}
            </div>
          );
        }

        return (
          <a key={serieKey} href={`/blog/${serie.slug}`} class="blogSerie">
            {serieTitle}
          </a>
        );
      })}
    </div>
  );
}
