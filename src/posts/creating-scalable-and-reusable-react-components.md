---
title: Creating Scalable and Reusable React Components
created: 04/30/2023
description: This post advocates for the creation of versatile and elegant React components from the start to avoid issues with single-use components
tags: react, javascript
cover_image: /images/cover-images/26_cover_image.jpg
cover_image_mobile: /images/cover-images/26_cover_image_mobile.jpg
cover_color: '#82B5E1'
dev_to: creating-scalable-and-reusable-react-components-5h08
---

## TLDR;

In this article, I will discuss a **common issue** that I have encountered in React applications: the creation of **single-use components** that lack the versatility and elegance of a truly reusable component. Rather than designing components for specific use cases, it is more beneficial to create generic components that can be adapted to various contexts.

## Problem: Simple-use and overly contextualized components

Some developers argue that it is acceptable to **initially** create a **single-use** component and **refactor** it **later** if a similar component is needed elsewhere. While this approach may avoid violating the YAGNI principle, it is not ideal.

> The YAGNI (You Aren't Gonna Need It) principle is a software development practice that focuses on avoiding the implementation of unnecessary features. Instead of anticipating all possible future requirements and writing code for them, developers should write code only to meet the current project's needs.

...Are we doing the right thing here?

Consider an **example** where we are creating a **`ProductCardCarousel`** component because we will **only use** it momentarily for the **product page**.

We have created **first** the **product page** and placed a significant amount of logic there, and subsequently, we have **transferred** some of this **logic into a component** named `ProductCardCarousel` because it is responsible for displaying the products in a carousel.

First we implemented the **product page**:

```jsx
export default function ProductPage({ products }) {
  return (
    <div>
      {/* ...more code here... */}
      <div className="product-carousel">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt="Product" />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Then transferred some logic into **`ProductCardCarousel`**:

```jsx
export default function ProductPage({ products }) {
  return (
    <div>
      {/* ...more code here... */}
      <ProductCardCarousel products={products} />
    </div>
  )
}

// product-card-carousel.js
export function ProductCardCarousel({ products }) {
  return (
    <div className="product-carousel">
      {products.map((product) => (
        <div className="card" key={product.id}>
          <img src={product.image} alt="Product" />
          <h4>{product.name}</h4>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  )
}
```

_Does that make sense?_ 🤔 Well, we are **approaching this task inaccurately**.

Creating **single-use components** is a **bad practice** because it can lead to **inefficient** and **duplicative code**. These components **lack versatility and elegance** and are designed for **specific use cases**, making it **challenging to adapt** them to different contexts. Placing a **significant amount of logic** in a specific part of the codebase can result in **code duplication**, as developers may need to create similar components for other use cases. **Refactoring** single-use components into reusable ones can also be **challenging**.

### Shift in focus

The **best practice** is to design **versatile and elegant components** from the outset to **avoid these issues**.

What I propose is a **shift** in **focus** when implementing React components **from the start**. This change not only adheres to the YAGNI principle but also makes your project **more scalable**, allowing for **more reusable** components and **reducing the need for future refactoring**.

The key is to ensure that components are as "dumb" as possible concerning business logic. Their sole responsibility should be to serve as UI components that can receive any context required to fulfill their UI functionality.

When component names start to include business logic or other UI behaviors rather than just one UI element, it is a sign that the component may be **overly contextualized**. In the last `ProductCardCarousel` example, should not contain product-specific logic neither card-specific logic.

<figure align="center">
  <img src="/images/blog-images/lego.jpg" alt="Lego pieces" class="center" />
  <figcaption><small>React Components as Lego pieces</small></figcaption>
</figure>

Developing a **web page** using React **without** first defining its **components** is akin to attempting to construct a **Lego house** **without** the requisite **Lego pieces**.

## Solution: Components as Lego Blocks

To address this issue, it is helpful to approach the implementation of new React features by **starting** with the **lower-level components** and working your **way up** to the parent component, which will handle the business logic. The parent component can then use the created UI components (or existing ones) and feed them the necessary context without burdening them with the responsibility of managing business logic.

A **common mistake** is to begin at the **top level**. This approach often leads to the creation of a component containing all the logic, which is later broken down into smaller components. This only serves to pass the responsibility of managing business logic down through the component hierarchy. For example:

- **1**: `ProductSection`
  - **2**: `ProductSubsection`
    - **3**: `ProductCardCarousel`
    - **4**: `ProductCardList`

This method does not make sense. _It is reminiscent of working with a single HTML file 20 years ago—the only difference is that the code is now distributed across multiple components_.

The true power of components lies in their reusability and separation from business logic.

<figure align="center">
  <img src="/images/blog-images/lego-component.jpg" alt="React Components as Lego Blocks: A Method for Scalable Development" class="center" />
  <figcaption><small>React Components as Lego Blocks: A Method for Scalable Development</small></figcaption>
</figure>

In order to fix the example above, development should begin with the `Card` component, which should be entirely agnostic to the business logic. Although the `Card` is required for displaying products, it should be adaptable to any context (e.g., product, user, etc.). Once the `Card` component is complete, developers can create both a `List` and a `Carousel` component to display cards. These components (`List` and `Carousel`) should **also** be **context-agnostic**, accepting any content such as `Card`, images, paragraphs, etc.

Finally, at the highest level, all these "Lego pieces" can be assembled to construct the `ProductSection`. By keeping the **business logic** at the **top level**, the `ProductSection` can **combine these context-agnostic UI components** to satisfy the requirements of the specific business model.

- **4**: `ProductSection`
  - **2**: `Carousel`
    - **1**: `Card`
  - **3**: `List`
    - **1**: `Card`

Simple example in code:

```jsx
// card.js
export function Card({ image, alt, name, description }) {
  return (
    <div className="card">
      <img src={image} alt={alt} />
      <h4>{name}</h4>
      <p>{description}</p>
    </div>
  )
}

// carousel.js
export function Carousel({ children }) {
  return <div className="carousel">{children}</div>
}

// list.js
export function List({ children }) {
  return <div className="list">{children}</div>
}

// product-section.js
export default function ProductSection({ products }) {
  const productCards = products.map((product) => (
    <Card
      key={product.id}
      alt="Product"
      image={product.image}
      name={product.name}
      description={product.description}
    />
  ))

  return (
    <div className="product-section">
      {/* ...more code here... */}
      <h2>Products carousel</h2>
      <Carousel>{productCards}</Carousel>
      <h2>Products list</h2>
      <List>{productCards}</List>
    </div>
  )
}
```

Once you have established your components, you can **create** not only the required web page but also **other pages** with entirely **different business logic**, leveraging the **same building blocks**.

The advantage of using reusable components is that they can be **adapted** to various **contexts**, providing a more efficient and effective development process. By designing generic components that can be utilized in different scenarios, developers can **avoid duplicative** and **inefficient code**, resulting in a **more robust** and **scalable** application.

## Conclusion

In conclusion, when developing in React, it is crucial to avoid creating components that lack real utility or usefulness and are designed for single-use. Instead, developers should focus on creating generic components that can be used in many different contexts.

When implementing a new React feature, it is best to start with the lowest-level components and work up to the parent, which will have the business logic and can use the UI components that have been created to display the UI. This approach ensures that components are much more reusable and scalable and avoids violating the YAGNI principle.

Finally, developers should shift their focus from creating the simplest possible components to the business model. The only responsibility of a UI component should be to display the UI and be fed with any context necessary to fulfill its UI functionality. By following these guidelines, developers can create more efficient and maintainable React applications.

<figure align="center">
  <img src="/images/blog-images/sharing-lego-components.jpg" alt="Generic components as Lego blocks that can be used in many different contexts" class="center" />
  <figcaption><small>Generic components as Lego blocks that can be used in many different contexts</small></figcaption>
</figure>
