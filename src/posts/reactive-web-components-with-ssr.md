---
title: "Build Reactive Web Components with SSR"
created: 08/24/2024
description: A quick guide on how to build reactive Web Components that work with SSR and with any JavaScript or Vanilla JS framework.
tags: javascript, brisa, bun
cover_image: /images/cover-images/32_cover_image.jpg
cover_image_mobile: /images/cover-images/32_cover_image_mobile.jpg
cover_color: "#212121"
dev_to: build-reactive-web-components-with-ssr-3pb9
---

Traditional way of writing Web Components is not very SSR (Server Side Rendering) friendly. In this post, I show you how you can build reactive Web Components that work with SSR and with any JavaScript framework (Vue, React, Svelte, Solid, Brisa) or Vanilla JS.

- [Introduction](#introduction)
- [Writting a Web Component with Brisa](#writting-a-web-component-with-brisa)
- [Building the Web Component](#building-the-web-component)
- [Loading the Web Component in a Vanilla JS project](#loading-the-web-component-in-a-vanilla-js-project)
- [SSR of the Web Component](#ssr-of-the-web-component)
- [Tell me more about Brisa... Please...](#tell-me-more-about-brisa-please)
- [Note for Web Component library creators](#note-for-web-component-library-creators)
- [Example](#example)
- [Conclusion](#conclusion)

## Introduction

We are going to use [Brisa](https://brisa.build) Web Component Compiler. Brisa is a web framework that, besides being similar to other frameworks like Next.js or Nuxt.js, also allows you to build reactive Web Components that work with signals for reactivity, with JSX and with SSR.

<a href="https://brisa.build" target="_blank" rel="noopener noreferrer">
<figure align="center">
<img width="100" height="100" src="/images/blog-images/brisa.svg" alt="Brisa logo" class="center" />
  <figcaption><small>Brisa logo</small></figcaption>
</figure>
</a>

In order to do this, you only need to know the syntax of Brisa when writing Web Components. Brisa is not yet public as it is currently at **95.48% of the v0.1 routemap**, but we estimate that in 1 month it will be ready for launch and everyone will be able to access it. However, even if it is not public at all, you can already use it to create your own Web Components libraries.

## Writting a Web Component with Brisa

As an example, we are going to write a Web Component of a counter, as always, the classic example.

**counter-wc.tsx**

```tsx
import type { WebContext } from "brisa";

export default function CounterWC(
  { start = 0, color = "#2cebcf" }: { start?: number; color?: string },
  { state, css }: WebContext,
) {
  const count = state(start);

  css`
    button {
      background-color: ${color};
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px;
      margin: 5px;
      cursor: pointer;
    }
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  return (
    <div>
      <button onClick={() => count.value++}>+</button>
      {count.value}
      <button onClick={() => count.value--}>-</button>
    </div>
  );
}
```

Brisa uses the name of the files to know the selector, here the selector would be `counter-wc`.

> **TIP**: Although Brisa is not public yet, you can use TypeScript types to guide you on how to write Web Components.

In the example above, `state` is used to create a signal and then using the `.value` you make it reactive inside the JSX. The props are also special signals, since as they are read-only, the `.value` is not used to make it easier to use and to define default values more easily, this is done through build-time optimizations, similar to React to act as if they were using signals but the other way around.

The `css` template literal allows it to react to reactive changes in this case of the `color` property. This `css` template literal outside of this example is very useful for making reactive animations easily. It is important to remember that Web Components work with Shadow DOM, so the CSS does not affect the rest of the page.

## Building the Web Component

To build the Web Component, you need to run the following command:

```bash
brisa build -w counter-wc.tsx
```

This command will generate 2 files:

```bash
[ wait ]  🚀 building your standalone components...
[ info ]
[ info ]   Standalone components:
[ info ]   - build/counter-wc.client.js (670.00 B)
[ info ]   - build/counter-wc.server.js (842.00 B)
[ info ]
[ info ]   ✨  Done in 42.20ms.
```

These files are not the Web Component, it is only the rendering function of the Web Component optimized at build-time to be as light as possible _(the bytes that come out are without gzip)_.

So, how do we load the Web Component?

## Loading the Web Component in a Vanilla JS project

To do this, you need to add the importmap in the HTML with `brisa/client` and then import the `counter-wc.client.js` file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brisa Web Component Example</title>
    <script type="importmap">
      {
        "imports": {
          "brisa/client": "https://unpkg.com/brisa@latest/client-simplified/index.js"
        }
      }
    </script>
    <script type="module" src="https://unpkg.com/counter-wc@latest"></script>
  </head>
  <body>
    <counter-wc start="15"></counter-wc>
  </body>
</html>
```

Here only the rendering part would be ported in each web component file, while they would all use the same Brisa wrapper defined in the importmap, which is responsible for creating the Web Component with the signals and the shadow DOM.

## SSR of the Web Component

SSR of a Web Component can now be done thanks to [Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom). The `counter-wc.server.js` file has already been compiled with this behavior, so you only need to import it on your server and render it in the HTML and adapt it to your server framework.

Here is an example with Bun.js or Node.js without using JSX:

**ssr.js**

```js
import { renderToString } from "brisa/server";
import { jsx } from "brisa/jsx-runtime";
import CustomCounter from "counter-wc/server";

const html = `
<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Brisa Web Component Example</title>
	<script type="importmap">
	{
		"imports": {
			"brisa/client": "https://unpkg.com/brisa@latest/client-simplified/index.js"
		}
	}
	</script>
	<script type="module" src="https://unpkg.com/counter-wc@latest"></script>
	</head>
	<body>
		${await renderToString(jsx(CustomCounter, { start: 10 }))}
	</body>
</html>
`;

console.log(html);
```

Then run `bun run ssr.js` and you will see the HTML with the rendered web component using the Declarative Shadow DOM.

## Tell me more about Brisa... Please...

The integration of these Web Component libraries with Brisa is done through a configuration file:

```tsx
import type { WebComponentIntegrations } from "brisa";

export default {
  "custom-counter": {
    client: "./path/to/web-component.client.js",
    server: "./path/to/web-component.server.js",
    types: "./path/to/web-component.types.d.ts",
  },
} satisfies WebComponentIntegrations;
```

In this way, SSR and TypeScript types are automatically integrated into your project. And you can use the Web Component in any Server Component or within another Web Component.

<img src="/images/blog-images/types.gif" alt="Typescript types" />

If you are interested in knowing more, I invite you to subscribe to the [Brisa newsletter](https://brisa.build) to receive the latest news and updates on Brisa. We estimate that by the end of September it will be ready for launch.

## Note for Web Component library creators

We encourage you to try Brisa to create your own Web Component libraries. If you put the "made with Brisa" badge, we will put a link to your library on the Brisa page.

<a href="https://brisa.build" target="_blank" rel="noopener noreferrer">
  <img width="150" height="42" src="/images/blog-images/brisa_badge.svg" alt="Made with Brisa" />
</a>

```html
<a href="https://brisa.build" target="_blank" rel="noopener noreferrer">
  <img
    width="150"
    height="42"
    src="https://aralroca.com/images/blog-images/brisa_badge.svg"
    alt="Made with Brisa"
  />
</a>
```

## Example

If you want to see the GitHub repository of the example of the counter that we have explained in this article, you can take a look and use it as a reference for your own creations:

- https://github.com/aralroca/counter-wc

## Conclusion

In this post, we have seen how to build reactive Web Components that work with SSR and with any JavaScript framework or Vanilla JS. We have used Brisa to build the Web Component and we have seen how to load it in a Vanilla JS project and how to do SSR with it.

I hope you have enjoyed this post and that you have learned something new. If you have any questions, do not hesitate to ask me in the comments below. I will be happy to help you.

Happy coding and enjoy the rest of the summer! 🌞🌴

<figure align="center">
<img width="400" height="400" src="/images/blog-images/brisabeach.png" alt="Summer" class="center"/>
<figcaption><small>Enjoy the rest of the summer!</small></figcaption>
