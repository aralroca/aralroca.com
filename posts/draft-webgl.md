---
title: Draft WebGL (Web Graphics Library)
created: 12/11/2021
description: '@todo'
tags: todo
cover_image: /images/cover-images/4_cover_image.jpg
cover_image_mobile: /images/cover-images/4_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/4_cover_image_vert.jpg
cover_color: '#6A6A6C'
---

WebGL és un motor de rasterització. És a dir, que el contingut enlloc de ser un mapa de bits, serà un conjunt de vectors.

Vertex coordinates -> Van de -1 a 1, in X and Y direction.

WebGL també funciona sobre el element `<canvas />` d'HTML5. L'únic que utilitza un context diferent.

De fet es poden fer gràfics 2D igual que el mètode tradicional de canvas, però amb la diferència que pot utilitzar la GPU a l'hora de computar els gràfics.

```js
const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl2') // 2 fa referencia a WebGL 2.0, no que sigui 2D, es poden fer coses en 2D i 3D.

// rgba values, van de 0.0 -> 1.0
gl.clearColor(0.1, 0.2, 0.3, 0.1) // així es coloreja tot el canvas.
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT) // Clears buffers to preset values. Aquestes constants depenen de la teva GPU.
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clear
```

## Coordenades

El punt central del canvas és (0.0, 0.0).

- Cantonada adalt - esquerra: (-1.0, 1.0)
- Cantonada adalt - dreta: (1.0, 1.0)
- Cantonada abaix - esquerra: (-1.0, -1.0)
- Cantonada adalt - dreta: (1.0, -1.0)

Al anar amb percentatges enlloc de pixels, fa que es pugui redimensionar facilment.

## Shaders

A diferència del canvas, en WebGL hem de parlar directament amb la GPU passant el conjunt de vectors, i per fer-ho es fa a través d'unes funcions que es diuen "vertex shader", en un llenguatge que es diu GLSL (GL Shader Language), que son semblants a C/C++. Cada conjunt de funcions d'aquestes (shaders) s'anomena program.

El treball de cada "vertex shader" és computar les posicions dels vertex basada en les posicions. El resultat és poder dibuixar punts, linees, triangles, etc. Després del "vertex shader", s'executa el "fragment shader". El treball d'aquest és computar el color de cada pixel corresponent a cada lloc.

Casi tota la API de WebGL és per fer correr de diferents maneres aquestes dues funcions (vertex and fragment shaders).

Per executar els shaders a la GPU s'han d'utilitzar les funcions `gl.drawArrays` o `gl.drawElements`.

4 maneres que un shader por rebre data:

- Attributes and buffers.
- Uniforms. Son variables globals que pots setejar abans de correr cada program.
- Textures. Arrays de data que pot tenir accés random en el program.
- Varyings. És la manera de passar data desde el vertex shader al fragment shader.

### Attributes

```cpp
// an attribute will receive data from a buffer
attribute vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
```

Aquest article ho explica molt bé:

1. https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html Últim llegit: "Let's start with a vertex shader"
2. https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html (per llegir)

Puc agafar aquest artícle com a referència del curs, ja que el curs d'Udemy és deixa moltes coses sense explicar.

## Drawing a triangle

Com a primer deures, farem un triangle amb WebGL amb codesandbox.

Pasos:

- Define coordinates
- Write shaders
- Create program from shaders
- Create buffers
- Link GPU variable to CPU and sending data
- Render Triangle

```js
import './style'
import { render } from 'preact'
import { useRef, useEffect } from 'preact/hooks'

// Define coordinates
const coordinates = [0, -1, 0, 1, 1, -1]

// Write vertex shaders
const vertexShader = `#version 300 es

precision mediump float;
in vec2 position;

void main () {
    gl_Position = vec4(position, 0.0, 1.0);//x,y,z,w
}`

// Write fragment shaders
const fragmentShader = `#version 300 es

precision mediump float;
out vec4 color;

void main () {
    color = vec4(0.0, 0.0, 1.0, 1.0);//r,g,b,a
}
`

export default function App() {
  const canvas = useRef()

  useEffect(() => {
    const gl = canvas.current.getContext('webgl2')
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    gl.clearColor(1, 1, 0, 1)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    // Compile shaders
    gl.shaderSource(vs, vertexShader)
    gl.shaderSource(fs, fragmentShader)
    gl.compileShader(vs)
    gl.compileShader(fs)

    // Catch some possible errors on vertex shader
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs))
    }

    // Catch some possible errors on fragment shader
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs))
    }

    // Create program from shaders
    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    // Catch some possible errors on program
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
    }

    // Create buffer (to pass the coordinates)
    const buffer = gl.createBuffer() // allowcate memory to gpu
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer) // bind this memory to a channel
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(coordinates),
      gl.STATIC_DRAW
    ) // use this channel to store data on the GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, null) // desallocate memory

    // Link GPU variable to CPU and sending data
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'possition')
    gl.enableVertexAttribArray(position)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0)

    // Render the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }, [])

  return <canvas style={{ width: '100vw', height: '100vh' }} ref={canvas} />
}

if (typeof window !== 'undefined') {
  render(<App />, document.getElementById('root'))
}
```

Codesandbox: https://codesandbox.io/s/webgl-triangle-e90o1?file=/src/index.js:0-2616
(No funciona del tot, s'ha de revisar el codi)

## References

- https://github.com/subhasishdash/webglinternals
- https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
- https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
- https://developer.mozilla.org/es/docs/Web/API/WebGL_API/Tutorial/Using_shaders_to_apply_color_in_WebGL
- https://webglfundamentals.org/webgl/lessons/webgl-2d-vs-3d-library.html
- https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html
