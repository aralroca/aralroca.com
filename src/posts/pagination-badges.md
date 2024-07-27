---
title: How to create pagination badges
created: 05/13/2020
description: Learn how to re-use pagination badges logic in all your projects.
tags: javascript, react
cover_image: /images/cover-images/9_cover_image.jpg
cover_image_mobile: /images/cover-images/9_cover_image_mobile.jpg
cover_color: '#4B2017'
dev_to: how-to-create-pagination-badges-4mh0
---

The purpose of this short article is to share a helper function to create typical paging badges. I have used this helper on several places and I think it can be useful for anyone who needs it.

<img src="/images/blog-images/39.gif" alt="Example of paging badges" class="center" />

The helper accepts a list of 3 options:

- `currentPage` - The current page, which will determine how badges are displayed with separators.
- `pages` - Total number of pages to display.
- `numBadges` (optional). Number of badges to be generated, by default is 5.

It returns an array with the badges as `number`, filling `null` for the separators. This is implemented this way (in pure JavaScript instead of returning for example JSX) to reuse it everywhere: (P)React, Vue, Svelte, Angular... Even in Node or Deno.

```js
export default function pagesBadges({ currentPage, pages, numBadges = 5 }) {
  const maxBadgesSide = numBadges - 2

  // Without separators case
  // ex: [1, 2, 3, 4, 5]
  if (pages <= numBadges) {
    return Array.from({ length: pages }).map((v, i) => i + 1)
  }

  const sideBadges = Array.from({ length: numBadges - 1 })

  // With a separator at the end case
  // ex: [1, 2, 3, 4, null, 49]
  if (currentPage <= maxBadgesSide) {
    return [...sideBadges.map((v, i) => i + 1), null, pages]
  }

  // With a separator at the beginning case
  // ex: [1, null, 46, 47, 48, 49]
  if (currentPage > pages - maxBadgesSide) {
    return [1, null, ...sideBadges.map((v, i) => pages - i).reverse()]
  }

  // In the middle (separator left + right) case
  // ex: [1, null, 26, 27, 28, null, 49]
  sideBadges.pop()
  const curr = Math.floor(sideBadges.length / 2)
  const center = sideBadges.map((v, i) => currentPage - curr + i)

  return [1, null, ...center, null, pages]
}
```

I've published the code in GitHub (~200 bytes) in case that you want to use it in your projects:

- https://github.com/aralroca/js-paging

This code is not providing any UI component, but it gives you the logic. With it you'll be able to create your paging component with the library/framework you want, to your liking. This partly offers a lot of flexibility in terms of design.

## Example of usage in React

Sandbox using the paging module in React:

<iframe
  src="https://codesandbox.io/embed/js-paging-j4hvd?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="js-paging"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
