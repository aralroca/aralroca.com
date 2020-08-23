---
title: Do all roads lead to Rome?
created: 08/24/2020
description: Learn what Rome is, how it fits into the JavaScript ecosystem and my thoughts about it... Will Rome replace all the current tooling?
tags: webdev, javascript
cover_image: /images/cover-images/17_cover_image.jpg
cover_image_mobile: /images/cover-images/17_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/17_cover_image_vert.jpg
cover_color: '#BFB094'
---

We'll see what [Rome](https://github.com/romefrontend/rome) is, how it fits into the JavaScript ecosystem and my thoughts about it. **Will Rome replace all the current tooling?** Let's see.

## What is Rome?

[**Rome**](https://github.com/romefrontend/rome) is a CLI that unifies the JavaScript and Typescript development toolchain: bundling, compiling, documentation generation, formatting, linting, minification, testing, type checking, etc. It tries to be a "**one-in-all**" solution, being able to do all these tasks under one CLI.

Perhaps you wonder if we can handle Webpack, Babel, Prettier, Jest, etc with this Rome CLI? The answer is **NO**... Rome implemented all these toolchain **from scratch**, without any dependency, using the same configuration file for everything.

The person behind this project is [Sebastian McKenzie](https://twitter.com/sebmck), the same author of Babel and Yarn, who has also worked on projects such as Prepack and React Native.

<figure align="center">
 <img src="/images/blog-images/rome-paths.jpg" alt="All tools lead to Rome" class="center" />
  <figcaption><small>All tools lead to Rome</small></figcaption>
</figure>

> Rome is **still in beta**, and right now the only current area fully implemented is **linting**. The other areas are still in development.

## Better performance

Current tools as webpack, TS, Babel or ESlint, among others, **run their own parser** to generate an [**Abstract Syntax Tree**](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST). After this, they manipulate and process their own AST. 

When all these tasks become the only tool (Rome), we'll be able to reuse the AST for each task, parsing the files **only once**. Also, some processes will be simplified, for example: watching files, dependency verification or integration with your editor.

<figure align="center">
 <img src="/images/blog-images/ast-toolchain.png" alt="Reusing the AST" class="center transparent" />
  <figcaption><small>Reusing the AST</small></figcaption>
</figure>

Who benefits?

- **Maintainers/contributors**: simplifies all unnecessary duplications.
- **Developers**: a faster development experience with less consumption of resources.


## Only one configuration file

Right now we need to configure too many tools for a simple feature, for example, to work with absolute imports you need to configure ESLint, TS and also webpack! 

<figure align="center">
 <img src="/images/blog-images/config-duplication.png" alt="Config duplication" class="center transparent" />
  <figcaption><small>Config duplication</small></figcaption>
</figure>

Instead, using the same tool (Rome) removes the duplicated configurations, so we'll only have one config file.

<figure align="center">
 <img src="/images/blog-images/one-config.png" alt="One config file for everything" class="center transparent" />
  <figcaption><small>One config file for everything</small></figcaption>
</figure>

In addition, some tools configurations are currently depending on others, for example, Prettier has to be integrated with ESLint to avoid conflicting formatting. Often this tools integrations require adding a whole bunch of plugins to make them work together but, with Rome, we don't have the need to use **any plugin** since all the tools are **perfectly integrated**.

Who benefits?

- **Maintainers/contributors**: Tools like Babel had exposed all their internals to allow the creation of plugins, making it much more difficult to maintain and evolve.
- **Developers**: For a feature, you only need to touch one configuration, **simplifying the development** without the need of plugins. It also makes it much easier to **reuse settings** between projects.

## Less dependencies

In the JavaScript ecosystem we're used to work with many `devDependencies` for all the tools and their plugins: Jest, Babel, Prettier, webpack. Besides, each of them have their own dependencies.

With Rome, many of these `devDependencies` disappear, moreover [**Rome has zero sub-dependencies**](https://github.com/romefrontend/rome/blob/4fdfc5fb7252085ede73a342d895457328dca46e/package.json#L8).

<figure align="center">
 <img src="/images/blog-images/dependencies-rome.gif" alt="Webpack vs Rome dependencies tree" class="center" />
  <figcaption><small>Webpack vs Rome dependencies tree</small></figcaption>
</figure>

So we have:

- **Stronger security**: The chance to have a vulnerability decreases because we drastically reduce all dependencies.
- **Better maintenance and evolution of your project**: Before, updating a new release of some tool could broke the integration with another one. Now all is under one well integrated big tool.
- **Better maintanance and evolution of Rome**: Rome has no dependencies, this means it has a lot of flexibility and a great innovator potential. For example, if they wanted to migrate to another language using wasm, they could do it.
- **Faster installation**: You won't have to wait so long after doing `npm install`. Less things to install.

## Friendly for beginners

As we've seen in the previous sections, Rome makes it much **easier to start** a project. 

We feel more encouraged to start learning something new if we see that it has an easy start. In the last years starting JavaScript projects without frameworks was really complicated. Simplifying all this tooling will encourage many to learn and enter the world of JavaScript in a much more enjoyable way.

<figure align="center">
 <img src="/images/blog-images/learning-js.jpg" alt="Picture of a woman learning JavaScript" class="center" />
  <figcaption><small>Photo by Annie Spratt on Unsplash</small></figcaption>
</figure>

In order to take the first steps in Rome, you only need to [install it](https://romefrontend.dev/#installation) via `yarn` or `npm`, and then run `rome init` to create the default `.config/rome.rjson`. 

Finally you can use every command of the CLI using `rome [command]`, as `rome check` for linting a set of files, `rome format` to format a single file, `rome start` to start a daemon, etc. You can see all the available commands by running `rome --help`.

## Do all roads lead to Rome? My thoughs about it

We started the article questioning about if **Rome is going to replace all current toolchain**. It's a question that will be answered over time, depending on the adoption of Rome within the community and the evolution of Rome and the current tools. 

From my point of view, I think that in a short term the answer is "no". Although it replaces the functionality of those tools, that doesn't obsolete them. There are still a lot of projects that depend on them. However, in a long term I think the answer would be "yes". It may not be Rome, maybe another similar approach like Deno adopting a similar philosophy of having everything integrated.

In my opinion, JavaScript ecosystem is too fragmented right now, you usually need to have a bunch of dependencies installed for most things. New projects like Rome or Deno, even though many people think that they're fragmenting even more the ecosystem, I think it's just the opposite. They're tools that aim to fix that fragmentation, and that's positive. 

You may be wondering if one of the pieces doesn't fit 100% your needs and you still want to use your old tool. For example you could prefer to continue using webpack as compiler. The good thing about Rome is that if you only want to use one piece, you can. Thus, you can also use all of Rome's pieces except the compiler, to continue using webpack or another one.

<figure align="center">
 <img src="/images/blog-images/me.jpg" alt="Aral Roca (me) in philosophical mode" class="center" />
  <figcaption><small>Aral Roca (me) in philosophical mode</small></figcaption>
</figure>

Now it's your turn, what do you think about the future of JavaScript / TypeScript tooling?

## References

- https://romefrontend.dev/blog/2020/08/08/introducing-rome.html
- https://news.ycombinator.com/item?id=24094377
- https://jasonformat.com/rome-javascript-toolchain/
