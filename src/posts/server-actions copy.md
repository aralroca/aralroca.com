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

## Problemas de las Server Actions

### 1. Números de eventos a capturar

En otros frameworks como React, se han centrado en que las actions sólo forme parte del `onSubmit` de formulario, en vez de cualquier evento. Esto es un problema, ya que hay muchos eventos que no son de formulario que tambien se deben poder gestionar desde un server component sin añadir codigo cliente. Por ejemplo, un `onInput` de un input, un `onScroll` para cargar una infinite scroll, un `onMouseOver` para hacer un hover, etc.

### 2. Tener más controles de HTML sobre de las Server Actions

Muchos frameworks también han visto a la libreria de HTMX cómo una alternativa muy distinta a las server actions, cuando realmente ha traido ideas muy buenas que se pueden combinar con las Server Actions para que tengan más potencial simplemente añadiendo atributos extras en el HTML que el RPC Cliente puede tener en cuenta, como el `debounceInput` que hemos visto antes. También otras ideas de HTMX como el `indicator` para mostrar un spinner mientras se hace la petición, o poder gestionar un error.

### 3. Separación de conceptos

Cuando se introducieron las Server Actions en React, hubo un cambio de paradigma que muchos desarrolladores tenian que cambiar el chip mental a la hora de trabajar con ellas. Nosotros lo que hemos querido es que sea lo más familar posible a la Web Platform, de esta manera, puedes capturar el evento serializado desde el servidor y usar sus propiedades. Él único evento un poco distinto es el `onSubmit` que ya se ha trasferido el `FormData` y tiene la propiedad `e.formData`, no obstante, el resto de propiedades son interactuables. Este es un ejemplo reseteando un formulario:

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


En este ejemplo, no hay nada de código cliente y durante la server action se puede desactivar el botón de submit con el `indicator`, mediante CSS, para que no se pueda enviar el formulario dos veces, y a la vez tras hacer la acción en el servidor se puede resetear el formulario y acceder a los datos del formulario con `e.formData` y luego reseteando el form usando la misma API del evento. Mentalmente, es muy parecido a trabajar con la Web Platform. La unica diferencia es que todos los eventos de todos los server components son server actions. De esta forma, hay una separación de conceptos real, donde no es necesario poner `"user server"` ni `"use client"` en tus componentes. Simplemente, hay que tener en cuenta que todo se ejecuta sólo en el servidor, excepción de la carpeta `src/web-components` que se ejecuta en el cliente y ahi los eventos son normales.

### 4. Propagación de eventos

En Brisa, las Server Actions se propagan entre Server Components como si se trataran de eventos del DOM. Es decir, desde una Server Action puedes llamar a un evento de una prop de un Server Component y se ejecuta entonces la Server Action del Server Component padre, etc.

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

En este caso, el evento `onCompleteSubmit` se ejecuta en el componente padre y se puede hacer una acción en el servidor. Esto es muy útil para hacer acciones en el servidor que afectan a varios componentes.

### 4. Mezclar ambos mundos con separación de conceptos

Sobretodo tras las últimas semanas los Web Components han sido un poco mal vistos tras varias discusiones en Twitter (X). No obstante, al formar parte del DOM, es la mejor manera de interactuar con las Server Actions por varias razones:

1. Puedes capturar cualquier evento de un Web Component desde el servidor y generar la comunicación cliente-servidor. Ejemplo `<web-component onEvent={serverAction} />`. Esto es muy potente, ya que toda la lógica de dentro del Web Component es sólo lògica de cliente sin poner nada de lógica de servidor, simplemente desde el servidor al consumir el Web Component puedes hacer acciones de servidor.
2. Se puede usar el protocolo HTTP por lo que estubo diseñado, para transmitir Hypermedia (HTML), de esta forma si tras un re-render desde una Server Action se actualiza algún atributo de un Web Component, el algoritmo de diffing del RPC Cliente hace que sin mucho esfuerzo se actualice el Web Component, ya que los atributos en Brisa son signals y internamente se actualizan manteniendo la reactividad y su estado anterior. Este proceso en otros frameworks se hace muy complicado, haciendo que las Server Actions tengan que procesar JSON o JS over the wire, lo que hace más complicado la implementación del streaming. Transmitir HTML en streaming y procesarlo con el algoritmo de diffing es algo que expliqué en este otro [artículo](https://aralroca.com/blog/html-streaming-over-the-wire) si estás interesado.

### 5. Encriptar solo los datos sensibles

Si dentro de una server action se utiliza alguna variable que existia a nivel de render, a nivel de seguridad muchos frameworks como Next.js lo que hacen es encriptar estos datos para que no se puedan visualizar desde el cliente. Esta más o menos bien, pero encriptar siempre los datos tiene un coste computacional asociado y no siempre son datos sensibles.

En Brisa, para solucionar esto, son request distintas, donde en el render inicial tiene un valor, y en la server action puedes capturar el valor que tiene en esta request. Esto sirve en algunos casos pero no siempre, por ejemplo si haces un `Math.random` será distinto seguro. Tras saber esto, creamos el concepto de "Action Signals" que es una forma de transferir datos del store servidor al store cliente, y el desarrollador puede decidir si encriptarlos o no a su voluntad.
Para saber más, lee la siguiente sección del artículo.

## Nuevos conceptos

En Brisa, hemos añadido un nuevo concepto para darle más poder aún a las Server Actions, este concepto se llama "Action Signals". La idea de las "Action Signals" es que tienes 2 stores, uno en el servidor y otro en el cliente.

Porquè 2 stores?

El store de servidor por defecto vive sólo a nivel de request, y es importante diferenciarlos para poder transmitir datos que pueden ser sensibles y no quieres que nunca estén en el cliente. Al vivir a nivel de request es imposible que haya conflictos entre diferentes request, ya que cada request tiene su propio store y no se guarda en ninguna base de datos, al terminar la request, muere por defecto.

En cambio en el store de cliente, es un store que cada propiedad al consumirla es una signal, es decir, que si se actualiza, se reacciona el Web Component que estaba escuchando a esa signal.

No obstante, el nuevo concepto de "Action Signal" es que podemos extender la vida del store servidor más allá de la request. Para hacer esto es necesario usar el método `store.transferToClient(['some-key'])`, dónde datos que antes eran sensibles, ahora se transfieren al store cliente y se convierten en signals. De esta forma, muchas veces no será necesario hacer ningún re-render desde el servidor, simplemente puedes desde una Server Action hacer reaccionar las signals de los Web Components que estaban escuchando a esa signal.

Esta transferència de store, hace que la vida del store servidor ahora sea:

Render incial del Server Component -> Cliente -> Server Action -> Cliente -> Server Action...

Así que pasa de vivir de sólo a nivel de request a vivir de forma permanente, compatible con la navegación entre páginas.

### Transferir datos encriptados desde el Render inicial a la Server Action

Habrá veces que quizás en vez de consultar a la Base de datos desde la Server Action te conviene más transferir datos que ya existian en el render inicial aunque requieran de una encriptación asociada. Para hacer esto, simplemente tienes que usar: 
`store.transferToClient(["some-key"], { encrypt: true });`, la diferencia es que desde el cliente al hacer `store.get("some-key")` siempre estará
encriptado, pero en el servidor siempre estará el valor desencriptado.
