export default function ctx(req: Request) {
  return { url: new URL(req.url) };
}
