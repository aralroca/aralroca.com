---
title: React state with a fragmented store
created: 09/24/2021
description: Fragmented store concept and how to apply it with React Context
tags: react, javascript, teaful
series: 'React state management'
cover_image: /images/cover-images/22_cover_image.jpg
cover_image_mobile: /images/cover-images/22_cover_image_mobile.jpg
dev_to: react-state-with-a-fragmented-store-18ff
cover_color: '#E4E8EB'
---

There are many ways to manage the React state between many components: using libraries like Redux, MobX, Immer, Recoil, etc, or using a React Context.

After using several of them, I personally choose React Context because of its simplicity. To use a React Context to manage the state you have to put the state in the `Provider` along with the method to update it. Then you can consume it from the `Consumer`.

However, the problem with React Context is that if you change the value of a single field of the state, instead of updating the components that use only this field, all components that use any field from the state will be re-rendered.

<figure align="center">
  <img class="center" src="/images/blog-images/unfragmented-store-schema.gif" alt="Unfragmented store schema" />
  <figcaption><small>Unfragmented state in React Context</small></figcaption>
</figure>

In this article I'm going to explain the concept of "**fragmented store**" to solve this, and how to use it in a simple and easy way.

## What is a fragmented store

The fragmented store makes it possible to **consume each field of the store separately**. Since most of the components will consume few fields of the whole store, it's not interesting that they are re-rendered when other fields are updated.

<figure align="center">
  <img class="center" src="/images/blog-images/fragmented-store-schema.gif" alt="Fragmented store schema" />
  <figcaption><small>Fragmented store in React Context</small></figcaption>
</figure>

To solve this with React Context you have to create a context for each field of the store, which is not very feasible due to its difficulty.

```jsx
// ❌  Not recommended
<UsernameProvider>
  <AgeProvider>{children}</AgeProvider>
</UsernameProvider>
```

Naturally, if we have very few properties in the "store" it could work. But when we start to have too many, there will be too much logic implemented to solve the problem of re-rendering, since it would be necessary to implement each context for each property.

However, I have good news, it can be automatically created.

## How to use a fragmented store

I created a tiny library (500b) called **[fragmented-store](https://github.com/aralroca/fragmented-store)** to make it super simple and easy to use. It uses React Context underneath (I'll explain later what it does exactly).

<figure align="center">
  <img class="center" style="max-width: 178px" src="https://raw.githubusercontent.com/aralroca/fragmented-store/master/logo.svg" alt="Fragmented store logo" />
  <figcaption><small>Fragmented store logo</small></figcaption>
</figure>

### Create context + add the Provider

Just as we would go with the React Context, we need to create the context and add the provider to the application. We'll take this opportunity to initialize the store to the data we want at the beginning.

```jsx
import createStore from 'fragmented-store'

// It is advisable to set all the fields. If you don't know the
// initial value you can set it to undefined or null to be able
// to consume the values in the same way
const { Provider } = createStore({
  username: 'Aral',
  age: 31,
})

function App() {
  return <Provider>{/* rest */}</Provider>
}
```

### Consume one field

For the example, we will make 2 components that consume a field of the store. As you'll see, it's similar to having a `useState` in each component with the property that you want, with the difference that several components can share the same property with the same value.

```jsx
import createStore from 'fragmented-store'

// We can import hooks with the property name in camelCase.
// username -> useUsername
// age -> useAge
const { Provider, useUsername, useAge } = createStore({
  username: 'Aral',
  age: 31,
})

function App() {
  return (
    <Provider>
      <UsernameComponent />
      <AgeComponent />
    </Provider>
  )
}

// Consume the "username" field
function UsernameComponent() {
  const [username, setUsername] = useUsername()
  return (
    <button onClick={() => setUsername('AnotherUserName')}>
      Update {username}
    </button>
  )
}

// Consume the "age" field
function AgeComponent() {
  const [age, setAge] = useAge()
  return (
    <div>
      <div>{age}</div>
      <button onClick={() => setAge((s) => s + 1)}>Inc age</button>
    </div>
  )
}
```

When the `AgeComponent` updates the `age` field only the `AgeComponent` is re-rendered. The `UsernameComponent` is not re-rendered since it does not use the same fragmented part of the store.

### Consume all the store

In case you want to update several fields of the store, you can consume the whole store directly. The component that consumes all the store will be re-render for any updated field.

```jsx
import createStore from 'fragmented-store'

// Special hook useStore
const { Provider, useStore } = createStore({
  username: 'Aral',
  age: 31,
})

function App() {
  return (
    <Provider>
      <AllStoreComponent />
    </Provider>
  )
}

// Consume all fields of the store
function AllStoreComponent() {
  const [store, update] = useStore()

  console.log({ store }) // all store

  function onClick() {
    update({ age: 32, username: 'Aral Roca' })
  }

  return <button onClick={onClick}>Modify store</button>
}
```

And again, if we only update some fields, the components that consume these fields will be re-rendered while other components that consume other fields won't!

```js
// It only updates the "username" field, other fields won't be updated
// The UsernameComponent is going to be re-rendered while AgeComponent won't :)
update({ username: 'Aral Roca' })
```

You don't need to do this _(even if it's supported)_:

```js
update((s) => ({ ...s, username: 'Aral' }))
```

With this only the components that consume the `username` field with the `useUsername` hook would be re-rendered.

## How is implemented underneath

The [fragmented-store](https://github.com/aralroca/fragmented-store) library is a single [very short file](https://github.com/aralroca/fragmented-store/blob/master/index.js). It's similar of what we'd manually do to create several React Contexts for each property. It automatically creates everything you need to consume and update them (hooks).

```jsx
import React, { useState, useContext, createContext } from 'react'

export default function createStore(store = {}) {
  const keys = Object.keys(store)
  const capitalize = (k) => `${k[0].toUpperCase()}${k.slice(1, k.length)}`

  // storeUtils is the object we'll return with everything
  // (Provider, hooks)
  //
  // We initialize it by creating a context for each property and
  // returning a hook to consume the context of each property
  const storeUtils = keys.reduce((o, key) => {
    const context = createContext(store[key]) // Property context
    const keyCapitalized = capitalize(key)

    if (keyCapitalized === 'Store') {
      console.error(
        'Avoid to use the "store" name at the first level, it\'s reserved for the "useStore" hook.'
      )
    }

    return {
      ...o,
      // All contexts
      contexts: [...(o.contexts || []), { context, key }],
      // Hook to consume the property context
      [`use${keyCapitalized}`]: () => useContext(context),
    }
  }, {})

  // We create the main provider by wrapping all the providers
  storeUtils.Provider = ({ children }) => {
    const Empty = ({ children }) => children
    const Component = storeUtils.contexts
      .map(({ context, key }) => ({ children }) => {
        const ctx = useState(store[key])
        return <context.Provider value={ctx}>{children}</context.Provider>
      })
      .reduce(
        (RestProviders, Provider) =>
          ({ children }) =>
            (
              <Provider>
                <RestProviders>{children}</RestProviders>
              </Provider>
            ),
        Empty
      )

    return <Component>{children}</Component>
  }

  // As a bonus, we create the useStore hook to return all the
  // state. Also to return an updater that uses all the created hooks at
  // the same time
  storeUtils.useStore = () => {
    const state = {}
    const updates = {}
    keys.forEach((k) => {
      const [s, u] = storeUtils[`use${capitalize(k)}`]()
      state[k] = s
      updates[k] = u
    })

    function updater(newState) {
      const s =
        typeof newState === 'function' ? newState(state) : newState || {}
      Object.keys(s).forEach((k) => updates[k] && updates[k](s[k]))
    }

    return [state, updater]
  }

  // Return everything we've generated
  return storeUtils
}
```

## Demo

I created a Codesandbox in case you want to try how it works. I added a `console.log` in each component so you can check when each one is re-rendered. The example is super simple, but you can try creating your own components and your state.

- https://codesandbox.io/s/fragmented-store-example-4p5dv?file=/src/App.js

<iframe
  src="https://codesandbox.io/embed/fragmented-store-example-4p5dv?fontsize=14&hidenavigation=0&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="webgl-triangle"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Conclusions

In this article I've explained the benefits of the "fragmented store" concept and how to apply it with React Context without the need to manually create many contexts.

In the example of the article and the fragmented-store library the fragmentation level is only at the first level for now. The library I've implemented is in a very early stage and there are certainly a number of improvements that could be made. Any proposal for changes can be made on GitHub as the project is open source and will be very well received:

- https://github.com/aralroca/fragmented-store
