import Link from 'next/link'

export default function PostInfo({ date, timeToRead, hideAuthor }) {
  const authorElement = hideAuthor
    ? null
    : <>{`by `}<Link href="/">aralroca</Link>{` on `}</>

  return (
    <time dateTime={date} className="post-info">
      {authorElement}
      {`${date} • ${timeToRead.text.replace(/ /g, '\u00A0')}`}
    </time>
  )
}