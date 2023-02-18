---
title: 🏝️ i18n translations in Next.js 13's app-dir for server/client components 🌊
created: 02/19/2023
description: In this blog post, we explore how to use Next.js 13's app directory and consume i18n translations for both server and client components in an easy way. With this approach, you can reduce the size of your bundles and maintain the code clean.
tags: nextjs, javascript, react, i18n
cover_image: /images/cover-images/25_cover_image.jpg
cover_image_mobile: /images/cover-images/25_cover_image_mobile.jpg
cover_color: '#3D441D'
---

In this post, I will explain how to easily load and use translations in the pages within the **[`app` directory](https://beta.nextjs.org/docs/app-directory-roadmap)** of Next.js 13, a **new paradigm** for managing your pages that, if mismanaged, **can lead to headaches**.



## Before we begin... A little context

First, let me tell you about **[Next-translate](https://github.com/aralroca/next-translate)**. It is one of the most widely used libraries for **loading** and **using translations** in **Next.js pages** (~70k weekly downloads) and has existed since Next.js 9.


By default, translations are stored in _**locales/**{lang}/{namespace}.json_:
```bash
.
├── en
│   ├── common.json
│   └── home.json
└── es
    ├── common.json
    └── home.json
```

<small>*However, they can also be loaded from a CDN or integrated with an online internationalization platform like localize.</small>

🦄 One of the library's goals is to be **easy to use**. With a little [configuration](https://github.com/aralroca/next-translate/tree/master#3-configuration) in the `i18n.js` file, you can already consume these translations in your pages and components:

```js
import useTranslation from 'next-translate/useTranslation'

export default function Example() {
  const { t, lang } = useTranslation('common')
  return <h1>{t('example')}</h1>
}
```

🌍 Another goal of the library is to have all the **i18n essentials**: interpolation, plurals, formatters, translations with HTML tags, etc.

📦 And another goal is to be as **lightweight as possible**. In version 1.0, we made it occupy **~1kb**, but with version 2.0, there have been even more improvements that we will see in this post.

I won't go into further detail on how the library works. I invite you to read the [documentation](https://github.com/aralroca/next-translate/tree/master) if you want more details.

<img width="200" height="200" src="/images/blog-images/nt-logo.svg" alt="Next-translate logo" class="center">


Now that I have introduced the library, let's see if it is still easy to use, lightweight, and has all the i18n essentials in the **new paradigm** that Next.js 13 introduced in late 2022: the **app directory**...

## What is the app dir?

The app directory in Next.js 13 (beta) introduces a new routing and data fetching system that supports layouts, nested routes, and utilizes **[React 18 Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)** by default.

Server components are a new type of React component that executes on the server and on the **server only**. This means that they are never shipped to the client, resulting in a significant reduction in the amount of code that needs to be shipped to the browser. This reduction in the amount of code can **improve the performance** of React applications, especially those dealing with large amounts of data.

They were originally thought of as a way to **solve** the **"waterfall problem"** in React applications. This **occurs when** a React component **requires data** from a server, but that data **is not available yet**. This can result in a "waterfall" of network requests, as **each component waits** for the data it needs before it can render, **causing significant delays** in rendering and impacting the user experience. 

With Server components **allows** the server to **fetch all** the required data in one go, instead of going back and forth with the client. This results in a significant **improvement** in the **performance** of React applications.

They also **reduce** the **amount of code** that needs to be shipped to the client, which can improve the load time of React applications. They can also **improve** the **maintainability** of applications, as they can make it easier to manage data fetching in large applications.

However, if there are parts of your code that require interactivity with the user, you can create **client component islands**, where the page only uses the kilobytes of JavaScript used in these islands. As less JavaScript is always better, this approach is ideal.

<figure align="center">
<img width="500" src="/images/blog-images/merch-islands-example.png" alt="Merch islands example" class="center">  <figcaption><small>Image of islands, from Deno <a href="https://deno.com/blog/the-future-and-past-is-server-side-rendering" target="_blank">post</a> blog</small></figcaption>
</figure>


One of the challenges with this paradigm shift of working with server components and client islands is that they function differently and are like **two separate worlds**. Therefore, the **goal** is to **find a way** to make the **usage of both** as **simple** and **consistent** as possible.


## Server components headaches

If a programmer works with both Server Components and Client Components at the same time, they may face some **challenges** in terms of **integration** and **coordination** between the two types of components.

One of the main challenges could be the need to **maintain coherence** between the **data** handled on the server and on the client. For example, if a server page loads a translation namespace and all page components need to use these translations, island client components must also have access to the same translations **without fetching** them from the client, which requires **coordinating data requests** to **avoid** unnecessary **redundancies** and **ensure** that the data is obtained **efficiently** to avoid delays in site loading and **reduce** unnecessary **bandwidth** usage.

<img width="500" height="333" src="/images/blog-images/headache.jpg" alt="Headache" class="center">

Finally, there may be **challenges** in **integrating libraries** used to work with Server Components and Client Components. Ensuring that these tools work well together can be a challenge. So let's see how we have dealt with these problems at Next-translate.

## Load and consume translations in Next.js 13 app dir


In **[Next-translate 2.0](https://github.com/aralroca/next-translate/releases/tag/2.0.0)**, we have struggled with this issue to make the solution as **user-friendly as possible**. In the end, we achieved this goal, and no additional configuration is necessary in your `i18n.js` setup. 🎉

Simply keep in mind 🧠 that the **pages defined** in the **configuration** are **now used** for the **pages** within the **app directory**:

```js
// i18n.js
module.exports = {
  locales: ['en', 'ca', 'es'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'], // app/page.tsx
    '/checkout': ['checkout'], // app/checkout/page.tsx
  },
}
```

That's all you need to do! 😜

Our **[plugin](https://github.com/aralroca/next-translate-plugin)**, which was already present Next-translate 1.0, now in Next-translate 2.0 takes care of loading translations in both server and client pages, as well as client component islands within a server page. Furthermore, we have reduced the size of our library from 1.8kb to **498B** (minified + gzipped).

<figure align="center">
<img width="500" height="347" src="/images/blog-images/bundlephobia-next-translate-2.png" alt="Bundlephobia Next-translate 2.0" class="center">
 <figcaption><small><a href="https://bundlephobia.com/package/next-translate" target="_blank">Bundlephobia</a> capture: v1.6 -> 1.8kb - v2.0 -> 498B</small></figcaption>
</figure>

**Prior** to the app directory, the pages always had **1.8kb** of translations in the bundle, **but now**:

- If you have all translations in **server components**: **0kb** 🥳
- If you need **client** component **islands** that change the text according to user interaction: **498B** 🎉

To consume these translations, use the **[useTranslation](https://github.com/aralroca/next-translate#usetranslation)** hook or the **[Trans](https://github.com/aralroca/next-translate#trans-component)** component:


**🌊 Server page (+0kb): `app/page.js`:**
```js
import useTranslation from 'next-translate/useTranslation'

export default function HomePage() {
  const { t, lang } = useTranslation('home')

  return <h1>{t('title')}</h1>
}
```

In this case, we are dealing with a server page, as pages are by default server components. Under the hood, the `next-translate-plugin` **dynamically** loads translations **directly**, without the need for the `useEffect` hook or `context`. It also sets the **language** and **namespace** in the **HTML**, enabling other components, such as client-side islands, to hydrate and consume the same translations loaded for the page.

**🏝️ Client page (+498B): `app/checkout/page.js`**
```js
"use client"
import useTranslation from 'next-translate/useTranslation'

export default function CheckoutPage() {
  const { t, lang } = useTranslation('checkout')

  return <h1>{t('title')}</h1>
}
```

For client pages, which are not the default in Next.js, it is necessary to indicate that they are client-side using the **`"use client"`** line, which is a new feature in the `app` directory of Next.js 13. By default, if this line is not present, the page is server-side. Under the hood, the `next-translate-plugin` loads translations for these pages using the `useEffect` hook. In this case, there is no need to add **anything to the HTML** because all components will **already** have **access** to the **translations** without the need for hydration.


**🏝️ Client component (+498B): `components/ClientIsland`**
```js
"use client"
import useTranslation from 'next-translate/useTranslation'

export default function ClientIsland() {
  const { t, lang } = useTranslation('common')
  return <h1>{t('island')}</h1>
}
```

The same logic applies to components: if they do not have the `"use client"` line, they are server-side by default, but if they include it, they become client **component islands** that can be used on a server page.

In this case, the `next-translate-plugin` will check whether hydration is necessary, since it is possible that the translations are already accessible if the parent page or component was also a client.


**🌊 Server component (+0kb): `components/ServerSea`**
```js
import useTranslation from 'next-translate/useTranslation'

export default function ServerSea() {
  const { t, lang } = useTranslation('common')
  return <h1>{t('sea')}</h1>
}
```

For server components, the **plugin does not perform any transformation**, as translations have already been loaded at the page level, and direct access to the translations is available within the `useTranslation` hook.

**🌊🏝️🏝️ Server page with client islands (+498B): `app/page.js`**
```js
import ServerSea from '@components/ServerSea' // this part 0kb
import ClientIsland from '@components/ClientIsland'
import AnotherClientIsland from '@components/AnotherClientIsland'

export default function HomePage() {
  return (
    <>
      <ServerSea />
      <ClientIsland />
      <AnotherClientIsland />
    </>
}
```

However, if there is a server page with client components, the client components must hydrate what has been provided from the server page and rerender.

## i18n routing with app dir 

Next.js 10 introduced [i18n routing](https://nextjs.org/docs/advanced-features/i18n-routing) support, allowing pages to be rendered by navigating to `/es/page-name`, where the page `pages/page-name.js` was accessed using the `useRouter` hook to obtain the `locale`. 

However, since the pages have been moved from the `pages` dir to the **app dir**, this i18n routing **no longer works correctly**.

At Next-translate, we have chosen not to re-implement this functionality, as we aim to be a library for translating pages, rather than routing them. We hope that in the future, this feature will be implemented in the `app` directory, as it is still in beta and many features still need to be supported.

However, all the support currently available is with the `lang` parameter. That is, `/page-name?lang=es` renders the page `app/page-name/page.js`, where we have internal access to the `lang` parameter, and you **do not need** to do **anything extra** other than using the `useTranslation` hook to consume your translations.

For now, you can use the middleware to add the `param`:

```js
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import i18n from './i18n'

export function middleware(request: NextRequest) {
  const locale = request.nextUrl.locale || i18n.defaultLocale
  request.nextUrl.searchParams.set('lang', locale)
  return NextResponse.rewrite(request.nextUrl)
}
```

And to navigate:

```js
<Link href={`/?lang=${locale}`} as={`/${locale}`}>{locale}</Link>
```

If you need more i18n routing features like automatic locale detection you can follow these steps from the Next.js documentation:

- https://beta.nextjs.org/docs/guides/internationalization.

<figure align="center">
<img width="500" height="445" src="/images/blog-images/routes.png" alt="Routes in different languages" class="center">
 <figcaption><small>Routes in different languages</small></figcaption>
</figure>

## Demo

To conclude, if you are eager to try an example application using Next.js with the `app` directory and Next-translate, you can take a look at this example:


- [Codesandbox](https://codesandbox.io/p/sandbox/next-translate-app-dir-fw68h2?file=%2Fsrc%2Fapp%2Fpage.tsx&selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A6%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A6%7D%5D)

## Conclusion

This article discusses the Next.js 13 paradigm shift in managing pages, which introduces a new routing and data-fetching system that supports layouts, nested routes, and **server components**. Server components are a new type of React component that executes only on the server, reducing the amount of code that needs to be shipped to the browser and improving the performance of React applications.

The article also discusses the **Next-translate** library, which is one of the most widely used libraries for loading and using translations in Next.js pages. It aims to be easy to use, have all the i18n essentials, and be as lightweight as possible. The article evaluates whether Next-translate is still easy to use, lightweight, and has all the i18n essentials in the **new paradigm** of **Next.js 13**, and **explains how to use it**.


<img width="500" height="347" src="/images/blog-images/learning-js.jpg" alt="Image from unsplash" class="center">


## References

- https://github.com/aralroca/next-translate
- https://github.com/aralroca/next-translate-plugin
- https://beta.nextjs.org/docs/guides/internationalization
- https://nextjs.org/docs/advanced-features/i18n-routing
- https://deno.com/blog/the-future-and-past-is-server-side-rendering
- https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html
- https://reactjs.org/blog/2022/03/29/react-v18.html