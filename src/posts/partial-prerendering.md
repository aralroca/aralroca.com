---
title: 'Power of Partial Prerendering with Bun'
created: 03/24/2024
description: Unlock the power of partial pre-rendering with Bun, optimizing web application performance and package size effortlessly.
tags: javascript, bun, react, brisa, experimental
cover_image: /images/cover-images/29_cover_image.jpg
cover_image_mobile: /images/cover-images/29_cover_image_mobile.jpg
cover_color: '#0B1B2B'
dev_to: power-of-partial-prerendering-with-bun-5f62
---

In modern web development, optimizing the performance of web applications is paramount. One approach gaining traction is **partial prerendering**, a technique that combines static and dynamic content rendering to enhance both the bundle size and runtime speed. In this article, we'll delve into the concept of partial prerendering and explore its benefits, especially when implemented through Ahead of Time ([AOT](https://en.wikipedia.org/wiki/Ahead-of-time_compilation)) rendering.

Also, we will see how to do it with a Bun plugin and be able to apply it in every JSX framework in an easy way.

## How Partial Prerendering Works

Working with JSX components we have usually generated static and/or dynamic pages. Some frameworks allow you to prerender static pages during compilation, which significantly improves initial load times. However, most routes are not fully static or dynamic. You may have a route that has both static and dynamic content.

Partial prerendering (PPR) involves rendering static components during build-time and deferring the rendering of dynamic components to runtime. This means that instead of rendering all components dynamically, some components are pre-rendered as HTML during the build process.

Thinking about server-side rendering (SSR), in many cases, we have completely static components, such as the header, footer, etc., and we can save the milliseconds of rendering of these components if we only prerender once in build-time and then do not have to repeat the rendering for each request.

The blue part is the run-time rendering time:

<figure align="center">
    <img src="/images/blog-images/partial-prerendering.gif" alt="with partial prerender">
    <figcaption><small>render vs partial prerender</small></figcaption>
</figure>

There are also cases in even the data that we consume in the components can be static, imagine that we want to show in our e-commerce homepage static data sections where you have to hardcode a JSON file with this data to make it faster, however:

- It's needed to parse the JSON and render the component.
- We have duplicate data between the database and the hardcoded data.

In this case, we could directly request them from the source without having them hardcoded and prerender the component ahead of time to save milliseconds of parsing and rendering.

### Benefits

- Smaller Bundle Size
- Faster Runtime Rendering
- Less resources spent on each request
- Better UX
- Better SEO

## Macros

Bun introduces the idea of [Macros](https://bun.sh/docs/bundler/macros) into JavaScript. Macros are a new paradigm that allows optimizations ahead of time just by adding an [import attribute](https://github.com/tc39/proposal-import-attributes).

```tsx
import { random } from './random.ts' with { type: 'macro' };

console.log(`Your random number is ${random()}`);
```

By adding this import attribute `macro`, the macro runs this `random` function at bundle-time. The value returned from these functions is directly inlined into your bundle.

Well, this allows things like static data to be requested directly from the source instead of hardcoding it and passing the work ahead of time. The bundler performs dead code elimination after running the macro, then we will have a smaller bundle size. However, can we directly prerender components with the macro?

Well, for the communication between the Bun transpiler and the macro the data has to be serialized, so not all data is supported, only this is supported:

- [JSON-compatible](https://en.wikipedia.org/wiki/JSON) data structures
- [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

As far as we can see, functions as a data structure are not supported, and **components are functions**! so, can we prerender a component from a macro?

The answer is yes, but not in an elegant way using Bun's macro. You have to pass the absolute path string where the component is located and from the macro import it, render it, and pass the resulting JSX with the html string injection.

<figure align="center">
    <img width="128px" height="128px" src="/images/blog-images/bunbum.webp" alt="Bun bum!">
</figure>

The purpose of this article is not to explain in detail how to do it through a Bun macro because it would be too cumbersome for developers to have to do this every time they want to prerender a component. However, read on, because now thanks to a Bun plugin you can integrate it in an easy way.

## Prerender Macro

Last summer I started Brisa, an experimental framework, and I hope to make it public this summer. One of the features I had in mind for a long time is to be able to make hybrid pages between static and dynamic and it would be very easy to use. When I discovered the idea of Bun macros, the first thing that came to my mind was that something similar had to exist to prerender the components, now I have made public this Bun plugin so that all JSX frameworks can use this feature.

Today I release [Prerender Macro](https://github.com/aralroca/prerender-macro) Bun plugin. As of today, partial hydration can be managed with Bun as follows:

```tsx
import StaticComponent from "@/static-component" with { type: "prerender" };
import DynamicComponent from "@/dynamic-component";

return (
  <>
    <StaticComponent foo="bar" />
    <DynamicComponent />
  </>
);
```

I invite you to try the [demos](#demos).

<a href="https://github.com/aralroca/prerender-macro/tree/main/examples/react">
<figure align="center">
    <img src="/images/blog-images/partial-prerender.gif">
    <figcaption><small>Example with React and <code>prerender-macro</code></small></figcaption>
</figure>
</a>

## Next steps

The concept of PPR is not something new, recently Vercel together with people from React and Next.js has made it [possible to do it](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model#try-ppr-on-vercel-today) based on `Suspense` components and have the static part served on the nearest edge. It's a brilliant idea.

With [Prerender Macro](https://github.com/aralroca/prerender-macro) I add my grain of sand to open-source so that it can be combined or can be used in other contexts differently, because for version 0.1 it injects the HTML into the JSX tree itself, instead of fetching it from the edge. However, I would like for future versions to generate the infrastructure as code (IaC) to connect to the necessary cloud (Vercel, or others that implement PPR). Now that the library is open-source any contribution in this regard will be very welcome.

## Demos

There are demos for [Brisa](https://github.com/aralroca/prerender-macro/tree/main/examples/brisa), [React](https://github.com/aralroca/prerender-macro/tree/main/examples/react) and [Preact](https://github.com/aralroca/prerender-macro/tree/main/examples/preact). But feel free to [add](https://github.com/aralroca/prerender-macro/fork) more JSX frameworks to help people understand the plugin configuration they need to adapt to the framework.

<figure align="center">
    <img src="/images/blog-images/we-got-it.jpg">
      <figcaption><small>Photo by Clay Banks on Unsplash</small></figcaption>
</figure>

For further updates on the Brisa framework and more, [subscribe](https://aralroca.com/blog/partial-prerendering#demos) to my blog newsletter today!

## References

- [Prerender Macro GitHub repository](https://github.com/aralroca/prerender-macro)
- [Examples of Prerender Macro](https://github.com/aralroca/prerender-macro/tree/main/examples)
- [Partial Prerendering in Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering)
- [Partial Prerendering Vercel](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model#try-ppr-on-vercel-today)
