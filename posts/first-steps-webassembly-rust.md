---
title: First steps with WebAssembly in Rust
created: 08/17/2020
description: Discover how to start with WebAssembly in a easy way with Rust.
tags: javascript, rust, webassembly
cover_image: /images/cover-images/16_cover_image.jpg
cover_image_mobile: /images/cover-images/16_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/16_cover_image_vert.jpg
cover_color: '#130913'
---

In this article we will see how to **run native code in the browser**, doing web applications faster, being able to reuse old code like retro videogames, and at the same time learning the future of web development. So we will learn the first steps with **WebAssembly**, and we will see it with **Rust**.

**We will cover the following:**

- [What is WebAssembly?](#what-is-webassembly)
- [Why in Rust?](#why-in-rust)
- [Execute Rust code from JavaScript](#execute-rust-code-from-javascript)
  - [Rust code](#rust-code)
  - [Compilation](#compilation)
  - [Use .wasm from JavaScript](#use-wasm-from-javascript)
- [Execute JavaScript code from Rust
  ](#execute-javascript-code-from-rust)
- [Performance - JavaScript vs Rust
  ](#performance---javascript-vs-rust)
- [Debugging](#debugging)
- [Publishing to NPM](#publishing-to-npm)
- [Code from the article](#code-from-the-article)
- [Conclusions](#conclusions)
- [References](#references)

## What is WebAssembly?

In all current browsers there is a JavaScript engine that interprets and executes the code. This has enabled us to implement very rich web applications because JavaScript is a more complete and better language every time. However, JavaScript is a high-level language and is not ideal for all the tasks we want to develop as it has **not been developed to be a fast language** with a lot of performance.

WebAssembly (**WASM**) is a new portable **binary-code format** that can be executed in modern browsers, it comes complemented with a **text format** (**WAT**) to make it more **readable/debuggable** for us, in addition to allow us to code directly in a kind of "assembly" code. It's an open [W3C standard](https://www.w3.org/TR/wasm-core-1/) still in development that allow us to write **fast and efficient** code for the web in other languages than JavaScript and it runs with a **similar performance that the native language**. It's not here to replace JavaScript, but to complement it.

<figure align="center">
  <img src="/images/blog-images/js-engine.png" alt="JavaScript engine" class="center transparent" />
  <figcaption><small>JavaScript and WASM engine</small></figcaption>
</figure>

Another purpose of WebAssembly is to keep the web **secure**, light and fast, keeping a **small** `.wasm` **file size** and always maintaining **backwards-compatibility** in new WASM features, this way the web won't broken.

There are more than [40 supported languages](https://github.com/appcypher/awesome-wasm-langs) for WebAssembly, the most common are C, C++ and Rust for their performance and maturity, although you also can write code for WASM with high-level languages as Python, PHP or even JavaScript!

Some **practical uses** of WebAssembly:

- Encryption
- Games that require a lot of assets
- Image and video editing
- P2P
- Performant algorithms
- VR, AR
- Visualizations and simulations
- A big etc...

<figure align="center">
  <img src="/images/blog-images/vr.jpg" alt="Virtual Reallity" class="center" />
  <figcaption><small>Photo by XR Expo on Unsplash</small></figcaption>
</figure>

## Why in Rust?

Maybe we wonder why in [Rust](https://www.rust-lang.org/), having so many languages available with WebAssembly? There are several reasons to use Rust, among many others:

- **Performance**: Rust is free from the non-deterministic garbage collection and it gives to programmers the control over indirection, monomorphization, and memory layout.
- **Small `.wasm` sizes**: Rust lacks a runtime, enabling small `.wasm` size because there is no extra bloat included like a garbage collector. Hence you only pay in code size, for these functions that you are using.
- **Integration**: Rust and Webassembly integrates with existing JavaScript tooling (npm, Webpack...).

<figure align="center">
  <img src="/images/blog-images/rust-performance.jpeg" alt="Rust performance" class="center" />
  <figcaption><small>Rust performance</small></figcaption>
</figure>

## Execute Rust code from JavaScript

Assuming you have both [NPM](https://www.npmjs.com/) (for JS) and [Cargo](https://doc.rust-lang.org/cargo/) (for Rust), another prerequisite we need to be installed is [wasm-pack](https://github.com/rustwasm/wasm-pack):

```
> cargo install wasm-pack
```

### Rust code

Let's create a new Rust project for the "Hello world":

```
> cargo new helloworld --lib
```

And on `Cargo.toml` we are going to add the `cdylib` for `wasm` final artifacts, and [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) to facilitate high-level interactions between Wasm modules and JavaScript.

```toml
[package]
name = "helloworld"
version = "0.1.0"
authors = ["Aral Roca Gomez <contact@aralroca.com>"]
edition = "2018"

## new things...
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.67"

[package.metadata.wasm-pack.profile.release]
wasm-opt = ["-Oz", "--enable-mutable-globals"]
```

The latest part about `--enable-mutable-globals` in principle in upcoming `wasm-bindgen` releases should not be needed, but for this tutorial it's necessary, otherwise [we can not work with Strings](https://github.com/rustwasm/wasm-pack/issues/886#issuecomment-667669802).

> **Note**: WebAssembly only supports the i32, u32, i64 and u64 types. So if you want to work with other types, such as String or Objects, you must first encode them. However, the **wasm-bindgen** does these bindings for us. So there's no need to worry about it anymore.

Let's write our "Hello world" function in `src/lib.rs`:

```rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn helloworld() -> String {
    String::from("Hello world from Rust!")
}
```

### Compilation

Let's compile Rust's code with:

```
> wasm-pack build --target web
```

We are using the web target, however there are different targets that we can use depending how we want to use that `wasm` file:

- **--target bundler** - for bundlers like Webpack, Parcel or Rollup.
- **--target web** - for the web as ECMAScript module.
- **--target no-modules** - for the web without ECMAScript module.
- **--target nodejs** - for Node.js

After executing the above command, a `pkg` directory will have been created with our JavaScript library containing the code we have made in Rust! It even generates the types files of TypeScript.

```bh
> ls -l pkg
total 72
-rw-r--r--  1 aralroca  staff    929 Aug 15 13:38 helloworld.d.ts
-rw-r--r--  1 aralroca  staff   3210 Aug 15 13:38 helloworld.js
-rw-r--r--  1 aralroca  staff    313 Aug 15 13:38 helloworld.wasm
-rw-r--r--  1 aralroca  staff    268 Aug 15 13:38 helloworld_bg.d.ts
-rw-r--r--  1 aralroca  staff  15160 Aug 15 13:38 helloworld_bg.wasm
-rw-r--r--  1 aralroca  staff    289 Aug 15 13:38 package.json
```

As we can see, the size of the wasm, although it is a little bigger than the code we would write in JavaScript, is still small.

### Use .wasm from JavaScript

In order to use the `wasm` file in our JavaScript, we can import the generated `pkg` module to our project. To test it, we can create an `index.html` on the root of the Rust project with this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>"Hello world" in Rust + Webassembly</title>
    <script type="module">
      import init, { helloworld } from './pkg/helloworld.js'

      async function run() {
        await init()
        document.body.textContent = helloworld()
      }

      run()
    </script>
  </head>

  <body></body>
</html>
```

As you can see, before using the `add` function is important to call the asyncronous `init` function in order to load the `wasm` file. Then, we can use the public rust functions in an easy way!

To test it, you can do `npx serve .` and open `http://localhost:5000`.

<figure align="center">
  <img src="/images/blog-images/helloworld-result-rust-wasm.png" class="center" alt="Result of hello world in Rust and WASM" />
  <figcaption><small>Result of hello world in Rust and WASM</small></figcaption>
</figure>

## Execute JavaScript code from Rust

It is possible within Rust to use JavaScript code, for example to use `window` variables, write in the DOM or call internal functions such as `console.log`. All we have to do is declare the JavaScript bindings we want to use inside `extern "C"`.

```rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn example() {
    log("Log from rust");
}
```

And in JS:

```js
import init, { example } from './pkg/helloworld.js'

async function run() {
  await init()
  example() // This will log "Log from rust" to the console
}

run()
```

## Performance - JavaScript vs Rust

To make a performance test between Rust and JavaScript, I will compare the fibonacci function in the two languages:

```rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 | 1 => n,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
```

And let's compare it with JavaScript using the `console.time` to measure the performance of each one:

```js
import init, { fibonacci } from './pkg/helloworld.js'

function fibonacciInJs(n) {
  if (n <= 1) return n
  return fibonacciInJs(n - 1) + fibonacciInJs(n - 2)
}

async function run() {
  await init()
  const num = 20

  console.time('Fibonnaci in rust')
  const fibRust = fibonacci(num)
  console.timeEnd('Fibonnaci in rust')

  console.time('Fibonnaci in JS')
  const fibJS = fibonacciInJs(num)
  console.timeEnd('Fibonnaci in JS')

  document.body.textContent = `Fib ${num}:  Rust ${fibRust} - JS ${fibJS}`
}

run()
```

And the result:

<figure align="center">
  <img src="/images/blog-images/fibonacci-rust-vs-js.png" alt="Performance of fibonnaci function Rust vs JavaScript" class="center" />
  <figcaption><small>Performance of fibonnaci function Rust vs JavaScript</small></figcaption>
</figure>

- In Rust: 0.13ms
- In JS: 1.28ms

Around **x10 times faster** in Rust than in JS!

However, it's important to note that not all functions we implement in Rust will be faster than in JavaScript. But there will be a considerable improvement in many of them that require recursion or loops.

## Debugging

If in the `devtools -> source` we look inside our files for our `.wasm` file, we will see that instead of binary, it shows us the WAT file so that it is more understandable and we can debug it in a better way than with wasm directly.

<figure align="center">
  <img src="/images/blog-images/debug-wasm.jpg" alt="Debug WASM in Chrome dev tools" class="center" />
  <figcaption><small>Debug WASM in Chrome dev tools</small></figcaption>
</figure>

For a better debugging experience, you can use the `--debug` flag to display the names of the functions you have used in Rust.

```
> wasm-pack build --target web --debug
```

For now using `wasm-bindgen` it's not possible to use source-maps to display the code in Rust on devtools. But I guess in the future it will be available.

## Publishing to NPM

Once we have our pkg directory generated, we can package it with:

```
>  wasm-pack pack myproject/pkg
```

And publish it at npm with:

```
> wasm-pack publish
```

They work the same way as with `npm pack` and `npm publish`, so we could use the same flags as `wasm-pack publish --tag next`.

## Code from the article

I uploaded the code used in this article to my GitHub:

- https://github.com/aralroca/helloworld-wasm-rust

## Conclusions

In this article we have seen a bit of what WebAssembly is and what is necessary to start creating web applications with Rust.

Although we have used Rust, it is possible to use many other languages, although Rust is one of the best integrated. This way, we can bring back to life old applications made with languages like C, C++ , and implement more futuristic applications for VR or AR and all this thanks to the browser! Portable on all devices, just like JavaScript.

## References

- https://rustwasm.github.io/book/why-rust-and-webassembly.html
- https://depth-first.com/articles/2020/07/07/rust-and-webassembly-from-scratch-hello-world-with-strings/
- https://kripken.github.io/blog/binaryen/2018/04/18/rust-emscripten.html
- https://github.com/webassembly/wabt
- https://blog.logrocket.com/webassembly-how-and-why-559b7f96cd71/#:~:text=What%20WebAssembly%20enables%20you%20to,JavaScript%2C%20it%20works%20alongside%20JavaScript.
