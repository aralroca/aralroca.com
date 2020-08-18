import Link from 'next/link'

export default function PostInfo({ date, timeToRead, hideAuthor }) {
  const authorElement = hideAuthor
    ? null
    : <>{`by `}<Link href="/"><a>aralroca</a></Link>{` on `}</>

  return (
    <p className="post-info">
      {authorElement}
      {`${date} • ${timeToRead.text}`}
    </p>
  )
}