---
title: 'Teaful: tiny, easy and powerful React state management'
created: 11/05/2021
description: 'Teaful is a new npm package where you can manage your stores with less than 1kb without the need of boilerplate: reducers, actions, selectors, connect, etc. And without unnecessary rerenders! It subscribes only to the changes of the used properties.'
tags: react, javascript, redux
series: 'React state management'
cover_image: /images/cover-images/23_cover_image.jpg
cover_image_mobile: /images/cover-images/23_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/23_cover_image_vert.jpg
cover_color: '#0C152C'
---

I've recently talked about Fragmented-store in [another article](react-fragmented-store), a library I was developing, explaining future improvements. Well, we have made a reimplementation to make it tinier, easier to use and more powerful, and we have renamed it to **Teaful**. In this article I will talk about its benefits and how to use it.

This is **the final name**. Since the library was created, it has been called:

* ~~`Fragmented-store`~~ -> ~~`Fragstore`~~ -> **`Teaful`** <small>_([Teaful GitHub](https://github.com/teafuljs/teaful) )_.</small>

<figure align="center">
  <img class="center" width="200" src="/images/blog-images/teaful-logo.svg" alt="Teaful logo" />
  <figcaption><small>Teaful new logo</small></figcaption>
</figure>

## Why tiny?

Teaful is **less than 1kb** and you won't need to write so much code. In other words, it will make your project much more lightweight.

```sh
874 B: index.js.gz
791 B: index.js.br
985 B: index.modern.js.gz
888 B: index.modern.js.br
882 B: index.m.js.gz
799 B: index.m.js.br
950 B: index.umd.js.gz
856 B: index.umd.js.br
```

## Why easy?

To consume and modify store properties sometimes requires a lot of boilerplate: actions, reducers, selectors, connect, etc. Teaful's goal is to be **very easy to use**, to consume a property and overwrite it **without any boilerplate**. "Tiny" and "powerful", because if you have to write a lot to do a simple thing, your project takes more kb and becomes less maintainable.

<figure align="center">
  <img class="center" src="/images/blog-images/easy.png" alt="Teaful easy to use" />
  <figcaption><small>Teaful: Easy to use without boilerplate</small></figcaption>
</figure>


## Why powerful?

Besides doing the code more maintainable, you avoid many **unnecessary rerenders** while the performance of your website gets better. When you only update one property of the store, it's not necessary to notify all the components that use the store. It only requires to notify who's consuming that updated property.

<figure align="center">
  <img class="center" src="/images/blog-images/rerenders.gif" alt="Teaful rerenders" />
  <figcaption><small>Teaful rerenders</small></figcaption>
</figure>


## What other benefits does it have?

In this section of the article we'll see a few of the many things that can be done.

If you use Teaful in a small project you'll be able to move fast without tools like Redux or Mobx that can be overkill. Also, if you use it in large projects they will be more maintainable and won't grow in code.

### Creating store properties on the fly

You can consume and update nonexistent store properties and define them on the fly.

```js
const { useStore } = createStore()

export function Counter() {
  const [count, setCount] = useStore.count(0); // 0 as initial value

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment counter
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        Decrement counter
      </button>
    </div>
  )
}
```

### Works with heavily nested properties

You can consume / manipulate any property wherever it is in the store.

```js
const { useStore } = createStore({
  username: "Aral",
  counters: [
    { name: "My first counter", counter: { count: 0 } }
  ]
})

export function Counter({ counterIndex = 0 }) {
  const [count, setCount] = useStore.counters[counterIndex].counter.count();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment counter
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        Decrement counter
      </button>
    </div>
  )
}
```

### Reseting a store property to the initial value

Unlike hooks like React's useState, in Teaful there is a third element to reset the property to its initial value.

```js
const { useStore } = createStore({ count: 0 })

export function Counter() {
  const [count, setCount, resetCounter] = useStore.count();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment counter
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        Decrement counter
      </button>
      <button onClick={resetCounter}>
        Reset counter
      </button>
    </div>
  )
}
```

It's in all levels, if you want to reset the whole store to its initial value you can do it with:

```js
const [store, setStore, resetStore] = useStore();
// ...
resetStore()
```

### Using more than one store

Although it is not necessary, you can have several stores and rename the hooks with more personalized names.

```js
import createStore from "teaful";

export const { useStore: useCart } = createStore({ price: 0, items: [] });
export const { useStore: useCounter } = createStore({ count: 0 });
```

You can also use them in your components:


```js
import { useCounter, useCart } from "./store";

function Cart() {
  const [price, setPrice] = useCart.price();
  // ... rest
}

function Counter() {
  const [count, setCount] = useCounter.count();
  // ... rest
}
```

### Using customized updaters

If you want several components to use the same updaters without reimplementing them, you can predefine them thanks to the `getStore` helper.

```js
import createStore from "teaful";

export const { useStore, getStore } = createStore({ count: 0 });

const [, setCount] = getStore.count()

export const incrementCount = () => setCount(c => c + 1)
export const decrementCount = () => setCount(c => c - 1)
```

And use them in your components:

```js
import { useStore, incrementCount, decrementCount } from "./store";

export function Counter() {
  const [count] = useStore.count();

  return (
    <div>
      <span>{count}</span>
      <button onClick={incrementCount}>
        Increment counter
      </button>
      <button onClick={decrementCount}>
        Decrement counter
      </button>
    </div>
  )
}
```

### Optimistic updates

If you want to make an optimistic update (when you update the store and save the value by calling the api, if the api request fails revert to the previous value). You can do it thanks to the `onAfterUpdate` function.

```js
import createStore from "teaful";

export const { useStore, getStore } = createStore({ count: 0 }, onAfterUpdate);

function onAfterUpdate({ store, prevStore }) {
  if(store.count !== prevStore.count) {
    const [count, setCount, resetCount] = getStore.count()
  
    fetch('/api/count', { method: 'PATCH', body: count })
    .catch(e => setCount(prevStore.count))
  }
}
```

Your components won't need any changes:

```js
import { useStore } from "./store";

export function Counter() {
  const [count, setCount] = useStore.count();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>
        Increment counter
      </button>
      <button onClick={() => setCount(c => c - 1)}>
        Decrement counter
      </button>
    </div>
  )
}
```

If you want the optimistic update to be only for one component and not for all, you can register it with:

```js
const [count, setCount] = useStore.count(0, onAfterUpdate);
```

### Calculated store properties

If we want the `cart.price` to always be a precomputed value of another property, for example from `cart.items`, we can do it in the `onAfterUpdate` function.

```js
export const { useStore, getStore } = createStore(
  {
    cart: {
      price: 0,
      items: ['apple', 'banana'],
    },
  },
  onAfterUpdate,
);

function onAfterUpdate({ store, prevStore }) {
  calculatePriceFromItems()
  // ...
}

function calculatePriceFromItems() {
  const [price, setPrice] = getStore.cart.price(); 
  const [items] = getStore.cart.items();
  const calculatedPrice = items.length * 3;

  if (price !== calculatedPrice) setPrice(calculatedPrice);
}
```

Your components won't need any changes:

```js
import { useStore } from "./store";

export function Counter() {
  const [price] = useStore.cart.price();

  // 6€
  return <div>{price}€</div>
}
```

## Learn more about Teaful

If you want to try it out, I encourage you to go to the [README](https://github.com/teafuljs/teaful/blob/0.7.0/README.md) to read the Teaful documentation, see all the options and learn how to get started. There is also an example section where you can try it. We will upload more examples over time.

## Conclusions

Teaful is still at an early stage (version 0.x), so there may still be several improvements in the library to make version 1.0 even more tiny, easy and powerful. Any contribution to the library or suggestions will be very welcome.

For the short life of the library, the community is growing fast and I thank all those who have contributed 👏 😊