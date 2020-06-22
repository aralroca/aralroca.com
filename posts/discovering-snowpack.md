---
title: Discovering Snowpack
created: 06/22/2020
description: Discover how Snowpack fits into the JavaScript ecosystem
tags: javascript, react
cover_image: /images/cover-images/11_cover_image.jpg
cover_image_mobile: /images/cover-images/11_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/11_cover_image_vert.jpg
cover_color: '#7C7671'
---

In today's article we'll do some exploring to see what [Snowpack](https://www.snowpack.dev/) is and what are its advantages.

In the last few months I've heard a lot of talk about Snowpack and I hadn't given it a chance. The time has come.

<img src="/images/blog-images/snowpack_logo.png" alt="Snowpack logo" class="center transparent" />

## Working with ESM

To understand what Snowpack does, let's see first how to work with ESM directly, without any tools.

Currently, if we want for example to setup a Preact app without any tooling, we can do something like this:

**index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <script type="module" src="index.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <title>Example app</title>
  </head>
  <body id="app" />
</html>
```

Adding the `type="module"` to the `script` tag is enough to tell the browser that we are using ESM.

Then, the **index.js** will be the entrypoint of our Preact app, the top of the Component tree.

**index.js**

```js
import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Example } from './example.js'

function App() {
  return html`
    <h1>Some example</h1>
    <${Example} />
  `
}

render(html`<${App} />`, document.getElementById('app'))
```

This works well. However, it has certain drawbacks that current tools such as Webpack or Parcel already solved. Among the most important:

- Hot reloading in development
- Importing other files as `.json`, `.css`...
- Tooling as Typescript, JSX, PostCSS, Sass, Babel...
- Compatibility with legacy browsers
- Managment of thirty party libraries

So... Why not use Webpack or Parcel to cover this? It may still make sense to use bundlers such as Webpack or Parcel.
Let's keep asking... What does a bundler do? Why do we really need a bundler?

## Module bundlers

In 2012 there were no ESM and with the arrival of Webpack the use of bunlders began to be relevant. Thanks to them it's possible to use `.js` files as if they were modules, being able to use `import` and `export` everywhere.

Bundlers still make a lot of sense today, since many browsers do not yet support ESM. We can use the same process to minimize and optimize our production code.

The main question here should be "Does it make sense to keep using a bundler in development?" Running your entire application through a bundler introduces additional work and complexity to your dev workflow that is unnecessary now that ESM is widely supported.

## Unbundled Development

Snowpack was intended to use an unbundled development, using directly ESM. Among other advantages:

- Much faster (no-wait build time, reflecting changes immediatly)
- Easier to debug
- Project size doesn't affect dev speed
- Simpler tooling
- Minimal configuration

It also provides a solution to the ESM problems we have mentioned. Although you can do the production build directly with Snowpack, it gives you the flexibility to still optimizing your production builds with Webpack or Parcel.

<img src="/images/blog-images/unbundle_dog.jpeg" alt="Image of dog and packages" class="center" />

## Preact with Snowpack

Let's create a Preact project with [create-snowpack-app](https://github.com/pikapkg/create-snowpack-app) CLI:

```
npx create-snowpack-app preact-snowpack-example --template @snowpack/app-template-preact --use-yarn
```

Then:

```
cd preact-snowpack-example
yarn start
```

After `yarn start`, in ~50ms we have our Preact dev environment up under `http://localhost:8080`, with Babel, JSX and familiar Webpack things.

You can test it to see how fast and easy it is.

<img src="/images/blog-images/snowpack-preact-example.gif" alt="Example Snowpack with Preact" class="center" />

If you inspect the source code you'll see that ESM is used behind the scenes, with some differences:

```js
import { h, render } from '/web_modules/preact.js' // Uses /web_modules/* for dependencies
import '/web_modules/preact/devtools.js'
import App from './App.js'
import './index.css.proxy.js' // Uses .js files for css imports
```

## Conclusion

We have seen a bit of Snowpack's surface, enough to start understanding how it fits into the JavaScript ecosystem.

I hope this article will make you curious and eager to try Snowpack. It's not a guide, to know more details about Snowpack and ESM I recommend to visit the reference links.

## References

- https://www.snowpack.dev
- https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/
