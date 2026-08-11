/**
 * The view-transition-name shared by a post's list thumbnail and its cover, so
 * navigating between the list and the post morphs the image. Must be a valid
 * CSS ident: slugs can carry dots (`next-translate-1.0`), which are not.
 */
export default function postImageTransition(slug: string): string {
  return `post-img-${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}
