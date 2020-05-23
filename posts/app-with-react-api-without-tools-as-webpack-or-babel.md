---
title: App with React API without tools as Webpack or Babel
created: 05/07/2020
description: Learn how to make an application without tools as Webpack or Babel while using the same API of React.
tags: javascript, react, experimental
cover_image: /images/cover-images/7_cover_image.jpg
cover_image_mobile: /images/cover-images/7_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/7_cover_image_vert.jpg
cover_color: '#171920'
dev_to: app-with-react-api-without-tools-as-webpack-or-babel-4170
---

There are tools like Webpack or Babel that seem indispensable when we work as frontends. But, could we make an application without such tools? Even without package.json or bundles? And being able to continue using the React API? Let's see how.

## Getting the hello world

We are going to start our App with just two files: `index.html` and `App.js`:

```
.
├── index.html
└── App.js
```

We are going to load our `App.js` file inside the `index.js` adding the `type="module"`:

<small>index.html:</small>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <script type="module" src="App.js"></script>
    <title>My App without Webpack</title>
  </head>
  <body id="app" />
</html>
```

Then, in our `App.js` file, we are going to use [Preact](https://preactjs.com/) loaded directly using [unpkg.com](unpkg.com). Unpkg is a fast, global content delivery network for everything on npm. The reasons to choose Preact instead of React are:

- Instead of JSX (That requires Babel) we can use a similar syntax.
- Is just 3kb and it has the same React API.
- It has better performance than React.

<small>App.js:</small>

```jsx
import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'

function App() {
  return html`
    <div>
      Hello world
    </div>
  `
}

render(html`<${App} />`, document.getElementById('app'))
```

Now we can start the project in local with:

```bh
npx serve .
```

And open http://localhost:5000.

We did only 2 steps and already have our Preact App working! Without Webpack, babel, package.json...

## Importing other components

To import a new component into our project, once we've created the file:

```diff
.
├── index.html
+├── Header.js
└── App.js
```

We can use a normal `import` but be careful, it should finish with the extension `.js`, because this is JavaScript, not Webpack.

<small>In our App.js</small>

```js
import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'

// New import:
import { Header } from './Header.js'

function App() {
  // Fragments doesn't exist anymore :)
  return html`
    <${Header} title="This is my app">
      An example without Webpack and Babel
    </${Header}>

    <div>
      Content of the page
    </div>
  `
}

render(html`<${App} />`, document.getElementById('app'))
```

<small>In our Header.js</small>

```jsx
import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'

export function Header({ title, children }) {
  return html`
    <header>
      <h1>${title}</h1>
      ${children}
    </header>
  `
}
```

## Using hooks

Sure. We can use hooks in Preact.

```jsx
// The same React hooks are available on the same package
import {
  html,
  useEffect,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

export function Header({ title, children }) {
  useEffect(() => {
    document.title = title
  }, [title])

  return html`
    <header>
      <h1>${title}</h1>
      ${children}
    </header>
  `
}
```

## Codesandbox

<iframe
  src="https://codesandbox.io/embed/app-without-webpack-ee1l0?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="app-without-webpack"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Support

Support of JavaScript modules is available in all modern browsers:

- https://caniuse.com/#search=modules

If you want to use a fallback for legacy browser, you can use the `nomodule` attribute:

```html
<script type="module" src="modern-browsers.js" />
<script nomodule src="legacy-browsers.js" />
```

## Using more packages

On https://www.pika.dev/ you can search all the npm packages that have support to modules, and their https://www.unpkg.com link to import to your project.
