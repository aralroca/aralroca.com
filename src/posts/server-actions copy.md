---
title: "We solved Server Actions"
created: 04/25/2024
description: TODO
tags: javascript, experimental, brisa
cover_image: /images/cover-images/31_cover_image.webp
cover_image_mobile: /images/cover-images/31_cover_image_mobile.webp
cover_color: "#212329"
---

Server Actions emerged as an idea to reduce the code on the client, simplifying the interactions that require communication with the server. It is an excellent solution that allows developers to write less code. However, there are several challenges associated with its implementation in other frameworks, which should not be overlooked. In this article we will talk about these problems and how in Brisa we have found a solution.

## What are Server Actions?

To understand what Server Actions provide, it is useful to review how communication with the server used to be. You are probably used to performing the following actions for each interaction with the server:

- Client: Capture a browser event
- Client: Normalize and serialize data
- Client: Make a request to the server
- Server: Process the request in an endpoint API
- Server: Respond with the necessary data
- Client: Wait for the response from the server and process it
- Client: Update the data on the client and render the changes.

These seven actions are repeated for each interaction. For example, if you have a page with 10 different interactions, you will repeat a very similar code 10 times, changing only details such as the type of request, the URL, the data sent and the status of the customer.

A familiar example would be
a:

```tsx
<input
  onInput={(e) => {
    // debounce
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: e.target.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          setState({ data });
        });
    }, 300);
  }}
/>
```

And in the server:

```js
app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  const data = await search(query);
  res.json(data);
});
```

Server Actions encapsulate these actions in a remote call (RPC), which manages the client-server communication, reducing the code on the client and centralizing the logic on the server:

- RPC Client: Capture a browser event.
- RPC Client: Normalize and serialize data
- RPC Client: Make a request to the RPC server
- RPC Server: Execute the action on the server with the data
- Option 1:
  - RPC Server: Render from the server and send streaming to the client.
  - RPC Client: Process the chunks of the stream so that the changes are visible
- Option 2:
  - RPC Server: Reply with the necessary data and transfer properties from the server store to the client store
  - RPC Client: Make the signals that were listening to the changes react to the changes in the store.
s of the store

This would be the code from a server component:

```js
<input
  debounceInput={300}
  onInput={async (e) => {
    const data = await search(e.target.value);
    store.set("query", data);
    store.transferToClient(["query"]);
  }}
/>
```

Here, developers do not write client code, since it is a server component. The `onInput` event is received after the debounce, handled by the Client RPC, while the Server RPC uses "Action Signals" to trigger the Web Components that have signals registered with that store property.

As you can see, this significantly reduces the server code and, best of all, the code size on the client does not increase with each interaction. The RPC Client code occupies a fixed 2 KB, whether you have 10 or 1000 such interactions. 

Moreover, in the case of needing a rerender, this is done on the server and is returned in HTML streaming, making the user see the changes much earlier than in the traditional way where you had to do this work on the client after the server response.

## Server Actions problems

### 1. Numbers of events to capture

In other frameworks such as React, they have focused on actions only being part of the form `onSubmit`, instead of any event. This is a problem, since there are many non-form events that should also be handled from a server component without adding client code. For example, an `onInput` of an input, an `onScroll` to load an infinite scroll, an `onMouseOver` to do a hover, etc.

### 2. Having more HTML controls over Server Actions

Many frameworks have also seen the HTMX library as a very different alternative to server actions, when in fact it has brought very good ideas that can be combined with Server Actions to have more potential by simply adding extra attributes in the HTML that the RPC Client can take into account, such as the `debounceInput` that we have seen before. Also other HTMX ideas like the `indicator` to show a spinner while making the request, or being able to handle an error in the RPC Client.

### 3. Separation of concepts

When Server Actions were introduced in React, there was a paradigm shift that many developers had to change the mental chip when working with them. We wanted to make it as familiar as possible to the Web Platform, this way, you can capture the serialized event from the server and use its properties. The only event a little different is the `onSubmit` that has already transferred the `FormData` and has the `e.formData` property, nevertheless, the rest of properties are interactable. This is an example resetting a form:

```tsx
import type { RequestContext } from "brisa";

export default function FormOnServer({}, { indicate }: RequestContext) {
  const pending = indicate("action-name");

  return (
    <form
      indicateSubmit={pending}
      onSubmit={(e) => {
        // This code runs on the server
        e.target.reset(); // Reset the form
        console.log("Username:", e.formData.get("username"));
      }}
    >
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <br />
      <button indicator={pending} type="submit">
        Submit
      </button>
    </form>
  );
}
```

In this example, there is no client code at all and during the server action you can disable the submit button with the `indicator`, using CSS, so that the form cannot be submitted twice, and at the same time after doing the action on the server you can reset the form and access the form data with `e.formData` and then resetting the form using the same API of the event. Mentally, it is very similar to working with the Web Platform. The only difference is that all the events of all the server components are server actions. This way, there is a real separation of concepts, where it is not necessary to put `"user server"` or `"use client"` in your components. Just keep in mind that everything runs only on the server, except for the `src/web-components` folder which runs on the client and there the events are normal.

### 4. Event Propagation

In Brisa, the Server Actions are propagated between Server Components as if they were DOM events. That is to say, from a Server Action you can call an event of a prop of a Server Component and then the Server Action of the parent Server Component is executed, etc.

```tsx
export default function Example({ onCompleteSubmit }) {
  return (
    <ChildComponent
      indicateSubmit={pending}
      onSubmit={(e) => {
        const username = e.formData.get("username");
        /* Process data */
        onCompleteSubmit(username); // call server component prop
        e.target.reset();
      }}
    />
  );
}
```

In this case, the `onCompleteSubmit` event is executed on the parent component and an action can be done on the server. This is very useful to make actions on the server that affect several components.

### 4. Mixing both worlds with concept separation

Especially after the last few weeks Web Components have been a bit frowned upon after several discussions on X (formelly Twitter). However, being part of the DOM, it is the best way to interact with Server Actions for several reasons:

1. You can capture any Web Component event from the server and generate client-server communication. Example `<web-component onEvent={serverAction} />`. This is very powerful, since all the logic inside the Web Component is only client logic without putting any server logic, simply from the server when consuming the Web Component you can do server actions.
2. The HTTP protocol can be used for what it was designed for, to transmit Hypermedia (HTML), this way if after a re-rendering from a Server Action any attribute of a Web Component is updated, the diffing algorithm of the RPC Client makes the Web Component to be updated without much effort, since the attributes in Brisa are signals and internally they are updated maintaining the reactivity and its previous state. This process in other frameworks becomes very complicated, making the Server Actions have to process JSON or JS over the wire, which makes the streaming implementation more complicated. Streaming HTML and processing it with the diffing algorithm is something I explained in this other [article](https://aralroca.com/blog/html-streaming-over-the-wire) if you are interested.

Using attributes in Web Components requires serialization in the same way as transmitting data from server to client without using Web Components, therefore, using both, there is no extra pain serialization to manage.

### 5. Encrypt only the sensitive data

If within a server action some variable is used that existed at render level, at security level many frameworks like Next.js what they do is to encrypt this data so that they cannot be visualized from the client. This is more or less fine, but encrypting data always has an associated computational cost and it is not always sensitive data.

In Brisa, to solve this, there are different requests, where in the initial render it has a value, and in the server action you can capture the value that it has in this request. This is useful in some cases but not always, for example if you do a `Math.random` it will be different for sure. After knowing this, we created the concept of "Action Signals" which is a way to transfer data from the server store to the client store, and the developer can decide whether to encrypt it or not at will.
To learn more, read the next section of the article.

## New concepts

In Brisa, we have added a new concept to give even more power to the Server Actions, this concept is called "Action Signals". The idea of the "Action Signals" is that you have 2 stores, one on the server and one on the client.

Why 2 stores?

The default server store lives only at the request level, and it is important to differentiate them in order to be able to transmit data that may be sensitive and you don't want them never to be on the client. By living at request level it is impossible to have conflicts between different requests, since each request has its own store and is not stored in any database, when the request is finished, it dies by default.

On the other hand, in the client store, it is a store that each property when consumed is a signal, that is to say, if it is updated, the Web Component that was listening to that signal reacts.

However, the new concept of "Action Signal" is that we can extend the life of the server store beyond the request. To do this it is necessary to use the `store.transferToClient(['some-key'])` method, where previously sensitive data is now transferred to the store client and converted into signals. In this way, many times it will not be necessary to make any re-rendering from the server, you can simply from a Server Action make react the signals of the Web Components that were listening to that signal.

This store transfer makes the life of the server store now:

Render initial Server Component -> Client -> Server Action -> Client -> Server Action...

So it goes from living from only at request level to live permanently, compatible with navigation between pages.

### Transferring encrypted data from the initial Render to the Server Action

Sometimes, instead of querying the database from the Server Action, you may want to transfer data that already exists in the initial render even if it requires an associated encryption. To do this, you simply use: 
`store.transferToClient(["some-key"], { encrypt: true });`, the difference is that from the client when you do `store.get("some-key")` it will always be encrypted, but on the server it will always be decrypted.
