---
title: 'HTML Streaming Over the Wire 🥳: A Deep Dive'
created: 05/08/2024
description: Explore HTML Streaming Over the Wire! We explain the Diff DOM algorithm with streaming to make only the necessary modifications, insertions, and deletions between a DOM node and an HTML stream reader.
tags: javascript, experimental, brisa
series: 'HTML streaming'
cover_image: /images/cover-images/30_cover_image.jpg
cover_image_mobile: /images/cover-images/30_cover_image_mobile.jpg
cover_color: '#0B0E13'
---

In our previous article in the series, we introduced the Diff DOM Algorithm briefly without delving into its technical intricacies. In this installment, we present the [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming) library, an open-source solution designed to facilitate HTML Streaming Over the Wire using the Diff DOM Algorithm. This library is intended not only for use within other frameworks and libraries but also as a standalone solution.

- [Why HTML Streaming Over the Wire?](#why-html-streaming-over-the-wire)
  - [Interaction with JSON](#interaction-with-json)
  - [Interaction with HTML Streaming](#interaction-with-html-streaming)
- [Diff DOM Algorithm with Streaming](#diff-dom-algorithm-with-streaming)
- [Show me the code](#show-me-the-code)
  - [Community Support and Adoption](#community-support-and-adoption)
- [Show me some example](#show-me-some-example)
- [Conclusion](#conclusion)

## Why HTML Streaming Over the Wire?

Given that modern browsers have supported HTML streaming for years, why limit ourselves to initial page loads? Why not extend HTML streaming to server interactions as well? Ultimately, reverting to HTML (HyperText Markup Language) restores the web's fundamental principles (HyperText Transfer Protocol).

<figure align="center">
  <img src="/images/blog-images/http.png" width="200px" height="103px" alt="HyperText Transfer Protocol" class="center" />
  <figcaption><small>HyperText Transfer Protocol</small></figcaption>
</figure>


For some time now, I've been immersed in developing Brisa, an experimental framework slated for public release this summer _(If you are interested in knowing more, [subscribe](https://aralroca.com/blog) to my blog newsletter for now)_. One of our primary objectives has been to minimize client-side JavaScript code for server interactions. Drawing inspiration from server actions and HTMX concepts, we've achieved the capability to build single-page applications (SPAs) with just 800 bytes—equivalent to the RPC ([Remote Procedure Call](https://en.wikipedia.org/wiki/Remote_procedure_call)) for server communication. In cases requiring client components, they seamlessly transform into web components with signals, expanding the code to a mere 3KB.

Additionally, we have aimed to leverage the web platform to its fullest extent. For server actions, we opted to transmit Hypertext. As for client components, they transform into web components and, coupled with signals, respond dynamically to document changes without data transmission.

To understand the difference between the server interactions that we are familiar with in recent years, let's review how we are doing these server interactions through JSON:

### Interaction with JSON

Traditionally, server interactions entail:

- Capturing a client event and writing code to serialize data, sending JSON to an endpoint (expanding client-side code).
- Writing an endpoint, deserializing/serializing both input and output data to return JSON.
- Processing the response on the client side, deserializing JSON, and maintaining it in memory for UI library rerendering, thereby further increasing client-side bundle size.

<figure align="center">
  <img src="/images/blog-images/traditional.png" width="820px" height="495px" class="transparent" alt="Client code for a server interaction" class="center" />
  <figcaption><small>Client code for a server interaction</small></figcaption>
</figure>

This is a very silly example about debouncing an input text and validating a code, but to show you that you can be familiar with doing all this logic on the client to do a server interaction:

Client code:

```tsx
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    const fn = func.bind(this, ...args)
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

export function ClientComponent() {
  const [showContent, setShowContent] = useState(false)

  async function handleInputOnClient(e) {
    const code = e.target.value;
    const res = await fetch(/* some endpoint */, {
      method: 'POST',
      body: JSON.stringify({ code })
    })
    if(res.ok) setShowContent(true)
  }

  if (showContent) return 'some content'

  return <input type="text"  onChange={debounce(handleInputOnClient, 300)} />
}
```

Server code:

```ts
export function POST(request: Request) {
  const data = await req.json();
  return new Response(null, { status: data.code === 'foo' ? 200 : 401 });
}
```

Isn't this cumbersome? Having to repeat this process for each server interaction only bloats client-side code.

### Interaction with HTML Streaming

With HTML Streaming Over the Wire, the workflow in Brisa transforms:

- Upon capturing a client event within a server component, the process resembles that of an endpoint, where access to the browser event serialized from the server is available thanks to Brisa's RPC.
- Upon completing event processing within the server component, the RPC runtime on the client side updates only the modified portions of the web, streaming HTML generated from the rerender executed on the server.

<figure align="center">
  <img src="/images/blog-images/server.png" width="820px" height="437px" class="transparent" alt="Server interaction with server code" class="center" />
  <figcaption><small>Server interaction with server code</small></figcaption>
</figure>

Server component:

```tsx
export function ServerComponent({}, request: RequestContext) {
  async function handleInputOnServer(e) {
    if(e.target.value === 'foo') {
      request.store.set('display-content', true);
      rerenderInAction();
    }
  }

  if (request.store.get('display-content')) return 'some content'

  return <input type="text" onInput={handleInputOnServer} debounceInput={300} />
}
```

In this workflow, there is `debounce[Event]` attribute inspired by HTMX to make the RPC client do the debounce, the rest is code that runs only on the server, and the store lives on request time.

This new workflow adds zero bytes of client-side code for each server interaction. Why add client-side JavaScript to perform the same DOM update task? This is the essence of the RPC code, which remains constant over time. The server actions are in charge of streaming HTML for the client RPC to update the UI.

<figure align="center">
  <img src="/images/blog-images/server-action.gif" width="800px" height="408px" alt="Server interaction example in Brisa" class="center" />
  <figcaption><small>Server interaction example in Brisa</small></figcaption>
</figure>

By eliminating JSON transmission, we can leverage streaming for significantly faster and more progressive UI updates, even enabling "suspense" without additional client-side code.


## Diff DOM Algorithm with Streaming

The Diff DOM (Document Object Model) algorithm has been utilized for years to simulate React's "Virtual DOM" without virtualization. Instead, it operates directly on the "Browser DOM," comparing two HTML nodes efficiently and updating the first DOM tree based on the modifications present in the second.

In essence, HTML Over the Wire (without streaming) has been achievable for years thanks to the Diff DOM Algorithm, widely adopted by many modern libraries and frameworks.

<figure align="center">
  <img src="/images/blog-images/boxes.gif" width="800px" height="333px" class="transparent" alt="Updating boxes" class="center" />
  <figcaption><small>Updating boxes</small></figcaption>
</figure>

React, for instance, avoids using HTML for transmission between server components (RSCs) to facilitate streaming in single-page applications and communication with server actions. It relies on progressively loaded JSON with "holes", which must be processed before employing the Virtual DOM. [Dan Abramov](https://twitter.com/dan_abramov2) elucidated this in a [tweet](https://twitter.com/dan_abramov2/status/1762099439303295409) a few months ago. I inquired further in another [tweet](https://twitter.com/aralroca/status/1762113683784614065) regarding the feasibility of HTML Streaming, to which he cited two obstacles:


> 1) doesn’t help with passing new data to stateful stuff (like a list of todos to an already mounted todo list component)
>
> 2) you’d have to either parse HTML yourself (non-trivial to do correctly) or create throwaway DOM nodes
 
Upon analysis, I found these obstacles to be surmountable.

Regarding the first point, Brisa obviates the need to pass data for stateful components, as client components utilize real DOM elements, namely web components. When attributes are modified, they react to changes using signals, updating their content while preserving the state. Hence, use native constructs—web components, signals (currently as a [proposal](https://github.com/proposal-signals/proposal-signals) in TC39 with stage 0), and HyperText Markup Language—made more sense.

Regarding the second point, browsers offer a native "hack" for parsing nodes from a stream. This technique is elucidated in a video on the "Chrome for Developers" YouTube channel [here](https://www.youtube.com/watch?v=LLRig4s1_yA&t=1286s).

Therefore, to support the Diff DOM Algorithm with HTML Streaming, three aspects must be considered:

1. **DFS (Depth-First Search)**: Instead of implementing breadth-first search ([BFS](https://en.wikipedia.org/wiki/Breadth-first_search)) for analyzing the DOM tree, [DFS](https://en.wikipedia.org/wiki/Depth-first_search) must be employed to synchronize with streaming, as HTML chunks during streaming always arrive in DFS order.
2. **Parsing HTML String Chunks to HTML Nodes**: Efficient parsing of each incoming node during streaming is essential, along with traversal among the arriving nodes.
3. **Stop and Wait for Missing Chunks**: Identifying instances where comparison involves data yet to be received, waiting only as necessary without blocking.

<figure align="center">
  <img src="/images/blog-images/boxes-streaming.gif" width="800px" height="333px" class="transparent" alt="Updating boxes with chunks received every 100ms" class="center" />
  <figcaption><small>Updating boxes with chunks received every 100ms</small></figcaption>
</figure>

## Show me the code

I've open-sourced [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming), a library weighing only 1KB. Most of the time, you'll load it lazily since user interaction triggers its need, eliminating the necessity of loading it upfront.


```ts
import diff from "https://unpkg.com/diff-dom-streaming@latest";

// ...

const res = await fetch(/* some url */);

// Apply diff DOM between the current document
// and the stream reader:
await diff(document, res.body.getReader());
```

This library heralds the reality of HTML Streaming Over the Wire, accessible not just to Brisa but to numerous other libraries and frameworks. You can even employ it in vanilla JavaScript without any additional libraries.

### Community Support and Adoption

If you see potential in HTML Streaming Over the Wire and wish to contribute to its growth, consider giving the [`diff-dom-streaming`](https://github.com/aralroca/diff-dom-streaming) library a star on GitHub. Your support helps to promote its visibility and encourages further development in this innovative approach to web development.

## Show me some example

Here's the [demo of the boxes](https://stackblitz.com/edit/diff-dom-streaming?file=index.js) you can try out without any framework.

{% twitter 1776956020574585206 %}

## Conclusion

HTML Streaming Over the Wire, empowered by the Diff DOM algorithm, promises a return to the web's core principles, paving the way for a faster, more responsive, and scalable web experience for all.  The future of this technology holds immense potential, and I'm eager to see how it unfolds in more frameworks and libraries.