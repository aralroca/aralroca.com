import Link from 'next/link'
import fs from 'fs'

export default function Blog({ posts }) {
  return (
    <div>{posts.map(slug => {
      return (
        <div key={slug}>
          <Link href={"/blog/" + slug}>
            <a>{"/blog/" + slug}</a>
          </Link>
        </div>
      );
    })}</div>
  )
}

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");
  return {
    props: {
      posts: files.map(filename => filename.replace(".md", ""))
    }
  }
}
