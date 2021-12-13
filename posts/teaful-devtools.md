---
title: 'Teaful DevTools Released!'
created: 12/02/2021
description: 'Teaful DevTools is a browser extension to inspect Teaful applications'
tags: react, javascript, teaful
series: 'React state management'
cover_image: /images/cover-images/24_cover_image.jpeg
cover_image_mobile: /images/cover-images/24_cover_image_mobile.jpeg
cover_image_vert: /images/cover-images/24_cover_image_vert.jpeg
cover_color: '#010101'
dev_to: teaful-devtools-released-37lp
---

Very recently, **2 weeks ago**, we released [Teaful](https://github.com/teafuljs/teaful); a tiny, easy and powerful React State management. If you want to know more about Teaful, I recommend [this article](https://aralroca.com/blog/teaful).

Teaful was **well received** (+500 GH stars) and one of the most requested features was to implement a devtool to debug the stores. Today we released **[Teaful DevTools](https://github.com/teafuljs/teaful-devtools)**. In this short article I will explain a little about how to use it and its benefits.

<img alt="Teaful DevTools" src="/images/blog-images/teaful-devtools.png" />

## How to use it

4 simple steps:

- **Install DevTools extension**:
    - [Chrome](https://chrome.google.com/webstore/detail/teaful-devtools/lficdnnjoackdnaddfcgllmjdocofadc)
    - [Firefox](https://addons.mozilla.org/es/firefox/addon/teaful-devtools/)
    - [Edge](https://microsoftedge.microsoft.com/addons/detail/teaful-devtools/kcplohinngjiammdehjlimgdpamhhkmn?hl=en-GB)
- **Install the bridge**: `yarn add teaful-devtools`
- **Use the bridge**: `import 'teaful-devtools'` <small>(~200 B)</small> Must be the first import.

  ```js
  import 'teaful-devtools'
  import { render } from 'preact'
  import App from './components/App'

  render(<App />, document.getElementById('root'))
  ```

- **Open the DevTools and try it**.

More details in the [README](https://github.com/teafuljs/teaful-devtools).

## Debug stores changes

For each store it is possible to view the **history of changes** that have been made to the store. To debug, we can know **WHEN** the change was made, **WHAT** / **WHERE** was changed, but also **WHO** / **HOW** / **WHY**.

<img alt="Teaful DevTools" src="/images/blog-images/teaful-devtools-details.png" />

### When

There is no secret, the changes have their own timestamp and are sorted by arrival.

### What / Where

For each modification, you'll be able to see which part of the store has changed and what's the new value (the diff).

### Who / How / Why

You can view the **entire stack trace** and go to the line in the source file.

Clicking on a file link opens the **source devtools tab** where you can **view the code** part to see how the change was produced. To understand more of the context you can also navigate to the function that called this function to see all the code involved. For more context you can put a breakpoint in the source tab to see the value of each variable that caused the change.

<div align="center">
<img width="800" alt="Teaful DevTools source" src="/images/blog-images/teaful-devtools-source.gif" />
</div>

## Modify the store from Teaful DevTools

From Teaful DevTools you can generate a change to the store and see how the UI reacts.

<div align="center">
<img width="600" alt="Teaful DevTools modify store" src="/images/blog-images/teaful-devtools-modify.gif" />
</div>

## Dark & light mode

The dark / light theme adapts to your devtools configuration.

<img alt="Teaful DevTools dark theme" src="/images/blog-images/teaful-devtools-dark.png" />
<img alt="Teaful DevTools light theme" src="/images/blog-images/teaful-devtools-light.png" />

## View rerenders / performance

It's a feature that has not been implemented in Teaful DevTools because we consider that React DevTools does it very well.

You can use React DevTools to debug the rerenders and the performance.

<div align="center">
<img width="600" alt="React DevTools Teaful performance" src="/images/blog-images/teaful-devtools-performance.gif" />
</div>

## How to strip devtools from production

Most bundlers allow you strip out code when they detect that a branch inside an if-statement will never be hit. We can use this to only include `teaful-devtools` during development and save those precious bytes in a production build.

```js
// Must be the first import
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at top-level.
  require('teaful-devtools')
}

import { render } from 'preact'
import App from './components/App'

render(<App />, document.getElementById('root'))
```

Make sure to set the `NODE_ENV` variable to the correct value in your build tool.

## Conclusions

We have released Teaful DevTools to debug the changes from the stores: when, what, where, who, how, why. And vice versa, to trigger a change from Teaful DevTools to see how the UI reacts.

At the moment it's only available for Chrome, but in future releases it will also be available for Firefox and Edge.

You can leave any suggestions on [GitHub](https://github.com/teafuljs/teaful-devtools) _(issue / PR)_ and it will be taken into account. Remember that [Teaful project](https://github.com/teafuljs/teaful) is still in an early version 0.X and together we'll make it evolve.
