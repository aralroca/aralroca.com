# WebGL apunts 2.0 (continuació del article First steps in webGL)

## Render a rectangle

Per fer un rectangle amb color de fons, haurem de renderitzar 2 triangles.

```js
const coordinates = [
  // x1 - y1 - x2 - y2 - x3 - y3
  -0.7, -0.7, 0.7, 0.7, -0.7, 0.7 // first triangle
  -0.7, -0.7, 0.7, 0.7, 0.7, -0.7 // second triangle
]

// ... shaders, program, buffer, link to gpu... (same as triangle)

gl.drawArrays(
  gl.TRIANGLES,
   0, 
   6 // Number of vertices to be rendered (coordinates.length / 2)
  ) 
```

En veritat, respecte el exemple del triangle, només han canviat dues coses:

* data - Ara és un array amb 6 vertices (x,y), enlloc de 3.
* drawArrays - Li pasem 6 enlloc de 3 (perque tenim 6 vertices)

Exemple Codesandbox: https://codesandbox.io/s/webgl-rectangle-grbe1?file=/src/index.js

## Draw lines

```js
// x1, y1 - x2, y2
const coordinates = [-0.6, 0.6, 0.6, 0.6]

// everything same as triangle

gl.drawArrays(gl.LINES, 0, coordinates.length / 2);
```

CodeSandbox: https://codesandbox.io/s/webgl-line-8u2qs

## Draw points

Aquí haurem de posar en el nostre vertex shader el tamany del punt.

```js
// 4 dots
const coordinates = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5];

const vertexShader = `#version 300 es
  precision mediump float;
  in vec2 position;

  void main () {
      gl_Position = vec4(position.x, position.y, 0.0, 1.0); // x,y,z,w
      gl_PointSize = 10.0;
  }
`

// ... Same code as triangle here...

// draw the 4 points
gl.drawsArray(gl.POINTS, 0, coordinates.length / 2)
```

Codesandbox: https://codesandbox.io/s/webgl-points-g9jxk?file=/src/index.js

## Draw circle

Utilitzarem linees o punts per renderitzar un cercle (millor punts).

```js
function getCircleCoordinates() {
  const centerX = 0
  const centerY = 0
  const radiusX = 0.4
  const radiusY = radiusX / gl.canvas.height * gl.canvas.width;
  const numPoints = 300
  let coordinates = []

  for(let i = 0; i < numPoints; i+= 1) {
     const circumference = 2 * Math.PI * (i / numPoints)
    const x = centerX + radiusX + Math.cos(circumference)
    const y = centerY + radiusY + Math.sin(circumference)

    coordinates.push(x, y)
  }

  return coordinates
}

const coordinates = getCircleCoordinates()
// same vertex shader than drawing points
// ... same code here than triangle ....

gl.drawArrays(gl.POINTS, 0, coordinates.length / 2)
```

Codesandbox: https://codesandbox.io/s/webgl-circle-iyb3q?file=/src/index.js
