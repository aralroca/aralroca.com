---
title: 'Migrated my blog from Preact to React 18'
created: 03/01/2023
description: 'TODO'
tags: react, javascript, preact
cover_image: /images/cover-images/23_cover_image.jpg
cover_image_mobile: /images/cover-images/23_cover_image_mobile.jpg
---

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