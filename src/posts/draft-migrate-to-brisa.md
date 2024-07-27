---
title: 'Next.js to Brisa: My Blog Migration'
created: 07/22/2024
description: A quick overview of my blog's migration from Next.js to Brisa
tags: javascript, brisa, bun
cover_image: /images/cover-images/32_cover_image.jpg
cover_image_mobile: /images/cover-images/32_cover_image_mobile.jpg
cover_color: '#D2EDF2'
---

Seguramente es raro ver un artículo hablando de Brisa, un framework que saldrà en Septiembre de 2024 y aún no está público. Pero aquí estamos, sustituyendo Next.js de mi blog por Brisa y todo su código està open source en GitHub.

## ¿Por qué migrar?

Primero, no hay nada malo con Next.js. Es un framework increíble y lo he usado por años y ha sido una de las motivaciones para crear Brisa. No obstante, me quedé en la versión 12 de Next.js porqué preferia usar Preact en lugar de React.

Preact es una librería más pequeña y rápida que React, no obstante, tras el cambio de paradigma de las nuevas versiones de React con las server actions, etc, Preact ha tomado un camino diferente y no es tan compatible con las nuevas versiones del framework de Next.js.

## ¿Por qué he creado Brisa?

Al principio me planteé migrar a Fresh, un framework de Deno junto con Preact, me gustó bastante, aunque en este momento preferia buscar alternativas con Bun. Luego empezé a buscar más alternativas, a probar Qwik, Solidjs, Sveltekit, etc. Todos ellos son increíbles y muchos de ellos han servido de inspiración para Brisa. No obstante, no encontré ninguno que me convenciera del todo, me gustaba mucho la idea de las server actions de React, pero no quería usar React y tampoco me convencian del todo como estaban implementadas. 

En julio de 2023, Misko Hevery, creador de Angular y Qwik, vino a Barcelona y habló de Qwik como si fuera su bebé, su motivación me motivó a empezar a poner mis ideas en un framework. Además, mi compañero de trabajo, Phanan, del core de Vue, me dio mucho apoyo para empezar con Brisa. Así que decidí crear Brisa, un framework que me permitiera tener un control total sobre el código y que me permitiera usar Bun y poder aplicar todas mis ideas.

Empecé a probar Bun y facilitó mucho el proceso inicial, ya que JSX y TypeScript venian por defecto a parte de tener API para el enrutado parecido al de Next.js y con pocos dias ya tenia el renderizado con streaming hecho. Pero realmente no quería que Brisa fuera sólo para web estàticas, así que empecé a escribir el route-map de la versión 0.1 de Brisa, dónde muchas de las ideas que escribia sabía que serian positivas para la web, pero no sabía cómo las haría. Y fue parte de la diversión, ir descubriendo cómo implementarlas y aprender haciendo.

Oficialmente empecé en Septiembre de 2023 a crear Brisa, dónde ya mi motivación ya no era migrar mi blog, sino contribuir en hacer una web mejor, desde mi punto de vista y mis propias ideas, y de aprender mucho en el proceso. Ahora el route-map de la versión 0.1 de Brisa está al 95% hecho y este 5% restante calculo que me llevará 1 mes más, por lo que en Septiembre de 2024, Brisa será público.

## ¿Qué es Brisa?

Brisa es un framework escrito con JSX de web components junto con server components. La idea es que esté escrito de forma muy parecida a Next.js con React, pero luego actue como si fueran Web Components junto con signals para las interacciones de cliente y parecido a HTMX y las server actions de React para las interacciones de servidor.

En Brisa por defecto todo corre sólo en el servidor (o build si decides exportar tu web), excepto el directorio `src/web-components`, que es donde se encuentran los web components que corren por defecto tanto en el servidor como en el cliente (SSR), aunque puedes hacer un skip de SSR si lo deseas.

Con Brisa tienes separación de conceptos, en un fichero de servidor no tienes importaciones de cliente y viceversa, lo que hace que sea muy fácil de entender y de mantener. Además, puedas distinguir facilmente qué es un web component y qué es un server component.

```tsx
<ServerComponent />
<web-component />
```

Bàsicamente, los server components estan consumidos de la misma forma que los componentes de React, mientras que los web components estan consumidos de la misma forma que los web components nativos, pero con la ventaja que TypeScript te hace type-safe para que sepas cuales puedes consumir y que attributos usar. En Brisa, no hace falta escribir directivas como `"user client";` o `"use server";`, y lo que nos hemos enfocado es en mejorar la comunicación entre ambos mundos.

Para esta comunicación entre web/server components, ha habido distintos puntos:

- Hacer que todos los eventos se puedan capturar en el servidor mediante un RPC de Brisa (2kb), no sólo el `onSubmit` de un formulario, sino también el `onInput` de un input, el `onClick` de un botón, o cualquier evento de un web component, ejemplo: `onSomeEvent={serverAction}`.
- Crear el concepto de **Action signal**, dónde desde una server action puedes hacer reaccionar los web components sin la necesidad de hacer un re-render de la página. Aunque también puedes hacer un re-render tanto de la página como del propio server component si es necesario.
- Ideas de HTMX para extender los atributos de HTMX para tener mayor control, ejemplos como el `indicator` para mostrar un spinner mientras se ejecuta la server action, o el `debounce` para hacer debounce de una server action. Sin añadir código JS cliente.

### Tamaño

Brisa por defecto ocupa 0kb en el cliente, no obstante, si usas web components con signals, el tamaño de Brisa es de 3kb, y si usas server actions, el tamaño de Brisa augmenta 2kb por el RPC. Así que si usas ambos, el tamaño de Brisa es de 5kb.

No obstante, aunque el RPC de Brisa es de 2kb, es linear, es decir, si tienes 100 server components con server actions, el tamaño de Brisa seguirá siendo el mismo. Por otro lado, si usas web components con signals, el tamaño de Brisa es de 3kb, pero si tienes 100 web components, el tamaño de Brisa crecerá proporcionalmente pero de forma muy pequeña, ya que hacemos optimizaciones para que el tamaño de tus web components sea lo más pequeño posible.

Ejemplo de un web component con signals sin build:

```tsx
export default function MyCounter({ children }, { state }) {
  const count = state(0);

  return (
    <div>
      <button onClick={() => count.value--}>-</button>
      <button onClick={() => count.value++}>+</button>
      {count.value}
      {/* This children can be a Server Component: */}
      <div>{children}</div>
    </div>
  );
}
```

Después del build, su JS cliente será:

```js
let n=function({children:r},{state:e}){
  const l=e(0);

  return ["div",{},
    [["button",{onClick:()=>l.value--},"-"],
    ["button",{onClick:()=>l.value++},"+"],
    [null,{},()=>l.value],["div",{},r]]
  ]
}
h("my-counter",s(n));
```

Dónde `h`  es para registrar los web components y `s` para definir el web component de la forma nativa.

### Output

Brisa te permite usar Bun de servidor _(para el routemap de la 1.0 haremos que sea runtime-agnostic, pero ahora para la 0.1 dependerá de Bun)_, exportar tu web a un CDN, exportar tu web a un APK o a un IPA, o incluso a un desktop app con integración de Tauri. Además, Brisa te permite hacer una web híbrida, es decir, tener páginas estáticas y dinámicas en la misma web. El i18n funciona con todos los tipos de exportación, así que facilmente también puedes hacer una web multilenguaje con Brisa.

### Algunas otras features

- Suspense y error handling en web/server components.
- Context API en web/server components.
- Soporte de websockets.
- Middleware
- Layouts
- Soporte de i18n (tanto routing como traducciones)

Al trabajar con Brisa, se tiene que pensar en interacciones. Nos podemos hacer esta série de preguntas:

- Se pueden hacer esta interacción solo con HTML/CSS? Entonces será un component, y la pagina puede ser estática y no requiera de un servidor, sino pasar el renderizado del componente en build-time.
- Es una interacción dónde está involucadro el servidor? Entonces será component pero si requerirá de un servidor.
- Es una interacción puramente de cliente y no se puede hacer con solo HTML/CSS? Entonces será un web component.

La nomenglatura "component" vs "web component", en Next.js/React se conoce como "server component" y "client component". Aquí podemos hablar de "component" directamente para referirnos cuando el componente corre en el servidor o en build-time, es decir, que no es un web component y se traduce a puro HTML, este proceso de renderizado puede estar hecho tanto en el servidor como el build-time, pero nunca será visible la lógica del código en la web, en la web ya se recibirá únicamente el HTML. La nomenglatura de "web component" es porque se transpila el JSX para ser usado como un web component nativo.

## Migración de Next.js a Brisa

Uno de los puntos de desarrollar Brisa ya era la idea de que se parezca a Next.js para que los desarrolladores estén familiarizados, así que la mayoría de los ficheros los he podido mantener tal cual, ya que era solo componentes "dummy" de JSX. Estos ficheros al no tener estado y ser solo JSX, son 100% compatibles con Brisa. Brisa por dfecto corre en el servidor, así que sabemos que no se llevará JS cliente para estos ficheros. Entre estas páginas son la home y la página de "thanks". La página donde hay el listado de artículos y luego la pagina dinàmica de artículos si tiene un poco de lógica un poco distinta a Next.js y React donde hay que hacer adaptaciones.

Ejemplo de la home:

- TODO: add link home


En cambio, para la página de artículos, he tenido que hacer una pequeña adaptación, ya que en Next.js se hace dentro de `getStaticProps`, mientras en Brisa se hace dentro de la función `prerender`. No obstante, la lógica es la misma.