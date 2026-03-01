---
title: Next-translate 3.0.0 - Turbopack, Next.js 16, and a New Chapter
created: 03/01/2026
description: Today, I am incredibly happy to announce that Next-translate version 3.0.0 is officially out! This release is focused on Modernity and Stability, including Turbopack support and compatibility with Next.js 15+ async params.
tags: nextjs, javascript, react, i18n, turbopack
cover_image: /images/cover-images/25_cover_image.jpg
cover_image_mobile: /images/cover-images/25_cover_image_mobile.jpg
cover_color: "#3D441D"
---

It has been quite a journey since the last major update of **Next-translate**. Today, I am incredibly happy to announce that version **3.0.0** is officially out!

## A Personal Note

Before diving into the technical details, I want to address the elephant in the room: the lack of updates over the past year. I’ve been deeply involved in other projects and, unfortunately, Next-translate didn't get the attention it deserved.

I want to apologize for the wait. The community support has been overwhelming, and seeing so many of you still rely on this tool made me realize I need to give it my priority again. Starting today, I’m back to a constant maintenance rhythm. Next-translate is a core part of my focus once more.

## What's New in 3.0.0?

This release is focused on two things: **Modernity** and **Stability**.

### 1. Turbopack Support (Finally!)

One of the most requested features was compatibility with **Turbopack**. With Next.js 16 pushing for better build performance, we've updated `next-translate-plugin` to play nice with the Rust-based bundler. You get the speed of Turbopack without losing your localized content.

### 2. Next.js 15+ Async Params

Next.js 15 introduced a significant change: `params` and `searchParams` are now asynchronous. Version 3.0.0 handles this natively, ensuring your translations work perfectly in both Server and Client components without the dreaded "params is not a promise" errors.

### 3. Stabilizing the App Router

We've introduced a new `createTranslation` helper specifically designed for the `app` directory architecture. We've also stabilized the internal `t` function to prevent unnecessary re-renders and improved the overall DX for server-side translation.

### 4. Better Components and Typings

- **Trans Component**: Now supports nested arrays and improved pluralization.
- **formatElements**: Now explicitly exported for your own custom formatting logic.
- **TypeScript 5.3+**: Full support for the latest TS features and significantly improved auto-completion for your namespaces.

## Breaking Changes to Watch Out For

To keep the project lean and compatible with the future of Next.js, we've made a few adjustments:

- Support for the automatic migration logic from `pages` to `app` router has been removed from the plugin.
- We now use the `exports` field in `package.json`, so make sure you use formal entry points like `next-translate/useTranslation` instead of internal paths.

## Moving Forward

This is just the beginning of the 3.0.x cycle. My goal is to keep Next-translate as the lightweight, powerful alternative for i18n in Next.js.

Thank you to everyone who contributed to this release. Let's build a more global web together!

---

Check out the code on [GitHub](https://github.com/aralroca/next-translate).
