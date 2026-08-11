type Props = {
  date: string;
  timeToRead: { text: string };
  hideAuthor?: boolean;
};

export default function PostInfo({ date, timeToRead, hideAuthor }: Props) {
  const authorElement = hideAuthor ? null : (
    <>
      {`by `}
      <a href="/">aralroca</a>
      {` on `}
    </>
  );

  return (
    <time dateTime={date} class="post-info">
      {authorElement}
      {`${date} • ${timeToRead.text.replace(/ /g, '\u00A0')}`}
    </time>
  );
}
