import { Image } from 'janux';
import postImageTransition from '@/utils/postImageTransition';
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
    >
      <div class="image-wrapper">
        <Image
          height={50}
          width={110}
          src={metadata.cover_image_mobile}
          alt={metadata.title}
          style={{ viewTransitionName: postImageTransition(slug) }}
        />
      </div>
      <div class="info">
        <h2>{metadata.title}</h2>
        {PostInfo({ timeToRead, date, hideAuthor: true })}
      </div>
    </a>
  );
}
