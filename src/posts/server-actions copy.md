---
title: "We solved Server Actions"
created: 04/25/2024
description: TODO
tags: javascript, experimental, brisa
cover_image: /images/cover-images/31_cover_image.webp
cover_image_mobile: /images/cover-images/31_cover_image_mobile.webp
cover_color: "#212329"
---

Las Server Actions surgieron como una idea para reducir el código en el cliente, simplificando las interacciones que requieren comunicación con el servidor. Es una excelente solución que permite a los desarrolladores escribir menos código. Sin embargo, existen varios desafíos asociados a su implementación en otros frameworks, que no deben pasarse por alto. En este artículo hablaremos sobre estos problemas y cómo en Brisa hemos encontrado una solución.

## ¿Qué son las Server Actions?

Para comprender lo que aportan las Server Actions, es útil repasar cómo solía ser la comunicación con el servidor. Es probable que estés acostumbrado a realizar las siguientes acciones para cada interacción con el servidor:

- Cliente: Capturar un evento del navegador
- Cliente: Normalizar y serializar los datos
- Cliente: Realizar una petición al servidor
- Servidor: Procesar la petición en un endpoint API
- Servidor: Responder con los datos necesarios
- Cliente: Esperar la respuesta del servidor y procesarla
- Cliente: Actualizar los datos en el cliente y renderizar los cambios

Estas siete acciones se repiten en cada interacción. Por ejemplo, si tienes una página con 10 interacciones diferentes, repetirás un código muy similar 10 veces, cambiando solo detalles como el tipo de petición, la URL, los datos enviados y el estado del cliente.

Un ejemplo familiar sería:

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

Y en el servidor:

```js
app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  const data = await search(query);
  res.json(data);
});
```

Las Server Actions encapsulan estas acciones en una llamada remota (RPC), que gestiona la comunicación cliente-servidor, reduciendo el código en el cliente y centralizando la lógica en el servidor:

- RPC Cliente: Capturar un evento del navegador
- RPC Cliente: Normalizar i serializar los datos
- RPC CLiente: Hacer una petición al RPC servidor
- RPC Servidor: Ejecutar la acción en el servidor junto los datos
- Option 1:
  - RPC Servidor: Renderizar desde el servidor y enviar streaming al cliente
  - RPC Cliente: Processar los chunks del streaming para que se vean los cambios
- Option 2:
  - RPC Servidor: Responder con los datos necesarios y transferir propiedades del store servidor al store cliente
  - RPC Cliente: Hace reaccionar a las signals que estaban escuchando a los cambios del store

Este seria el código desde un server component:

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

Aquí, los desarrolladores no escriben código cliente, ya que es un server component. El evento `onInput` se recibe tras el debounce, gestionado por el RPC Cliente, mientras que el RPC Servidor utiliza "Action Signals" para activar los Web Components que tienen signals registradas con esa propiedad del store.

Como puedes ver, esto reduce significativamente el código del servidor y, lo mejor de todo, el tamaño del código en el cliente no aumenta con cada interacción. El código del RPC Cliente ocupa 2 KB fijos, ya sea que tengas 10 o 1000 interacciones de este tipo.

## Problemas de las Server Actions

### 1. Números de eventos a capturar

En otros frameworks como React, se han centrado en que las actions sólo forme parte del `onSubmit` de formulario, en vez de cualquier evento. Esto es un problema, ya que hay muchos eventos que no son de formulario que tambien se deben poder gestionar desde un server component sin añadir codigo cliente. Por ejemplo, un `onInput` de un input, un `onScroll` para cargar una infinite scroll, un `onMouseOver` para hacer un hover, etc.

### 2. Tener más controles de HTML sobre de las Server Actions

Muchos frameworks también han visto a la libreria de HTMX cómo una alternativa muy distinta a las server actions, cuando realmente ha traido ideas muy buenas que se pueden combinar con las Server Actions para que tengan más potencial simplemente añadiendo atributos extras en el HTML que el RPC Cliente puede tener en cuenta, como el `debounceInput` que hemos visto antes. También otras ideas de HTMX como el `indicator` para mostrar un spinner mientras se hace la petición.

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
