---
title: React state with a fragmented store
created: 09/24/2021
description: 
tags: react, javascript
cover_image: /images/cover-images/21_cover_image.jpg
cover_image_mobile: /images/cover-images/21_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/21_cover_image_vert.jpg
cover_color: '#20282D'
---

To manage the React state between many components there are many ways: use libraries like Redux, MobX, Immer, Recoil, etc, or use a React context.

After using several of them, I personally choose React context because of its simplicity. To use a React context as state management you have to put the state in the `Provider` along with the method to update it and then from the `Consumer` you can consume it. 

However, the problem with React context is that if only a single field of the state is updated, instead of updating the components that use only this field, all components that use any field from the state are updated. 

<figure align="center">
  <img class="center" style="max-width: 600px" src="/images/blog-images/unfragmented-store-schema.gif" alt="Unfragmented store schema" />
  <figcaption><small>Unfragmented state in React context</small></figcaption>
</figure>

In this article I explain the concept of "**fragmented store**" to solve this, and how to use it in a simple and easy way.

## What is a fragmented store

The concept of fragmented store is to make it possible to **consume each field of the store separately**. Since most of the components will consume few fields of the whole store and it's not interesting that they are re-rendered when other fields that are not consumed change their value.

<figure align="center">
  <img class="center" style="max-width: 600px" src="/images/blog-images/fragmented-store-schema.gif" alt="Fragmented store schema" />
  <figcaption><small>Fragmented state in React context</small></figcaption>
</figure>

To solve this with React context you would have to create a context for each field of the store, which is not very feasible due to its difficulty.

```jsx
// ❌  Not recommended
<UsernameProvider>
  <AgeProvider>
    {children}
  </AgeProvider>
</UsernameProvider>
```

Naturally, if we have very few properties in the "store" it could work. But when we start to have too many, it would be too much logic implemented to solve the problem of re-rendering. Since it would be necessary to implement each context for each property.

However, I have good news, it can be automatically created by a React context.

## How to use a fragmented store

I've created a tiny library (500b) called **[fragmented-store](https://github.com/aralroca/fragmented-store)** to make it super simple and easy to use, it uses React Context underneath (I'll explain later what it does exactly). 

<figure align="center">
  <img class="center" style="max-width: 178px" src="https://raw.githubusercontent.com/aralroca/fragmented-store/master/logo.svg" alt="Fragmented store logo" />
  <figcaption><small>Fragmented store logo</small></figcaption>
</figure>

### Create context + add the Provider

Just as we would go with the React context, we need to create the context and add the provider to the application. We'll take this opportunity to initialize the store to the data we want at the beginning.

```jsx
import createStore from "fragmented-store";

// It is advisable to set all the fields, if you do not know the 
// initial value you can set it to undefined or null to be able 
// to consume the values in the same way. 
const { Provider } = createStore({
  username: "Aral",
  age: 31,
});

function App() {
  return (
    <Provider>
     {/* rest */} 
    </Provider>
  );
}
```

### Consume one field

For the example, we will make 2 components that consume a field of the store. As you will see, it's similar to having a `useState` in each component with the property that you want, with the difference that several components can share the same property with the same value.

```jsx
import createStore from "fragmented-store";

// We can import hooks with the same name as the property in camelCase.
// username -> useUsername
// age -> useAge
const { Provider, useUsername, useAge } = createStore({
  username: "Aral",
  age: 31,
});

function App() {
  return (
    <Provider>
     <UsernameComponent />
     <AgeComponent /> 
    </Provider>
  );
}

// Consume the "username" field
function UsernameComponent() {
  const [username, setUsername] = useUsername();
  return (
    <button onClick={() => setUsername("AnotherUserName")}>
      Update {username}
    </button>
  );
}

// Consume the "age" field
function AgeComponent() {
  const [age, setAge] = useAge();
  return (
    <div>
      <div>{age}</div>
      <button onClick={() => setAge((s) => s + 1)}>Inc age</button>
    </div>
  );
}
```

When the `AgeComponent` updates the `age` field only the `AgeComponent` is re-rendered. The `UsernameComponent` is not re-rendered since it does not use the same fragmented part of the store.


### Consume all the store

For options to update several fields of the store there is the option to use the whole store directly. This component will therefore re-render whenever you make a change to any field in the store.

```jsx
import createStore from "fragmented-store";

// Special hook useUnfragmentedStore
const { Provider, useUnfragmentedStore } = createStore({
  username: "Aral",
  age: 31,
});

function App() {
  return (
    <Provider>
     <AllStoreComponent />
    </Provider>
  );
}

// Consume all fields of the store
function AllStoreComponent() {
  const [store, update] = useUnfragmentedStore();

  console.log({ store }); // all store

  function onClick() {
    update({ age: 32, username: "Aral Roca" })
  }

  return (
    <button onClick={onClick}>Modify store</button>
  );
}
```

And again, if we only update some fields, the components that consume these fields are re-rendered but the others component that consume other fields are not re-rendered!

```js
// It only update the "username" field, other fields are not going to be updated
// The UsernameComponent is going to be re-rendered and AgeComponent no :)
update({ username: "Aral Roca" }) 
```
Isn't necessary to do this _(Even if it's supported)_:

```js
update(s => ({ ...s, username: "Aral" }))
```

Likewise, also in this way, only the components that consume the `username` field with the `useUsername` hook would be re-rendered.

## How is implemented underneath

Underneath it's similar to what we would do manually to create several React Contexts for each property, but it automatically creates everything you need to consume and update them (hooks). 

The [fragmented-store](https://github.com/aralroca/fragmented-store) library is a single [very short file](https://github.com/aralroca/fragmented-store/blob/master/index.js), here is the code explaining what it does with comments:

```jsx
import React, { useState, useContext, createContext } from "react";

export default function createStore(store = {}) {
  const keys = Object.keys(store);
  const capitalize = (k) => `${k[0].toUpperCase()}${k.slice(1, k.length)}`;

  // Store utils is the object that we will return with everything 
  // (Provider, hooks). 
  //
  // We initialize it by creating a context for each property and 
  // returning a hook to consume the context of each property.
  const storeUtils = keys.reduce((o, key) => {
    const context = createContext(store[key]); // Property context

    return {
      ...o,
      // All contexts
      contexts: [...(o.contexts || []), { context, key }],
      // Hook to consume the property context
      [`use${capitalize(key)}`]: () => useContext(context)
    };
  }, {});

  // We create the main provider, where it is a component that returns 
  // the wrapped children of all the providers (since we have all the 
  // created contexts we can extract each Provider).
  storeUtils.Provider = ({ children }) => {
    const Empty = ({ children }) => children;
    const Component = storeUtils.contexts
      .map(({ context, key }) => ({ children }) => {
        const ctx = useState(store[key]);
        return <context.Provider value={ctx}>{children}</context.Provider>;
      })
      .reduce(
        (RestProviders, Provider) => ({ children }) => (
          <Provider>
            <RestProviders>{children}</RestProviders>
          </Provider>
        ),
        Empty
      );

    return <Component>{children}</Component>;
  };

  // How plus, we create the hook useUnfragmentedStore to return all the 
  // status and create an updater. All using all the created hooks at 
  // the same time.
  storeUtils.useUnfragmentedStore = () => {
    const state = {};
    const updates = {};
    keys.forEach((k) => {
      const [s, u] = storeUtils[`use${capitalize(k)}`]();
      state[k] = s;
      updates[k] = u;
    });

    function updater(newState) {
      const s =
        typeof newState === "function" ? newState(state) : newState || {};
      Object.keys(s).forEach((k) => updates[k] && updates[k](s[k]));
    }

    return [state, updater];
  };

  // Return everything we've generated
  return storeUtils;
}
```


## Motivation
## Demo

## Conclusions