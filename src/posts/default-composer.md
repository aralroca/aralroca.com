---
title: '👋 Say Goodbye to Spread Operator: Use Default Composer'
created: 06/05/2023
description: '"Default-composer" is a tiny library that simplifies setting default values for nested objects'
tags: javascript, node, react
cover_image: /images/cover-images/27_cover_image.jpg
cover_image_mobile: /images/cover-images/27_cover_image_mobile.jpg
cover_color: '#2A343A'
dev_to: say-goodbye-to-spread-operator-use-default-composer-3c2j
---

When working with objects in JavaScript, it is common to need to set default values for empty `strings`/`objects`/`arrays`, `null`, or `undefined` properties. When dealing with nested objects, this can become even more complicated and require complex programming logic. However, with the "**[default-composer](https://github.com/aralroca/default-composer)**" library, this task becomes simple and easy.

## What is "default-composer"?

"[default-composer](https://github.com/aralroca/default-composer)" is a lightweight (~300B) JavaScript library that allows you to set default values for nested objects. The library replaces empty strings/arrays/objects, null, or undefined values in an existing object with the defined default values, which helps simplify programming logic and reduce the amount of code needed to set default values.

<a href="https://github.com/aralroca/default-composer" target="_blank">
  <figure align="center">
    <img class="center" width="200" height="200" src="/images/blog-images/default-composer.svg" alt="Default Composer logo" />
    <figcaption><small>Default Composer logo</small></figcaption>
  </figure>
</a>

## Benefits over Spread Operator and Object.assign

While [`...spread` operator](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax) and [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) can also be used to set default values for objects, "**[`default-composer`](https://github.com/aralroca/default-composer)**" provides several benefits over these methods.

- Works with **nested objects**, whereas the spread operator and `Object.assign()` only work with shallow objects.
- More concise and **easier to read** than spread operator or `Object.assign()`. The code required to set default values with these methods can become very verbose and difficult to read, especially when dealing with nested objects.
- More granular **control** over which **properties** should be **set to default values**. With spread operator and `Object.assign()`.

Imagine we have this original object:

```js
const original = {
  name: '',
  score: null,
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  emails: [],
  hobbies: [],
  another: 'anotherValue',
}
```

And these are the defaults:

```js
const defaults = {
  name: 'John Doe',
  score: 5,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  emails: ['john.doe@example.com'],
  hobbies: ['reading', 'traveling'],
}
```

We want to merge these objects replacing the original values that are `""`, `null`, `[]`, `undefined` and `{}` to the default value. So the idea is to get:

```js
console.log(results)
/**
 * {
 * "name": "John Doe",
 * "score": 5,
 * "address": {
 *   "street": "123 Main St",
 *   "city": "Anytown",
 *   "state": "CA",
 *   "zip": "12345"
 * },
 * "emails": [
 *   "john.doe@example.com"
 * ],
 * "hobbies": [
 *   "reading",
 *   "traveling"
 * ],
 * "another": "anotherValue"
 **/
```

Probably with spread operator we will have to do something like that:

```js
const results = {
  ...defaults,
  ...original,
  name: original.name || defaults.name,
  score: original.score ?? defaults.score, // "??" beacause 0 is valid
  address: {
    ...defaults.address,
    ...original.address,
    street: original.address.street || defaults.address.street,
    city: original.address.city || defaults.address.city,
    state: original.address.state || defaults.address.state,
    zip: original.address.zip || defaults.address.zip,
  },
  emails: original.emails.length ? original.emails : defaults.emails,
  hobbies: original.hobbies.length ? original.hobbies : defaults.hobbies,
}
```

and with `Object.assign` something like this:

```js
const results = Object.assign({}, defaults, original, {
  name: original.name || defaults.name,
  score: original.score ?? defaults.score, // "??" beacause 0 is valid
  address: Object.assign({}, defaults.address, original.address, {
    street: original.address.street || defaults.address.street,
    city: original.address.city || defaults.address.city,
    state: original.address.state || defaults.address.state,
    zip: original.address.zip || defaults.address.zip,
  }),
  emails: original.emails.length ? original.emails : defaults.emails,
  hobbies: original.hobbies.length ? original.hobbies : defaults.hobbies,
})
```

Maintaining this can be very tidious, especially with huge, heavily nested objects.

<figure align="center">
  <img class="center" width="500" height="333" src="/images/blog-images/headache.jpg" alt="Headache" />
  <figcaption><small>Headache...</small></figcaption>
</figure>

With `defaultComposer` we could only use this:

```js
import defaultComposer from 'default-composer' // 300B
// ...
const results = defaultComposer(defaults, original)
```

Easier to maintain, right? 😉

<figure align="center">
  <img class="center" width="500" height="347" src="/images/blog-images/learning-js.jpg" alt="Easier" />
  <figcaption><small>Happier an easier</small></figcaption>
</figure>

What happens if in our project there is a special property that works differently from the others and we want another replacement logic? Well, although `defaultComposer` has by default a configuration to detect the defautable values, you can configure it as you like.

```ts
import { defaultComposer, setConfig } from 'default-composer'

setConfig({
  // This function is executed for each value of each key that exists in
  // both the original object and the defaults object.
  isDefaultableValue: (
    // - key: key of original or default object
    // - value: value in the original object
    // - defaultableValue: pre-calculed boolean, you can use or not,
    //   depending if all the rules of the default-composer library are correct
    //   for your project or you need a totally different ones.
    { key, value, defaultableValue }
  ) => {
    if (key === 'rare-key') {
      return defaultableValue || value === 'EMPTY'
    }

    return defaultableValue
  },
})
```

## Conclusions

I've introduced the "[default-composer](https://github.com/aralroca/default-composer)" library as a solution for setting **default values** for **nested objects** in JavaScript.

The library is lightweight and provides more concise and easier-to-read code than the spread operator and `Object.assign` methods. It also offers more granular control over which properties should be set to default values.

In this article I provide examples of how to use the library and how it simplifies the code for maintaining nested objects.

Finally, I explain how the library **can be configured** to handle **special cases** where a different replacement logic is required. Overall, "[default-composer](https://github.com/aralroca/default-composer)" is a useful library for simplifying the task of setting default values for nested objects in JavaScript.
