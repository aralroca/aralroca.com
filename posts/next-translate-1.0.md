---
title: Next-translate - Version 1.0 Released
created: 12/07/2020
description: Next-translate is an i18n library to keep the translations as simple as possible in a Next.js environment. Today we announce the release of version 1.0.
tags: nextjs, javascript, react, i18n
cover_image: /images/cover-images/20_cover_image.jpg
cover_image_mobile: /images/cover-images/20_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/20_cover_image_vert.jpg
cover_color: '#EFECEC'
canonical: https://dev-blog.vinissimus.com/next-translate-1.0
---

Today is the day. The Vinissimus Team is very proud and happy to announce the much-anticipated [version 1.0](https://github.com/vinissimus/next-translate/releases/tag/1.0.0) of [Next-translate](https://github.com/vinissimus/next-translate) library. It's been a year since the first [version 0.1](https://aralroca.com/blog/next-translate-released) and a lot happened _(+160 closed issues)_.

<iframe class="center youtube" src="https://www.youtube.com/embed/QnCIjjYLCfc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div align="center"><small>Showing version 1.0 when it was experimental</small></div>

## What is Next-translate?

[Next-translate](https://github.com/vinissimus/next-translate) is a library to keep the translations as simple as possible in a Next.js environment. It arose from the need in [Vinissimus](https://www.vinissimus.com) to reduce the bundle size when we realized that the [next-i18next](https://github.com/isaachinman/next-i18next) library we used occupied 20 times more than Preact. We decided to create our own library with clear goals. In addition, we took advantage of this to support SSG, since next-i18next required the translations to be loaded into a getInitialProps, sacrificing automatic page optimization.

### Goals

- Being a small i18n library (~1kb).
- Cover the i18n basics: interpolation, plurals, Trans component, t function, nested translations, fallbacks...
- Only load the necessary translations for each page and language. If you navigate to `/en/about`, just load the `about` namespace in English.
- Support automatic page optimization (SSG).
- ∫Make it easy to integrate translations on pages.
- Make it easy to migrate to future changes in the Next.js core.

## What does version 1.0 provide?

### Next.js plugin

Last year, to achieve the goals of the previous point, we had to create a workaround by doing a "build step" to generate the static pages with all the languages. We had to work in a different directory than "pages". It worked, but it was a bit uncomfortable. Today, in version 1.0, we have been able to remove this workaround while maintaining all the goals.

Now, the Next.js plugin is the new toy. It is responsible for loading the necessary translations on each page through a webpack loader. This way, you don't have to write on each page a getStaticProps, getServerSideProps or any other method you want to use to load the translations. The plugin will take care of it by overwriting the method you have or using a default one (getStaticProps).

<a href="/images/blog-images/example-next-translate-plugin.png">
  <figure align="center">
    <img class="center" src="/images/blog-images/example-next-translate-plugin.png" alt="Labelai logo" />
    <figcaption><small>Working with Next-translate 1.0</small></figcaption>
  </figure>
</a>

The plugin is needed to cover the last two goals mentioned in the previous point:

- Make it easy to integrate translations on pages.
- Make it easy to migrate to future changes in the Next.js core.

### Improve plurals support

In version `0.x` the support of plurals was quite simple. Now with `1.0` we've [improved the support](https://github.com/vinissimus/next-translate/tree/1.0.0#5-plurals) by adding 6 plural forms (taken from [CLDR Plurals page](http://cldr.unicode.org/index/cldr-spec/plural-rules)):

- `zero`
- `one` (singular)
- `two` (dual)
- `few` (paucal)
- `many` (also used for fractions if they have a separate class)
- `other` (required—general plural form—also used if the language only has a single form)

## Useful links

- [How to start with Next-translate 1.0](https://github.com/vinissimus/next-translate/tree/1.0.0#2-getting-started)
- [Migration guide 0.x to 1.0](https://github.com/vinissimus/next-translate/blob/1.0.0/docs/migration-guide-1.0.0.md)
- [Release 1.0 notes](https://github.com/vinissimus/next-translate/releases/tag/1.0.0)
- [Examples with Next-translate 1.0](https://github.com/vinissimus/next-translate/tree/1.0.0/examples)

## Contributors

During 2020, +20 people contributed to the Next-translate codebase, implementing new features, fixing bugs and issues, writing documentation, and so on. The Vinissimus team would like to thank all of you who helped us build Next-translate to become what it is today.

[@vincentducorps](https://github.com/vincentducorps), [@giovannigiordano](https://github.com/giovannigiordano), [@dnepro](https://github.com/dnepro),
[@BjoernRave](https://github.com/BjoernRave), [@croutonn](https://github.com/croutonn), [@justincy](https://github.com/justincy), [@YannSuissa](https://github.com/YannSuissa), [@thanhlmm](https://github.com/thanhlmm), [@stpch](https://github.com/stpch), [@shunkakinoki](https://github.com/shunkakinoki), [@rekomat](https://github.com/rekomat), [@psanlorenzo](https://github.com/psanlorenzo), [@pgrimaud](https://github.com/pgrimaud), [@lone-cloud](https://github.com/lone-cloud), [@kidnapkin](https://github.com/kidnapkin), [@hibearpanda](https://github.com/hibearpanda), [@ftonato](https://github.com/ftonato), [@dhobbs](https://github.com/dhobbs), [@bickmaev5](https://github.com/bickmaev5), [@Faulik](https://github.com/Faulik), [@josephfarina](https://github.com/josephfarina), [@gurkerl83](https://github.com/gurkerl83), [@aralroca](https://github.com/aralroca)
