---
title: 'SPA-Like Navigation Preserving Web Component State'
created: 04/22/2024
description: Learn how to keep your web components' state intact while navigating, just like in a SPA!
tags: javascript, experimental, brisa
series: 'HTML streaming'
cover_image: /images/cover-images/30_cover_image.jpg
cover_image_mobile: /images/cover-images/30_cover_image_mobile.jpg
cover_color: '#0B0E13'
---

In this third and final article in the series on HTML Streaming, we will explore the practical implementation of the [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming) library in web browsing. This approach will allow any website using web components to retain its state during browsing. We will discuss in detail how to achieve this step by step using VanillaJS and Bun. It is important to note that it is not necessary to have a complex server, as we can use static files. However, we will also explore how this technique works with HTML streaming and we will stream from Bun. Join us as we take the web browsing experience to the next level with diff DOM Streaming!

## Table of Contents

- [1. Creating "Hello World" page](#1-creating-hello-world-page)
- [2. Adding more than one page](#2-adding-more-than-one-page)
- [3. Adding a Web Component](#3-adding-a-web-component)
- [4. Maintaining the state during navigation](#4-maintaining-the-state-during-navigation)
- [5. Manage new scripts of the page to be navigated to](#5-manage-new-scripts-of-the-page-to-be-navigated-to)
- [6. Working with streaming and suspense](#6-working-with-streaming-and-suspense)
- [7. Transitions between pages (View Transition API)](#7-transitions-between-pages-view-transition-api)
- [8. Caching the navigation](#8-caching-the-navigation)
- [9. Prefetch the navigation](#9-prefetch-the-navigation)
- [10. Pros and Cons of Using HTML Streaming for Web Navigation](#10-pros-and-cons-of-using-html-streaming-for-web-navigation)
- [Final conclusions](#final-conclusions)
- [References](#references)

## 1. Creating "Hello World" page

The first thing we are going to do is to create the home page with a "Hello World" with Bun:

```ts
const server = Bun.serve({
  port: 1234,
  fetch() {
    return new Response(
      `
      <html>
        <head>
          <title>Hello, World!</title>
        </head>
        <body>
          <h1>Hello, World!</h1>
        </body>
      </html>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  },
})

console.log(`Done! http://${server.hostname}:${server.port}`)
```

Now if we run it with:

```sh
bun run index.ts
```

And we open [http://localhost:1234](http://localhost:1234) We will see our page with an `h1` that says `Hello, World!`. Ok, all good.

## 2. Adding more than one page

Let's create the page `/foo` and the page `/bar` and instead of "Hello World" put "Foo" and "Bar".

To do this, we must get the `pathname` from the url of the `request`:

```ts
// Hardcoded examples of pathname-dependent example
const names = {
  '/foo': 'Foo',
  '/bar': 'Bar',
}

const server = Bun.serve({
  port: 1234,
  fetch(req: Request) {
    // request URL:
    const url = new URL(req.url)
    // Getting the hardcoded name via the pathname
    const name = names[url.pathname] ?? 'Hello, World'

    return new Response(
      `
      <html>
        <head>
          <title>Hello, World!</title>
        </head>
        <body>
          <nav>
            <a href="/">Home</a>
            <a href="/foo">Foo</a>
            <a href="/bar">Bar</a>
          </nav>
          <h1>${name}!</h1>
        </body>
      </html>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  },
})

console.log(`Done! http://${server.hostname}:${server.port}`)
```

If we run it and go to [http://localhost:1234/foo](http://localhost:1234/foo) we will see our page with an `h1` that says `Foo!`, and if we go to [http://localhost:1234/bar](http://localhost:1234/foo) we will see our page with an `h1` that says `Bar!`. Ok, all good.

In addition, we have added three `a` elements to navigate between pages 👌

```html
<nav>
  <a href="/">Home</a>
  <a href="/foo">Foo</a>
  <a href="/bar">Bar</a>
</nav>
```

For now, there is nothing special about this type of navigation, it is the default navigation of the browsers.

## 3. Adding a Web Component

For the example, we are going to add a web component with VanillaJS that acts as a counter, since it is a simple example to test a client interaction:

```ts
// Counter Web Component
class CounterComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    let count = 0

    shadowRoot.innerHTML = `
      <button id="inc">Increment</button>
      <button id="dec">Decrement</button>
      <p id="count">Count: ${count}</p>
    `
    const countEl = shadowRoot.querySelector('#count')
    shadowRoot.querySelector('#inc').addEventListener('click', () => {
      count++
      countEl.textContent = `Count: ${count}`
    })
    shadowRoot.querySelector('#dec').addEventListener('click', () => {
      count--
      countEl.textContent = `Count: ${count}`
    })
  }
}

// Register Counter Web Component
if (!customElements.get('counter-component')) {
  customElements.define('counter-component', CounterComponent)
}
```

To add it, after using the [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define), we can consume it as another HTML element with `<counter-component />`.

What we are going to do is to add it under the heading of each page:

```ts
import path from 'node:path'

const names = {
  '/foo': 'Foo',
  '/bar': 'Bar',
}

const server = Bun.serve({
  port: 1234,
  fetch(req: Request) {
    const url = new URL(req.url)
    const name = names[url.pathname] ?? 'Hello, World'

    if (url.pathname === '/code') {
      return new Response(Bun.file(path.join(import.meta.dir, 'code.js')))
    }

    return new Response(
      `
      <html>
        <head>
          <title>Hello, World!</title>
        </head>
        <body>
          <nav>
            <a href="/">Home</a>
            <a href="/foo">Foo</a>
            <a href="/bar">Bar</a>
          </nav>
          <h1>${name}!</h1>
          <counter-component></counter-component>
          /* 👇 Counter Web component code here */
          <script src="/code.js"></script>
        </body>
      </html>
    `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  },
})

console.log(`Done! http://${server.hostname}:${server.port}`)
```

Now if we run it again we will see that there is a counter on each page and we can interact with it to change its value!

However, when we navigate between pages, the counter is reset to 0. The thing is that each navigation loads the page again and therefore the web component script is loaded again and returns to its initial state.

The browsers traditional navigation what they do is to replace all the current document, for the new one. What we want is that it only updates what has changed of the DOM, if the web component does not change, why reset it?

## 4. Maintaining the state during navigation

There are many strategies to preserve the state, such as saving the value in `sessionStorage` so that at startup it loads its initial value again, but that is not what we are going to do, we are going to do something better, and that is to update during navigation only the DOM changes that change, and not the rest, therefore, only the heading should change, preserving the web component between pages so that it maintains its state.

To do this, we cannot use the browser's natural navigation, we have to apply a diff between the current document and the HTML stream, for this to be possible, we have to register the `navigate` event for the browsers that support it:

```ts
if ('navigation' in window) {
  window.navigation.addEventListener('navigate', spaNavigation)
}
```

Now what would be missing would be to implement the logic of the `spaNavigation` function to do the diff. As we have commented previously, we are going to use the library [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming). For it, we will only intercept the navigations that are with the same origin:

```ts
function spaNavigation(event) {
  const url = new URL(event.destination.url)

  if (location.origin !== url.origin) return

  event.intercept({
    /* TODO */
  })
}
```

The `event.intercept` allows us to add a `handler` to implement our own navigation, the browser will change the URL automatically, but instead of processing the request and updating the DOM by the browser here it will be done by us:

```ts
let controller = new AbortController()

function spaNavigation(event) {
  const url = new URL(event.destination.url)

  if (location.origin !== url.origin) return

  event.intercept({
    async handler() {
      // Abort previous navigations that have not been terminated
      controller.abort()
      controller = new AbortController()

      // Fetch new HTML Streaming document
      const res = await fetch(url.pathname, { signal: controller.signal })

      if (res.ok) {
        // Lazy import of the diff-dom-streaming library
        const diffModule = await import(
          'https://unpkg.com/diff-dom-streaming@latest'
        )
        const diff = diffModule.default

        // Scroll to the top of the page
        document.documentElement.scrollTop = 0

        // Applies the diff between the current document and the stream reader.
        await diff(document, res.body.getReader())
      }
    },
  })
}
```

In the `handler` the first thing we do is to abort if there was another request in the middle, this is also useful so that the HTML stream stops and does not continue doing the diff. Then we create another `AbortController` so that the `fetch` has this signal. Once the request has been processed, we load the library in a lazy way (it will only do it the first time), make the page scroll up and apply the diff with the reader.

In this way, it now only updates the parts that change during browsing and therefore keeps the web components alive without resetting them again.

Now if we run the file and check the navigation, we see that it keeps the last state of the counter! Ok, we are doing well!

## 5. Manage new scripts of the page to be navigated to

If we put another script with a `console.log` of the `name` (what you see as heading) `<script>console.log('${name}')</script>`, our expectation is that this `console.log` will come up every time you browse, since the script is different, in fact it could even be another totally different script that needs the page to work.

If we add it, we see that this does not happen, it only runs on the initial loading of the first page, but then during navigation the `console.log` is not repeated again!

**How can we solve it?**

The `diff-dom-streaming`, only makes a change at DOM level, however, to execute the new scripts in this one we can do it by means of an extension:

```ts
registerCurrentScripts()

await diff(document, res.body.getReader(), {
  onNextNode: loadScripts,
})
```

Where `registerCurrentScripts` and `loadScripts` are:

```ts
const scripts = new Set()

function registerCurrentScripts() {
  for (let script of document.scripts) {
    if (script.id || script.hasAttribute('src')) {
      scripts.add(script.id || script.getAttribute('src'))
    }
  }
}

// Load new scripts
function loadScripts(node) {
  if (node.nodeName !== 'SCRIPT') return

  const src = node.getAttribute('src')

  if (scripts.has(src) || scripts.has(node.id)) return

  const script = document.createElement('script')

  if (src) script.src = src

  script.innerHTML = node.innerHTML

  // Remove after load the script
  script.onload = script.onerror = () => script.remove()

  document.head.appendChild(script)

  // Remove after append + execute (only for inline script)
  if (!src) script.remove()
}
```

What the previous code does is that during the application of the diff, all the scripts that have been detected that have some change and at the same time have not been executed previously, we execute them.

If we now run it again, we will see that:

- It preserves the state of the web component when browsing.
- The `console.log` is executed every time we navigate.

That is to say, now we have a functional SPA, without changing the navigation history, that works in streaming and it works both with `<a href="/foo" />` and with imperative navigation as `location.assign('/foo')` 🥳.

## 6. Working with streaming and suspense

In the previous examples we have used a normal `Response` from Bun, without streaming. With streaming we could use a `Suspense` as explained in the [first article](https://aralroca.com/blog/html-node-streaming) and keep it running during navigation.

```ts
let suspensePromise
// ...
return new Response(
  new ReadableStream({
    async start(controller) {
      // Some initial chunks...

      // Add "Suspense" placeholder
      controller.enqueue(encoder.encode('<div id="suspense">Loading...</div>'))

      // Expensive chunk:
      suspensePromise = Bun.sleep(2000).then(handleExpensiveChunk)

      // "Unsuspense" code
      function handleExpensiveChunk() {
        controller.enqueue(
          encoder.encode(`
            <template id="suspensed-content"><div>Expensive content</div></template>
          `)
        )
        controller.enqueue(
          encoder.encode(`
            <script>
              function unsuspense() {
                const suspensedElement = document.getElementById('suspense');
                const ususpensedTemplate = document.getElementById('suspensed-content');

                if (suspensedElement && ususpensedTemplate) {            
                  suspensedElement.replaceWith(ususpensedTemplate.content.cloneNode(true));
                  ususpensedTemplate.remove();
                }
              }
              unsuspense();
            </script>
          `)
        )
      }

      // ... Rest of chunks
      await suspensePromise
      controller.close()
    },
  })
)
```

In order to create the suspense, it's important to take into account the following:

- Add the chunk with placeholder so that it occupies the place that the expensive chunk will occupy later.
- Save the promise that loads the content of the expensive chunk and do not make the `await` until the end of the streaming. In this example I have used `Bun.sleep` of 2 seconds to simulate this load.
- In the `.then` of the promise that makes the modification of the temporary chunk by the end.

Suspense with streaming by default works both for the initial load, as well as during normal browser navigation. Nevertheless, with our navigation implementation it also works 🥳

So we already have a SPA that works with suspense and streaming! And we haven't had to make any changes to our client code. However, we have benefits, while navigating to the other page with suspense mode, we can interact with our web components, this is wonderful!

## 7. Transitions between pages (View Transition API)

By using our own implementation, apart from making SPA-like navigation behave without having to handle the navigation history with [`pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) and being able to use more standard things like `location.assign` or HTML hyperlinks (`a`), we can also add styled transitions thanks to the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).

The View Transitions API provides a mechanism for easily creating animated transitions between different DOM states while also updating the DOM contents in a single step, and yes, they can be used during streaming, and divide it into different steps. To activate it, it is only necessary to pass the `transition: true` setting to [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming) library:

```diff
await diff(document, res.body.getReader(), {
  onNextNode: loadScripts,
+ transition: true
})
```

The chunk of the "unsuspense" script can also be set to use the View Transition API:

```diff
<script>
-  function unsuspense() {
+  async function unsuspense() {
+    if (window.lastDiffTransition) await window.lastDiffTransition.finished;
    const suspensedElement = document.getElementById('suspense');
    const ususpensedTemplate = document.getElementById('suspensed-content');

    if (suspensedElement && ususpensedTemplate) {
-      suspensedElement.replaceWith(ususpensedTemplate.content.cloneNode(true));
+      document.startViewTransition(() => {
+        suspensedElement.replaceWith(ususpensedTemplate.content.cloneNode(true));
+      });
       ususpensedTemplate.remove();
    }
  }
  unsuspense();
</script>
```

To better visualize the transition animation, we can exaggerate its timing with CSS:

```html
<style>
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.5s;
  }
</style>
```

## 8. Caching the navigation

Naturally, if you have already visited the page before, it should be cached during navigation, so that it would not be necessary to display the suspense again and show the actual content of the page directly.

To make this possible, from Bun we can add the following header to the `Response`:

```ts
headers: {
  "cache-control": "public, max-age=31536000, immutable"
}
```

> 👉 In development it will be better to set `"no-store, must-revalidate"` to be able to work and see the changes without being cached.

## 9. Prefetch the navigation

Sometimes it is necessary to use `prefetch`, because we can know what will be the next page that the user will visit. An example would be if an e-commerce checkout process has different steps on different pages, we know what the next page will be and we want that when the user performs the action it is displayed as easy as possible. In this case, we could add using the normal `prefetch` of the platform that would continue to work with our SPA-like implementation:

```html
<link rel="prefetch" href="/foo" />
```

In this case, even if we clear the cache, navigating to `/foo` will always go fast, because on the previous page its HTML is requested to improve navigation.

## 10. Pros and Cons of Using HTML Streaming for Web Navigation

### Pros:

1. **State Maintenance:** The implementation allows for maintaining the state of web components during navigation, enhancing user experience by avoiding data loss.

2. **Load Optimization:** Utilizing HTML Streaming can significantly improve page load times by streaming and updating only the elements that have changed, rather than reloading the entire page. This avoids reloading a lot of resources.

3. **Smooth Transitions:** Integration with the View Transition API enables adding animated transitions between different page states, improving aesthetics and the feeling of fluidity in the application.

4. **Navigation Caching:** The implemented caching strategy optimizes user experience by caching previously visited pages, reducing load times on future visits.

5. **Prefetching:** Prefetching capability anticipates user actions and prepares corresponding pages in advance, enhancing responsiveness and load speed.

### Cons:

1. **Limited Compatibility:** The functionality of intercepting navigation with the `navigate` event may have limited compatibility, as it currently only supports certain browsers. This may limit portability and widespread adoption of the proposed solution.

2. **Limitations in Using Component Libraries:** Those familiar with development using component libraries like React may find limitations in not being able to fully leverage the potential of HTML Streaming over the wire. Instead, they may need to resort to other strategies to maintain component state during navigation.

## Final conclusions

Concluding this series on HTML Streaming, we've explored the practical application of the [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming) library in web browsing. By integrating this approach, websites utilizing web components can maintain their state during browsing sessions. Throughout this journey, we've delved into detailed implementations using VanillaJS and Bun.

If you want to see the final code that we have been talking about in the article, you can access here:

- [Code example](https://github.com/aralroca/diff-dom-streaming/blob/28a840d6046a9700ee5df20ab5d99d361794624f/examples/spa-like/README.md)

As a note, we have disabled the cache and prefetch so you can comfortably test the suspense and see how the animations look when browsing, but feel free to play and test.

In Brisa, the framework we are developing, one of the features is that you can write web components as JSX components to make it more comfortable, in fact it is very similar to Brisa server components, the only difference is that instead of web components they are translated to pure HTML, and using signals you can share state between pages to make the pages react. I invite you to [subscribe to my blog newsletter to be notified when we release Brisa open-source](https://aralroca.com/blog) in a few months and you can try it.

## References

- [diff-dom-streaming library](https://github.com/aralroca/diff-dom-streaming) - Library used for implementing HTML Streaming in web browsing.
- [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) - Documentation on the `CustomElementRegistry` interface for registering and defining custom elements for use in a document.
- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) - Information about the View Transition API, which provides a mechanism for creating animated transitions between different DOM states.
- [pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) - Documentation on the `pushState` method of the History interface, used for adding states to the browser's session history stack.
