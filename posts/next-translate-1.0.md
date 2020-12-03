---
title: Next-translate - Version 1.0 Released
created: 12/07/2020
description: Next-translate is an i18n library to keep the translations as simple as possible in a Next.js environment. Today we announce the release of version 1.0.
tags: nextjs, javascript, react, i18n
cover_image: /images/cover-images/20_cover_image.jpg
cover_image_mobile: /images/cover-images/20_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/20_cover_image_vert.jpg
cover_color: '#EFECEC'
canonical: https://prova.com
---

Today is the day. The Vinissimus Team is very proud and happy to announce the much-anticipated [version 1.0](https://github.com/vinissimus/next-translate/releases/tag/1.0.0) of [Next-translate](https://github.com/vinissimus/next-translate) library. Besides, we also announced that just [a year ago](https://aralroca.com/blog/next-translate-released) we released the first version `0.1`, and now, a year later we finally released `1.0`.

<iframe class="center youtube" src="https://www.youtube.com/embed/QnCIjjYLCfc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div align="center"><small>Showing version 1.0 when it was experimental</small></div>

## What is Next-translate?

[Next-translate](https://github.com/vinissimus/next-translate) is a library to keep the translations as simple as possible in a Next.js environment. It arose from the need in [Vinissimus](https://www.vinissimus.com) to reduce the bundle size and to realize that the [next-i18next](https://github.com/isaachinman/next-i18next) library we used occupied 20 times more than Preact. So we decided to create our own library with clear objectives. In addition, we took advantage of this to support SSG, since next-i18next required the translations to be loaded into a getInitialProps, thus dispensing with automatic page optimization.

### Goals

- Being a small i18n library (~1kb)
- Cover the i18n basics: interpolation, plurals, Trans component, t function, nested translations, fallbacks...
- Only load the necessary translations for each page and language. If you navigate to `/en/about`, just load the `about` namespace in English.
- Support SSG pages
- Make it easy to integrate translations on pages
- Make it easy to migrate to future changes in the Next.js core

## What does version 1.0 provide?

### Next.js plugin

To achieve the objectives of the previous point, last year we had to create a workaround, which was to do a "build step" to generate the static pages with all the languages. This meant that we had to work in a different directory than "pages". It works well, but it was a bit uncomfortable. So finally in version 1.0 we have been able to eliminate this workaround while maintaining all the objectives.

The Next.js plugin is the new toy, which is responsible for loading the necessary translations on each page through a webpack loader. This way, you don't have to write on each page a getStaticProps, getServerSideProps or any other method you want to use to load the translations, but the plugin will take care of it by overwriting the method you have or using a default one (getStaticProps).

<a href="/images/blog-images/example-next-translate-plugin.png">
  <figure align="center">
    <img class="center" src="/images/blog-images/example-next-translate-plugin.png" alt="Labelai logo" />
    <figcaption><small>Working with Next-translate 1.0</small></figcaption>
  </figure>
</a>

The need for the plugin is to cover the last two objectives mentioned in the previous point:

- Make it easy to integrate translations on pages
- Make it easy to migrate to future changes in the Next.js core

### Improve plurals support

In version `0.x` the support of plurals was somewhat simple. Now with `1.0` we have [improved the support](https://github.com/vinissimus/next-translate/tree/1.0.0#5-plurals) by adding 6 plural forms (taken from [CLDR Plurals page](http://cldr.unicode.org/index/cldr-spec/plural-rules)):

- `_zero`
- `_one` (singular)
- `_two` (dual)
- `_few` (paucal)
- `_many` (also used for fractions if they have a separate class)
- `_other` (required—general plural form—also used if the language only has a single form)

## Useful links

- [How to start with Next-translate 1.0](https://github.com/vinissimus/next-translate/tree/1.0.0#2-getting-started)
- [Migration guide 0.x to 1.0](https://github.com/vinissimus/next-translate/blob/1.0.0/docs/migration-guide-1.0.0.md)
- [Release 1.0 notes](https://github.com/vinissimus/next-translate/releases/tag/1.0.0)
- [Examples with Next-translate 1.0](https://github.com/vinissimus/next-translate/tree/1.0.0/examples)

## Contributors

During this year 2020, 24 people contributed to the Next-translate codebase, implementing new features, fixing bugs and issues, writing documentation, and so on. The Vinissimus team would like to thank all of you who helped us build Next-translate to become what it is today.
