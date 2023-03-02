export default function Newsletter() {
  return (
    <form
      className="newsletter"
      action="https://aralroca.us8.list-manage.com/subscribe/post?u=29d99171aa3f671bde658475a&amp;id=9f1a0b31e3"
      method="post"
      target="_blank"
      noValidate
    >
      <h2>Subscribe to new posts! 📩</h2>
      <input
        type="email"
        defaultValue=""
        aria-label="Email address"
        name="EMAIL"
        id="mce-EMAIL"
        placeholder="Email address"
        required
      />
      <button>Subscribe</button>
    </form>
  )
}
