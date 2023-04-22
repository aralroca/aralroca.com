---
title: 'Is React 18 smaller in size compared to Preact?'
created: 03/01/2023
description: 'TODO'
tags: react, javascript, preact
cover_image: /images/cover-images/23_cover_image.jpg
cover_image_mobile: /images/cover-images/23_cover_image_mobile.jpg
---

React 18 and Preact are both JavaScript libraries commonly used for building user interfaces. A key consideration when selecting a library is its size, as larger libraries can lead to slower load times and negatively impact website performance.

In this case, the inquiry is focused on the size comparison between React 18 and Preact. Specifically, the question asks whether React 18 is smaller in kilobytes than Preact.

## Next.js 12 with Preact (~50.9 kB)

```
Page                                                              Size     First Load JS
┌ ○ /                                                             955 B          45.2 kB
├   /_app                                                         0 B            44.3 kB
├ ○ /404                                                          321 B          44.6 kB
├ λ /api/mailer                                                   0 B            44.3 kB
├ ● /blog                                                         3.07 kB        47.4 kB
├ ● /blog/[slug] (3570 ms)                                        6.64 kB        50.9 kB
├   └ css/e1d337323d1ab4f7.css                                    314 B
├   ├ /blog/dont-control-everything-react-forms (525 ms)
├   ├ /blog/first-steps-in-webgl (342 ms)
├   ├ /blog/first-steps-webassembly-rust (338 ms)
├   ├ /blog/cat-dog-classifier (303 ms)
├   ├ /blog/app-with-react-api-without-tools-as-webpack-or-babel
├   ├ /blog/detect-text-toxicity-with-react
├   ├ /blog/discovering-snowpack
├   └ [+18 more paths]
└ ○ /thanks                                                       914 B          45.2 kB
+ First Load JS shared by all                                     44.3 kB
  ├ chunks/framework-770211f252228083.js                          8.4 kB
  ├ chunks/main-f62e8cd319fc8eac.js                               30.6 kB
  ├ chunks/pages/_app-e9dbab35acf20cbe.js                         4.47 kB
  ├ chunks/webpack-69bfa6990bb9e155.js                            769 B
  └ css/2b0765012379387c.css                                      3.17 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
```

## Next.js 13 with React, without app dir (~82.4 kB)

```
Route (pages)                                                              Size     First Load JS
┌ ○ /                                                                      1.02 kB          78 kB
├   /_app                                                                  0 B              77 kB
├ ○ /404                                                                   311 B          77.3 kB
├ λ /api/mailer                                                            0 B              77 kB
├ ● /blog                                                                  2.32 kB        79.3 kB
├ ● /blog/[slug] (3933 ms)                                                 5.46 kB        82.4 kB
├   └ css/e1d337323d1ab4f7.css                                             314 B
├   ├ /blog/dont-control-everything-react-forms (678 ms)
├   ├ /blog/app-with-react-api-without-tools-as-webpack-or-babel (362 ms)
├   ├ /blog/cat-dog-classifier (361 ms)
├   ├ /blog/discovering-snowpack (352 ms)
├   ├ /blog/detect-text-toxicity-with-react (351 ms)
├   ├ /blog/do-all-roads-lead-to-rome
├   ├ /blog/etiketai
├   └ [+19 more paths]
└ ○ /thanks                                                                918 B          77.9 kB
+ First Load JS shared by all                                              80.2 kB
  ├ chunks/framework-2c79e2a64abdb08b.js                                   45.2 kB
  ├ chunks/main-b1241a9a70bb7dcd.js                                        26.9 kB
  ├ chunks/pages/_app-c11e652a6abeaba0.js                                  4.07 kB
  ├ chunks/webpack-8fa1640cc84ba8fe.js                                     750 B
  └ css/e2a04055582976c7.css                                               3.18 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
```

## Next.js 13 with React, with app dir 


```
Route (app)                                                       Size     First Load JS
┌ ○ /                                                             137 B            68 kB
├ ○ /blog                                                         2.23 kB          76 kB
├ ● /blog/[slug]                                                  5.77 kB        79.5 kB
├   ├ /blog/app-with-react-api-without-tools-as-webpack-or-babel
├   ├ /blog/cat-dog-classifier
├   ├ /blog/detect-text-toxicity-with-react
├   └ [+23 more paths]
└ ○ /thanks                                                       822 B          68.7 kB
+ First Load JS shared by all                                     67.8 kB
  ├ chunks/701-71f90890018839ed.js                                65.5 kB
  ├ chunks/main-app-9f65b0c4430c92c5.js                           204 B
  └ chunks/webpack-0bd2b127f97e03e1.js                            2.12 kB
```
