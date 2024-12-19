---
title: "Don't fall into the CDN trap!"
created: 12/19/2024
description: "How Brisa's HTML Streaming feature can help you avoid the CDN trap and improve your app’s performance. We’ll also compare Brisa with other popular tools like HTMX and React to highlight the benefits of using Brisa for server-side rendering."
tags: javascript, experimental, brisa
cover_image: /images/cover-images/34_cover_image.webp
cover_image_mobile: /images/cover-images/34_cover_image_mobile.webp
cover_color: "#EBD5BB"
---

This blog post’ll explore how **Brisa's HTML Streaming** feature can help you avoid the CDN trap and improve your app’s performance. We’ll also compare [Brisa](https://brisa.build) with other popular tools like **HTMX** and **React** to highlight the benefits of using Brisa for server-side rendering.

## Why HTML Streaming is Important

HTML Streaming is a powerful technique that allows you to send **HTML incrementally** from the server to the client, improving performance and reducing latency. With [Brisa](https://brisa.build), you can stream HTML content directly to the client, not only for the initial render but also for subsequent updates and server actions.

<img src="/images/blog-images/render.png" alt="HTML Streaming vs CDN + fetching data" class="center" />

If your app needs just **1 request** to fetch server data, you’re stuck in the **CDN trap**. Add more requests, and you’re in a cascading nightmare. CDNs are fine for assets—nothing more. Your website is an asset only if it doesn’t rely on server data. 

**Rendering** the Components on the **server** with **streaming** is the best way to **avoid the CDN trap**. Brisa not only uses **HTML Streaming** for the first render but also as a response to **Server Actions** after rendering a component on the server.

You may wonder, but many components are static and I don't want to render them always on the server. Well, Brisa allows you to [**pre-render them at build-time**](https://brisa.build/api-reference/extended-props/renderOn#renderon) with just one attribute, so that **only dynamic components are rendered** on the server.

```tsx
<StaticComponent renderOn="build" />
```

## Do dynamic imports solve the CDN trap?

**No**. Using HTML Streaming on Server Actions have exactly the same benefits as using it on the first render.

Imagine managing the **opening** and **rendering** of a **dialog** with a **dynamic import**:

<img src="/images/blog-images/dialog.png" alt="Server-side Dialog vs Client-side Dialog" class="center" />

Only if the dialog needs server data, we are in the same problem.

## Code example: Quiz with HTML Streaming

As an example, we are going to make a quiz of questions in Brisa using HTML Streaming through Server Actions, and you will see how easy it is to do it, apart from its benefits.

In order to make the quiz, we are going to create a component that will be rendered on the server and will be responsible for managing the questions and answers. The questions will be sent to the client through HTML Streaming, and the answers will be processed on the server.

```tsx
import { renderComponent } from 'brisa/server';

// Define the type for questions to ensure type safety.
type Question = {
  answer: string; // The correct answer for the question ('yes' or 'no').
  question: string; // The text of the question to be displayed.
  id: number; // Unique identifier for each question.
};

// All this code is server-code. It ensures that the user cannot infer the correct
// answers by inspecting the page source or the network.
const questions: Question[] = [
  { id: 1, answer: 'no', question: 'Is the Earth flat? ' },
  { id: 2, answer: 'yes', question: 'Is the Earth round? ' },
  { id: 3, answer: 'no', question: 'Can giraffes lay eggs?' },
  { id: 4, answer: 'yes', question: 'Can penguins fly?' },
  { id: 5, answer: 'no', question: 'Can a cow jump over the moon?' },
  { id: 6, answer: 'yes', question: 'Is water wet by definition?' },
  { id: 7, answer: 'yes', question: 'Is the sky blue?' },
  { id: 8, answer: 'yes', question: 'Do fish sleep with their eyes open?' },
  { id: 9, answer: 'no', question: 'Can a cow fly?' },
];

// Function to open the modal with a random question.
function openModal() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  
  renderComponent({
    element: <Modal {...questions[randomIndex]} />,
    target: '#content', // Specify the DOM element where the modal should render.
  });
}

// Function to process the user’s answer and display the result.
function processAnswer(e: ClickEvent, value = 'yes') {
  // We have the event on the server, so we can access the target and the dataset!
  const id = (e.target as HTMLButtonElement).dataset.id;

  // Check if the user's answer matches the correct answer.
  const isCorrect = questions.find((q) => q.id === Number(id)).answer === value;

  // Render feedback based on the correctness of the answer.
  renderComponent({
    element: isCorrect ? (
      <p id="content" class="correct">
        Correct!
      </p>
    ) : (
      <p id="content" class="incorrect">
        Incorrect!
      </p>
    ),
    target: 'dialog',
  });
}

// Main homepage component.
export default function Homepage() {
  return (
    <>
      <div class="hero">
        <h1>
          <span class="h1_addition">Welcome to </span>Brisa
        </h1>
        <p class="edit-note">✏️ SSR Modal example</p>
        <code>src/pages/index.tsx</code>
      </div>

      <form onSubmit={openModal}>
        <button>Open modal</button>
        <div id="content" /> {/* Container for rendering dynamic content */}
      </form>
    </>
  );
}

// Modal component to display a question and answer options.
function Modal({ question, answer, id }: Question) {
  return (
    <dialog open>
      <form method="dialog">
        <h2>{question}</h2>
        {/* Button for "Yes" answer */}
        <button data-id={id} onClick={(e) => processAnswer(e, 'yes')}>
          Yes
        </button>
        {/* Button for "No" answer */}
        <button data-id={id} onClick={(e) => processAnswer(e, 'no')}>
          No
        </button>
      </form>
    </dialog>
  );
}
```

- [🔗 Code example here](https://github.com/brisa-build/brisa/tree/canary/examples/with-ssr-modal)

One of the advantages of using server-side logic for rendering and controlling a dialog is the enhanced security and simplicity it offers. With Brisa, you can offload both the rendering and logic processing to the server, ensuring that critical data remains inaccessible to the client and maintaining a clean separation of concerns.

In this example, a modal dialog is used to present random quiz questions to the user. The logic for selecting the question, validating the answer, and rendering the UI is entirely managed on the server. This approach eliminates the risk of exposing sensitive data, such as the correct answer, to the client.

Normally we load modals on the client with a dynamic import to avoid loading them at the start, requesting the CDN, and then if the modal needs server data, once rendered it has to make a cascade of calls to the server. With Brisa, we can load the modal directly from the server, avoiding the need to make additional calls and keeping the modal logic on the server.

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/7kwT1oshUJA" title="Server-Side Dialog Management: No Browser JavaScript Required" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


With this approach, we get the following benefits:

1. **Enhanced Security:** Sensitive data, such as correct answers, remain on the server, preventing unauthorized access or manipulation.
2. **Improve UX**: By rendering the modal directly on the server with streaming, we can avoid additional network requests and improve the user experience thanks to streaming.
3. **Simplified State Management:**  By centralizing logic on the server, the client remains lightweight and focuses only on rendering and user interaction.
4. **Reduced Client-Side Complexity and Size:** No need for complex state management libraries or additional client-side logic to handle the modal. The server manages everything and you can do an SPA without increasing the client bundle size.


## SPA without Client-Side JavaScript?

**Yes**, you can! Although we support writing [Web Components](https://brisa.build/building-your-application/components-details/web-components) with **JSX** and **Signals** with very little code (3kb), we want you to use them **only** for pure **client interactions**. Our **goal** is to make it possible to create **SPAs without** the need for **client-side JavaScript**.

Imagine that your **e-commerce** site, instead of having a **cascade** of **requests** and a lot of **client-side JavaScript code** that harms **performance** and **user experience**, becomes a **SPA** without client-side JavaScript, since most interactions that require server data can be **managed directly on the server**. 

Rendering on the server is very **cheap** and **fast** (~10ms)! 

<figure align="center">
<img src="/images/blog-images/cheap.gif" alt="Cheap and fast" class="center" />
  <figcaption><small>Cheap and fast</small></figcaption>
</figure>

## Control stream chunks with Async Generators

Brisa allows you to control the **stream chunks** with **Async Generators**. This way, you can **stream** the **HTML** in **chunks** and **control** the **flow** of the **stream**.

```tsx
import { Database } from "bun:sqlite";
import { renderComponent } from "brisa/server";

export default function LoadMovies() {
  function streamMovies() {
    renderComponent({
      element: <MovieItems />,
      target: "ul",
      placement: "append",
    });
  }

  return (
    <>
      <button id="movies" onClick={streamMovies}>
        Click here to stream movies from a Server Action
      </button>
      <ul />
    </>
  )
}

const db = new Database("db.sqlite");

async function* MovieItems() {
  for (const movie of db.query("SELECT title, year FROM movies")) {
    yield (
      <li>
        {movie.title} ({movie.year})
      </li>
    );
  }
}
```

In this example, we are using an [**Async Generator**](https://brisa.build/building-your-application/data-management/fetching#async-generators) to **stream** the movies from a **SQLite database**. Any `yield` is a chunk of the stream that will be sent to the client.

- [🔗 Code example Streaming HTML from SQLite](https://github.com/brisa-build/brisa/tree/canary/examples/with-sqlite-with-server-action)


## What is `renderComponent`?

Brisa’s `renderComponent` allows developers to:

1. **Re-render components dynamically on server actions.**
2. **Render specific components to specific locations** in the DOM.
3. **Choose how and where to place them** (e.g., replace, append, prepend, after & before).
4. **Enhance transitions** with the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition).
5. **Stream JSX components** incrementally from the server.

Here’s a quick look:

```tsx
export default function MyComponent({ text = "foo" }: { text: string }) {
  function handleClick() {
    // Re-render the same component
    renderComponent();

    // Re-render with new props
    renderComponent({ element: <MyComponent text="bar" /> });

    // Render another Component to a specific location
    renderComponent({
      element: <AnotherComponent />,
      target: "#target-id",
      placement: "append",
      withTransition: true, // Enhance transitions with the View Transition API
    });
  }

  return (
    <div>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}
```

All this code is server-side code. In Brisa, all the events from server components are Server Actions.


## Why is This a Game-Changer?

Brisa’s approach to server actions is inspired by React’s model and HTMX concepts but is designed to be simpler and inherently safer.

### Brisa vs. HTMX

**HTMX** allows developers to dynamically update portions of the DOM via server responses. But it lacks:

- **Component-level granularity:** HTMX relies on server-generated HTML partials without the concept of components.
- **Streaming support:** HTMX does not natively support streaming updates to the client.
- **Bundle size**: HTMX is a 14KB library, while Brisa is only 2KB.
    
With `renderComponent`, you get:

- **Component reuse:** Brisa components are re-rendered seamlessly, leveraging JSX and React-like composition.
- **Dynamic placement:** Update or append components where in the DOM.
- **Streaming support:** Send and render data incrementally using server-side streams.


### Brisa vs. React

In **React**, implementing server actions often involves using `"use server"` and `"use client"` directives. This dual model introduces the potential for human error and can unintentionally expose components to the client. 

Key differentiators include:

- **Streaming HTML support:** React communicates between the server and client by sending JavaScript, which can add significant overhead. Conversely, Brisa streams HTML directly to the client, reducing complexity and improving performance.
- **Signals - fine-grained reactivity:** Brisa’s client-side signals automatically react to server-side changes by updating Web Components, avoiding the need for a complete re-render.
- **Bundle size:** React-DOM v.19 weighs around 200KB, while Brisa maintains an ultra-lightweight footprint of just 2KB.
- **Selective updates:** Brisa allows you to update specific components on the server, reducing the need for full-page reloads.


## Conclusion

Brisa’s HTML Streaming avoids the CDN trap and improves your app’s performance. You can stream HTML content directly to the client for the initial render, subsequent updates, and Server Actions. This approach improves security, and user experience, and simplifies state management, making it an ideal choice for server-side rendering.

If you’re looking to build fast, secure, and scalable web applications, give [Brisa](https://brisa.build) a try today!

**Support Us:** [Visit our shop](https://brisadotbuild.myspreadshop.es/) for Brisa swag! 🛍️


<div align="center">
<a href="https://brisadotbuild.myspreadshop.es/" alt="Brisa Shop" target="_blank">
<img width="400" height="425" src="https://brisa.build/images/blog-images/shop.webp" alt="Brisa Shop" />
</a>
</div>
