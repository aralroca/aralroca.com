# WebGL apunts 2.0 (continuació del article First steps in webGL)

## Render a rectangle

Per fer un rectangle amb color de fons, haurem de renderitzar 2 triangles.

```js
const coordinates = [
  // x1 - y1 - x2 - y2 - x3 - y3
  -0.7,
  -0.7,
  0.7,
  0.7,
  -0.7,
  0.7 - 0.7, // first triangle
  -0.7,
  0.7,
  0.7,
  0.7,
  -0.7, // second triangle
]

// ... shaders, program, buffer, link to gpu... (same as triangle)

gl.drawArrays(
  gl.TRIANGLES,
  0,
  6 // Number of vertices to be rendered (coordinates.length / 2)
)
```

En veritat, respecte el exemple del triangle, només han canviat dues coses:

- data - Ara és un array amb 6 vertices (x,y), enlloc de 3.
- drawArrays - Li pasem 6 enlloc de 3 (perque tenim 6 vertices)

Exemple Codesandbox: https://codesandbox.io/s/webgl-rectangle-grbe1?file=/src/index.js

## Draw lines

```js
// x1, y1 - x2, y2
const coordinates = [-0.6, 0.6, 0.6, 0.6]

// everything same as triangle

gl.drawArrays(gl.LINES, 0, coordinates.length / 2)
```

CodeSandbox: https://codesandbox.io/s/webgl-line-8u2qs

## Draw points

Aquí haurem de posar en el nostre vertex shader el tamany del punt.

```js
// 4 dots
const coordinates = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5]

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
  const radiusY = (radiusX / gl.canvas.height) * gl.canvas.width
  const numPoints = 300
  let coordinates = []

  for (let i = 0; i < numPoints; i += 1) {
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

## Dynamic rendering of shapes

Enlloc de renderitzar coses estàtiques, aquí veurem com renderitzar figures dinàmiques (que es mouen).

### Dynamic rectangle

From (-0.5, 0.5) to (0.5, -0.5). Recordem que per fer un rectangle vol dir que he de fer dos triangles.

Crearem el rectangle amb l'event del ratolí.

```js
import './style'
import { render } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import WebGLUtil from './utils/webgl'

const webGL = new WebGLUtil()

// Write vertex shaders
const vertexShader = `#version 300 es
  precision mediump float;
  in vec2 position;
  uniform float flipY; // important step to draw same direction of the mouse

  void main () {
      gl_Position = vec4(position.x, position.y * flipY, 0.0, 1.0); // x,y,z,w
  }
`

// Write fragment shaders
const fragmentShader = `#version 300 es
  precision mediump float;
  out vec4 color;
  uniform vec4 inputColor;

  void main () {
     color = inputColor;
  }
`

// En aquesta ocasió faig el canvas fixe perquè sinó tenia issues
const width = 400
const height = 400

export default function App() {
  const canvas = useRef()
  const isDown = useRef(false)
  const webglVars = useRef({})
  const [start, setStart] = useState()
  const [end, setEnd] = useState()

  function getTextureColor() {
    // Convertir de 0 -> 1
    return [
      start.offset.x / width, // red
      start.offset.y / height, // green
      end.offset.x / width, // blue
      1,
    ]
  }

  function formatCoordinate({ x, y }) {
    // Convertir de -1 -> 1
    return {
      x: -1 + (x / width) * 2,
      y: -1 + (y / height) * 2,
    }
  }

  function onMouseUp(e) {
    isDown.current = false
    const offset = { x: e.offsetX, y: e.offsetY }
    const en = formatCoordinate(offset)
    setEnd({ ...en, offset })
  }

  function onMouseDown(e) {
    const offset = { x: e.offsetX, y: e.offsetY }
    const s = formatCoordinate(offset)
    setStart({ ...s, offset })
    isDown.current = true
  }

  function onMouseMove(e) {
    if (!isDown.current) return
    const offset = { x: e.offsetX, y: e.offsetY }
    const en = formatCoordinate(offset)
    setEnd({ ...en, offset })
  }

  // update rectangle
  useEffect(() => {
    if (!end) return
    const { gl, program } = webglVars.current
    const vertices = [
      // first triangle
      start.x,
      start.y,
      end.x,
      start.y,
      start.x,
      end.y,
      // second triangle
      start.x,
      end.y,
      end.x,
      end.y,
      end.x,
      start.y,
    ]
    const data = new Float32Array(vertices)
    const buffer = webGL.createAndBindBuffer(
      gl,
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      data
    )
    webGL.linkGPUAndCPU(gl, {
      program,
      gpuVariable: 'position',
      channel: gl.ARRAY_BUFFER,
      buffer,
      dims: 2,
      dataType: gl.FLOAT,
      normalize: gl.FALSE,
      stride: 0,
      offset: 0,
    })
    const location = gl.getUniformLocation(program, 'flipY')
    const inputColor = gl.getUniformLocation(program, 'inputColor')

    gl.uniform1f(location, -1)
    gl.uniform4fv(inputColor, getTextureColor())
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)
  }, [end])

  useEffect(() => {
    const gl = webGL.getGLContext(canvas.current)
    const vs = webGL.getShader(gl, vertexShader, gl.VERTEX_SHADER)
    const fs = webGL.getShader(gl, fragmentShader, gl.FRAGMENT_SHADER)
    const program = webGL.getProgram(gl, vs, fs)
    webglVars.current = { gl, program }
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <b>Draw a rectangle with the mouse inside the canvas</b>
      <canvas
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={{ width, height, border: '1px solid black' }}
        ref={canvas}
      />
    </div>
  )
}

if (typeof window !== 'undefined') {
  render(<App />, document.getElementById('root'))
}
```

Condesandbox: https://codesandbox.io/s/webgl-dynamic-rectangle-32idq

### Rendering dynamic points

Semblant als rectangles, però amb punts. Aquí si farà falta el `gl_PointSize = 10.0;`.

També que anirem acomulant els punts dibuixats en un array de vertices enlloc de tenir un array amb els vertices de 2 triangles (1 rectangle). I posarem `gl.POINTS` en la funció `drawArrays`.

Codesandbox: https://codesandbox.io/s/webgl-dynamic-points-3hq58?file=/src/index.js

### Rendering dynamic lines

Idem. Casi igual que els altres. Però posarem `gl.LINES`. Aquest cas farem que no s'acomulin.

Codesandbox: https://codesandbox.io/s/webgl-dynamic-lines-fg3m4?file=/src/index.js

## Dynamic rendering of circles

Ho farem amb punts.

@todo: https://codesandbox.io/s/webgl-dynamic-circle-f4mfm
