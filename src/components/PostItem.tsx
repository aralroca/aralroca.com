import PostInfo from './PostInfo';

type Props = {
  slug: string;
  metadata: {
    title: string;
    description: string;
    cover_image_mobile: string;
  };
  date: string;
  timeToRead: { text: string };
};

export default function PostItem({ slug, metadata, date, timeToRead }: Props) {
  return (
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
  );
}
