---
title: Using SSG Next.js methods to buid static RSS and Sitemap
description: Discover how to take benefit of the new SSG methods as getStaticProps to generate static RSS and Sitemap to your blog.
tags: javascript, react, nextjs
created: 05/02/2020
cover_image: https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80
---

I recently updated my [webpage/blog](https://aralroca/blog) to Next.js, using the new SSG (Static Site Generator) methods, with the idea to export all my blog as static, aka without requiring a server.

In this article I'm not going to explain how to create a blog with Next.js because there are a lot of articles about how to do it. Specially, I recommend the official "getting started" from Next.js when you are going to build an static blog:

- https://nextjs.org/learn/basics/create-nextjs-app

However, when I tried to do the RSS and Sitemap of my blog, all the solutions that I found was creating the pages `pages/api/sitemap.xml.js` and `pages/api/rss.xml.js` to serve this `xml` file in each request to `/api/sitemap.xml` and `/api/rss.xml` . And this is not what I wanted... I wanted to generate the RSS and Sitemap only in the build time. In this article I'll explain how I finally I do it.

##
