---
title: First steps in WebGL
created: 07/20/2020
description: Learn what WebGL is and how it works by drawing a triangle.
tags: javascript, webgl, react
cover_image: /images/cover-images/13_cover_image.jpg
cover_image_mobile: /images/cover-images/13_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/13_cover_image_vert.jpg
cover_color: '#BBB6AE'
---

In this article we'll see what WebGL is and how to draw a **triangle** directly by talking to the graphics processing unit (GPU). This is a simple example that could be solved in other ways, such as using a canvas with a 2d context or even with CSS. But let's say it's a way to start with WebGL, as a "hello world", to understand how it works.

<img src="/images/blog-images/triangle.jpeg" alt="Triangle" class="center" />
<small class="center">Photo by: Apurv Das (Unsplash)</small>

**We will cover the following:**

- [What is WebGL?](#what-is-webgl)
- [Creating a WebGL Canvas](#creating-a-webgl-canvas)
- [Vertex coordinates](#vertex-coordinates)
- [GLSL and shaders](#glsl-and-shaders)
  - [Vertex shader](#vertex-shader)
  - [Fragment shader](#fragment-shader)
- [Create program from shaders](#create-program-from-shaders)
- [Create buffers](#create-buffers)
- [Link data from CPU to GPU](#link-data-from-cpu-to-gpu)
- [Drawing the triangle](#drawing-the-triangle)
- [All the code together](#all-the-code-together)
- [Conclusion](#conclusion)
- [References](#references)

## What is WebGL?

The literal definition of WebGL is "Web Graphics Library". However, it is not a 3D library that offers us an easy to use API, where to say: put a light here, a camera there, draw a character here, etc.

It's more at a low-level, that given **vertices**, it convert into **pixels**. So we can understand WebGL as a rasterization engine. It's based on OpenGL ES 3.0 graphical API (WebGL 2.0, the old version of WebGL is based on ES 2.0).

<img style="max-width: 600px" src="/images/blog-images/webgl-schema.png" class="center" alt="WebGL Schema" />

The 3d libraries that exist on the web (like [THREE.js](https://threejs.org/) or [Babylon.js](https://github.com/BabylonJS/Babylon.js)), use WebGL below. Because they need a way to communicate to the GPU and tell what to draw.

The example we are going to use here could be solved directly with THREE.js, using the `THREE.Triangle`. You can see an example [here](https://stackoverflow.com/a/29843694/4467741). However, the idea of this tutorial is to understand how it works underneath, i.e. how these 3d libraries communicate with the GPU via WebGL. So we are going to render a triangle without the help of any 3d library.

<img style="max-width: 600px" src="/images/blog-images/3dlibraries_underthehood.png" class="center" alt="Let's explore how to do a triangle without 3D libraries" />

## Creating a WebGL canvas

In order to draw a triangle, first we need the define the area where this triangle is going to be rendered via WebGL.

We are going to use the element canvas of HTML5, retrieving the context as `webgl2`.

```jsx
import { useRef, useEffect } from 'preact/hooks'

export default function Triangle() {
  const canvas = useRef()

  useEffect(() => {
    const bgColor = [0.47, 0.7, 0.78, 1] // r,g,b,a as 0-1
    const gl = canvas.current.getContext('webgl2') // WebGL 2.0

    gl.clearColor(bgColor) // set canvas background color
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT) // clear buffers
    // @todo: Render the triangle...
  }, [])

  return <canvas style={{ width: '100vw', height: '100vh' }} ref={canvas} />
}
```

The `clearColor` is setting the background color of the canvas, using a kind of RGBA, that the values instead of 0-255, are from 0 to 1.

The `clear` what it does is clears buffers to preset values. The values of the used constants depends on your GPU capacity.

Once we have the canvas created, we are ready to render the triangle inside using WebGL... Although it's not that simple. Let's see how to do it in the following sections.

## Vertex coordinates

Once we have our canvas created, we need to know that all vectors that we are going to define inside the canvas, are from -1 to 1. So, the corners of the canvas are:

<img style="max-width: 400px" src="/images/blog-images/coordinates-webgl.png" alt="Coordinates" class="center" />

- **(0, 0)** - Center
- **(1, 1)** - Top right
- **(1, -1)** - Bottom right
- **(-1, 1)** - Top left
- **(-1, -1)** - Bottom left

So, the triangle we want to draw, is going to use these three points:

<img style="max-width: 400px" src="/images/blog-images/triangle_webgl.png" alt="Coordinates" class="center" />

**(-1, -1)**, **(0, 1)** and **(1, -1)**. Thus, we are going to store the triangle coordinates into an array:

```js
const coordinates = [-1, -1, 0, 1, 1, -1]
```

## GLSL and shaders

A shader is a type of computer program used in computer graphics to calculate rendering effects with high degree of flexibility. These shaders are coded and run on the GPU, written in OpenGL ES Shading Language (GLSL ES), a language similar to C or C++.

<img src="/images/blog-images/shaders.png" class="center" alt="WebGL Shaders" />

Each WebGL program that we are going to run is composed by two shaders functions; the **vertex shader** and the **fragment shader**.

Almost all the WebGL API is for running in different ways these two functions (vertex and fragment shaders).

### Vertex shader

The job of the vertex shader is to compute the positions of the vertex. The result (**gl_Position**) is able to locate points, lines and triangles on the viewport.

To write a triangle, we are going to create this vertex shader:

```js
const vertexShader = `#version 300 es
  precision mediump float;
  in vec2 position;

  void main () {
      gl_Position = vec4(position.x, position.y, 0.0, 1.0); // x,y,z,w
  }
`
```

We can save it for now in our JavaScript code as a template string.

The first line, `#version 300 es`, tells the version of GLSL that we are using.

The second line, `precision mediump float;`, determines how much precision the GPU uses when calculating floats. The available options are `highp`, `mediump` and `lowp`), however, some systems doesn't support `highp`.

The third line, `in vec2 position;`, we are defining an input variable for the GPU of 2 dimensions **(X, Y)**. Because each point of the triangle is in two dimensions.

The `main` function, like C / C++ is called at program startup after initialization. So the GPU is going to run the content of the `main` function.

The content of the `main` function, `gl_Position = vec4(position.x, position.y, 0.0, 1.0);`, is saving to the `gl_Position` the position of the current vertex. The first and second argument are the `x` and `y` from our `vec2` position, the third argument is the `z` axis, in this case is `0.0` because we are creating a geometry in 2D and not in 3D. And the last argument is `w`, by default, this should be set to `1.0`.

The GLSL identifies and uses internally the value of `gl_Position`.

Once we created the shader, we should compile it:

```js
const vs = gl.createShader(gl.VERTEX_SHADER)

gl.shaderSource(vs, vertexShader)
gl.compileShader(vs)

// Catch some possible errors on vertex shader
if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(vs))
}
```

### Fragment shader

After the "vertex shader", the "fragment shader" is executed. The job of this shader is to compute the color of each pixel corresponding to each location.

For the triangle, let's make the filling the same color:

```js
const fragmentShader = `#version 300 es
  precision mediump float;
  out vec4 color;

  void main () {
      color = vec4(0.7, 0.89, 0.98, 1.0); // r,g,b,a
  }
`
const fs = gl.createShader(gl.FRAGMENT_SHADER)

gl.shaderSource(fs, fragmentShader)
gl.compileShader(fs)

// Catch some possible errors on fragment shader
if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
  console.error(gl.getShaderInfoLog(fs))
}
```

The syntax is very similar to the previous one, but the vect4 we return here refers to the color of each pixel. Since we want the fill color of the triangle to `rgba(179, 229, 252, 1)`, we will translate it by dividing each rgb number by 255.

## Create program from shaders

Once we have the shaders compiled, we need to create the program that will run the GPU, adding both shaders.

```js
const program = gl.createProgram()
gl.attachShader(program, vs) // Attatch vertex shader
gl.attachShader(program, fs) // Attatch fragment shader
gl.linkProgram(program) // Link both shaders together
gl.useProgram(program) // Use the created program

// Catch some possible errors on program
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program))
}
```

## Create buffers

We are going to use a buffer to allocate memory to GPU, and bind this memory to a channel to communicate CPU-GPU. We are going to use this channel to send our triangle coordinates that we defined [before](#vertex-coordinates) to the GPU.

```js
// allowcate memory to gpu
const buffer = gl.createBuffer()

// bind this memory to a channel
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

// use this channel to send data to the GPU (our triangle coordinates)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(coordinates),
  // In our case is an static triangle, so is better to tell
  // how we'll use the data in order that WebGL optimize certain
  // things.
  gl.STATIC_DRAW
)

// desallocate memory after send data to avoid memory leak issues
gl.bindBuffer(gl.ARRAY_BUFFER, null)
```

<img src="/images/blog-images/buffer.png" class="center" alt="buffer" />

## Link data from CPU to GPU

In our [vertex shader](#vertex-shader), we defined an input variable named `position`. However, we haven't yet specified that this variable should take the value that we are passing through the buffer. So we must indicate it in the following way:

```js
const position = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(position)
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.vertexAttribPointer(
  position, // location of the vertex attribute
  2, // dimension - 2D
  gl.FLOAT, // Type of data we are going to send to GPU
  gl.FALSE, // If data should be normalized
  0, // Stride
  0 // Offset
)
```

## Drawing the triangle

Once we have created the program with the shaders for our triangle, the buffer with the triangle coordinates and linked the data so that the GPU can receive this buffer. We can finally tell the GPU to render the triangle!

<img src="/images/blog-images/triangle_result.png" alt="Triangle exercice" class="center" />

```js
gl.drawArrays(
  gl.TRIANGLES, // Type of primitive
  0, // Start index in the array of vector points
  3 // Number of indices to be rendered
)
```

This method renders primitives from array data. The primitives are points, lines or triangles. In our case, we want to draw a triangle.

## All the code together

I've uploaded the article code to CodeSandbox in case you want to explore it a bit.

<iframe
  src="https://codesandbox.io/embed/webgl-triangle-e90o1?fontsize=14&hidenavigation=0&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="webgl-triangle"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Conclusion

With WebGL is only possible to draw triangles, lines or points because it only rasterize, so you can only do what the vectors can do. This means that WebGL is conceptually simple, but the process is quite complex... And gets more and more complex depending what you want to develop. It's not the same to rasterize a 2D triangle, as to develop a 3D videogame with textures, varyings, transformations...

I hope this article has been useful to understand a little bit how WebGL works, and help you learn more about it. I recommend a reading of the references below.

## References

- https://webglfundamentals.org
- https://webgl2fundamentals.org/
- https://developer.mozilla.org/es/docs/Web/API/WebGL_API/Tutorial/
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- http://vispy.org/modern-gl.html
- https://github.com/subhasishdash/webglinternals
