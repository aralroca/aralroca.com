---
title: Don’t control everything! React forms
created: 11/2/2018
description: Use uncontrolled forms as default way to handle forms.
tags: react,forms,hooks
cover_image: /images/cover-images/2_cover_image.jpg
cover_image_mobile: /images/cover-images/2_cover_image_mobile.jpg
cover_color: '#5D6667'
dev_to: dont-control-everything-react-forms-4d9
---

Forms are a crucial part of almost all applications. At least one of them is usually necessary: the “Sign in” page. In this article, we are going to explain the benefits of uncontrolled forms in React and how to do it as simple as possible to re-use it in every form. We are going to use the classic “Sign in” page as an example.

<img class="center" src="/images/blog-images/9.png" alt="Sign in image" />

### Difference between controlled and uncontrolled

To understand what “uncontrolled” means, first, we’ll see the meaning of “controlled”.

A common mistake in React is to try to control every single field of a form using a state and an onChange method. This way is usually chosen to allow the use of this state inside the onSubmit method, although it’s not the only and best way to get the fields.

#### Controlled fields

```jsx
<form onSubmit={onSignIn}>

  <div>
    <input
      required
      value={this.state.username}
      onChange={e => this.setState({ username: e.target.value )}
      name="username"
      type="text"
      placeholder={userNamePlaceholder}
    />
  </div>

  <div>
    <input
      value={this.state.password}
      onChange={e => this.setState({ password: e.target.value )}
      name="password"
      type="password"
      placeholder={passwordPlaceholder}
    />
  </div>

  <button type="submit">
      Sign In
  </button>
</form>
```

Then we can use the state directly in the onSignIn method.

```js
onSignIn = () => {
  const { username, password } = this.state
  // ...
}
```

These fields are controlled because every time that the state changes, the text rendered changes inside the input. Moreover, every time that the user types, the onChange event is fired to save the new state. If we type a username of 15 characters and a password of 8; 24 react renders will happen under the hood (one for each character + one extra for the first render).

This controlled behavior is useful if the state is used before submitting the form. For example, to validate dynamically the fields. Otherwise, if we want to use all the fields after submitting the form, it will be more useful to do it uncontrolled.

Uncontrolled fields are the natural way to write without a React state:

#### Uncontrolled input

```js
<form onSubmit={onSignIn}>
  <div>
    <input
      required
      name="username"
      type="text"
      placeholder={userNamePlaceholder}
    />
  </div>

  <div>
    <input name="password" type="password" placeholder={passwordPlaceholder} />
  </div>

  <button type="submit">Sign In</button>
</form>
```

In this case, the state is not necessary. We need these fields on the event onSubmit but it’s not necessary to store it at every change in the React state because we already have it in the event. This means that we only do 1 simple render for this component: The first render.

On the onSignIn function, we can find the username and password fields inside event.target.

```js
onSignIn = (event) => {
  const [username, password] = Array.prototype.slice
    .call(event.target)
    .map((field) => field.value)

  // ...
}
```

However, although we simplified it a little, it’s still quite ugly to repeat this Array.prototype.slice.call in every single form submit. Let’s see how to improve it.

### Improving the uncontrolled way

Our goal here is to simplify the logic of every “submit” event in order to avoid the need of finding continuously the fields inside the event.target. We want something more enjoyable like:

```js
onSignIn = ({ username, password }) => {
  // ...
}
```

In this case, we will provide the fields directly as an argument. This argument is an object with all the fields of the form when the key is the name attribute.

To achieve our goal, we can replace the form tag to our personal Component:

<img class="center" src="/images/blog-images/10.png" alt="form" />

Our reusable personal Form Component could be:

```jsx
function Form({ children, onSubmit, ...restOfProps }) {
  const onSubmitAllFields = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      const fields = Array.prototype.slice
        .call(event.target)
        .filter((field) => field.name)
        .reduce(
          (form, { name, value }) => ({
            ...form,
            [name]: typeof value === 'string' ? value.trim() : value,
          }),
          {}
        )

      onSubmit(fields)
    },
    [onSubmit]
  )

  return (
    <form {...restOfProps} onSubmit={onSubmitAllFields}>
      {children}
    </form>
  )
}

export default memo(Form)
```

Thus, we are moving the repeating code that we always do in our forms: **preventDefault** , **stopPropagation** , **extract fields** + **trim string fields**.

Now, we can use this new approach by only changing one character, from “form” to “Form”.

> **Note** : I’m using the new hooks API (proposal), even though it can also be written as a class component.

### Conclusions

Both approaches; controlled and uncontrolled forms are great for different reasons. We have to know the difference to choose the best for any occasion. My advice would be: use normally uncontrolled unless you really need the state to do dynamic checks or to change dynamically the text of each input.

{% twitter 1015954912075644930 %}

If you want to try the Form component, I added in npm:

```
npm install react-form-uncontrolled --save
```

Repo: https://github.com/aralroca/react-form-uncontrolled
