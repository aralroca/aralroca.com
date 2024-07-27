---
title: OpenCV directly in the browser (webassembly + webworker)
created: 05/05/2020
description: Learn how to use OpenCV in the web without a lot of headaches.
tags: nextjs, javascript, react, experimental, machine-learning, webassembly
cover_image: /images/cover-images/6_cover_image.jpg
cover_image_mobile: /images/cover-images/6_cover_image_mobile.jpg
cover_color: '#2D2B30'
dev_to: opencv-directly-in-the-browser-webassembly-webworker-423i
---

We'll see how to use the OpenCV library directly on the browser! To do this, we will compile OpenCV to webassembly and then run it inside a webworker.

## What is OpenCV

OpenCV is the most popular library of Computer Vision, and has existed since 1999! What it does is providing a user-friendly and highly efficient development environment. It is a library written in C and C++ by Intel.

OpenCV can also use Intel's embedded performance primitives, a set of low-level routines specific of Intel.

With OpenCV you can develop things like:

- 2D and 3D feature toolkits
- Egomotion estimation
- Facial recognition system
- Gesture recognition
- Human–computer interaction (HCI)
- Mobile robotics
- Motion understanding
- Object identification
- Segmentation and recognition
- Stereopsis stereo vision: depth perception from 2 cameras
- Structure from motion (SFM)
- Motion tracking
- Augmented reality

<br />
<img class="center" src="/images/blog-images/30.png" alt="OpenCV logo" />
<br />

## Why in the browser

Being able to run computer vision algorithms directly from the browser allows us to move costs to the client device, and thus save many costs on the server.

Imagine you want to get the characteristics of a label of wine from a picture. There are many ways to do this. If we look for the most ergonomic way for our server, we'd move part of the wine label detection logic in the browser. Then, when we fetch the request to the server, we'll only need to send the final vector. This way, we avoid processing the image on the server.

Or even if it's an embedded app for the private use of a company, we could put all the logic in the browser.

## Starting a new Next.js project

We're going to use the Next.js framework with React, to ease the setup and use of the project. However, the same can be applied to a project with Angular, Vue.js, Svelte... or vanilla.js.

To start with, let's just create a new Next.js project with the following command:

```
yarn create next-app
```

Once you fill in the name of your project, raise the local environment with `yarn dev`. Now we are ready to start using OpenCV in our Next.js project.

## Compile OpenCV into Webassembly

To compile OpenCV to webassembly we can follow the official documentation at:

- https://docs.opencv.org/3.4.10/d4/da1/tutorial_js_setup.html

However, I'll tell you the steps I've taken:

First clone the OpenCV repo:

```bh
git clone https://github.com/opencv/opencv.git
```

Now, once inside the repo directory we've cloned, let's compile with Docker!

For Linux / Mac:

```bh
docker run --rm --workdir /code -v "$PWD":/code "trzeci/emscripten:latest" python ./platforms/js/build_js.py build
```

For Windows:

```bh
docker run --rm --workdir /code -v "$(get-location):/code" "trzeci/emscripten:latest" python ./platforms/js/build_js.py build
```

Now it's time to wait... it may take about 15 minutes.

<img class="center" alt="compiling OpenCV into webassembly" src="/images/blog-images/31.png">

Once finished, copy the file you've generated into the project and then move it into `/public`.

```diff
public
├── favicon.ico
├── js
+│   ├── opencv.js
└── vercel.svg
```

## Loading OpenCV on a Worker

Once we have the OpenCV file in webassembly inside the `/public` directory, it's ready to use it inside a worker.

It is important to use a worker because all OpenCV functions are very expensive and would block the UI. It is not mandatory to use a worker, but highly recommended.

### Creating the worker

Let's create the worker within the same `/public` directory.

```diff
public
├── favicon.ico
├── js
+│   ├── cv.worker.js
│   ├── opencv.js
└── vercel.svg
```

The initial content will be like this:

```js
/**
 *  Here we will check from time to time if we can access the OpenCV
 *  functions. We will return in a callback if it's been resolved
 *  well (true) or if there has been a timeout (false).
 */
function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
  if (cv.Mat) callbackFn(true)

  let timeSpentMs = 0
  const interval = setInterval(() => {
    const limitReached = timeSpentMs > waitTimeMs
    if (cv.Mat || limitReached) {
      clearInterval(interval)
      return callbackFn(!limitReached)
    } else {
      timeSpentMs += stepTimeMs
    }
  }, stepTimeMs)
}

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with the project.
 */
onmessage = function (e) {
  switch (e.data.msg) {
    case 'load': {
      // Import Webassembly script
      self.importScripts('./opencv.js')
      waitForOpencv(function (success) {
        if (success) postMessage({ msg: e.data.msg })
        else throw new Error('Error on loading OpenCV')
      })
      break
    }
    default:
      break
  }
}
```

### Loading the worker in our project

Okay, now we can create in our project a service that communicates with the worker. For this, we are going to create a `services` directory where we will put our file.

```diff
services
+└── cv.js
```

Once the file has been created, we will enter this initial code, which will allow us to load OpenCV into our project:

```js
class CV {
  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  _dispatch(event) {
    const { msg } = event
    this._status[msg] = ['loading']
    this.worker.postMessage(event)
    return new Promise((res, rej) => {
      let interval = setInterval(() => {
        const status = this._status[msg]
        if (status[0] === 'done') res(status[1])
        if (status[0] === 'error') rej(status[1])
        if (status[0] !== 'loading') {
          delete this._status[msg]
          clearInterval(interval)
        }
      }, 50)
    })
  }

  /**
   * First, we will load the worker and capture the onmessage
   * and onerror events to always know the status of the event
   * we have triggered.
   *
   * Then, we are going to call the 'load' event, as we've just
   * implemented it so that the worker can capture it.
   */
  load() {
    this._status = {}
    this.worker = new Worker('/js/cv.worker.js') // load worker

    // Capture events and save [status, event] inside the _status object
    this.worker.onmessage = (e) => (this._status[e.data.msg] = ['done', e])
    this.worker.onerror = (e) => (this._status[e.data.msg] = ['error', e])
    return this._dispatch({ msg: 'load' })
  }
}

// Export the same instant everywhere
export default new CV()
```

### Using the service

Since we are exporting the instance directly, we can import it into our page or component.

For example, we could load it on an `onClick` event:

```js
async function onClick() {
  await cv.load()
  // Ready to use OpenCV on our component
}
```

## Using OpenCV in the browser

Now that we have managed to load the OpenCV library in our browser we will see how to run some utilities from the library.

Of course you can do many things with OpenCV. Here I'll show a simple example. Then it will be your job to read the official documentation and learn how to use OpenCV.

The example we're going to use is a simple image processing, to take pictures with the camera and processing them to a grayscale. Although it may seem simple, this is our first "hello world" with OpenCV.

```jsx
import { useEffect, useRef, useState } from 'react'
import cv from '../services/cv'

// We'll limit the processing size to 200px.
const maxVideoSize = 200

/**
 * What we're going to render is:
 *
 * 1. A video component so the user can see what's on the camera.
 *
 * 2. A button to generate an image of the video, load OpenCV and
 * process the image.
 *
 * 3. A canvas to allow us to capture the image of the video and
 * show it to the user.
 */
export default function Page() {
  const [processing, updateProcessing] = useState(false)
  const videoElement = useRef(null)
  const canvasEl = useRef(null)

  /**
   * In the onClick event we'll capture a frame within
   * the video to pass it to our service.
   */
  async function onClick() {
    updateProcessing(true)

    const ctx = canvasEl.current.getContext('2d')
    ctx.drawImage(videoElement.current, 0, 0, maxVideoSize, maxVideoSize)
    const image = ctx.getImageData(0, 0, maxVideoSize, maxVideoSize)
    // Load the model
    await cv.load()
    // Processing image
    const processedImage = await cv.imageProcessing(image)
    // Render the processed image to the canvas
    ctx.putImageData(processedImage.data.payload, 0, 0)
    updateProcessing(false)
  }

  /**
   * In the useEffect hook we'll load the video
   * element to show what's on camera.
   */
  useEffect(() => {
    async function initCamara() {
      videoElement.current.width = maxVideoSize
      videoElement.current.height = maxVideoSize

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            width: maxVideoSize,
            height: maxVideoSize,
          },
        })
        videoElement.current.srcObject = stream

        return new Promise((resolve) => {
          videoElement.current.onloadedmetadata = () => {
            resolve(videoElement.current)
          }
        })
      }
      const errorMessage =
        'This browser does not support video capture, or this device does not have a camera'
      alert(errorMessage)
      return Promise.reject(errorMessage)
    }

    async function load() {
      const videoLoaded = await initCamara()
      videoLoaded.play()
      return videoLoaded
    }

    load()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <video className="video" playsInline ref={videoElement} />
      <button
        disabled={processing}
        style={{ width: maxVideoSize, padding: 10 }}
        onClick={onClick}
      >
        {processing ? 'Processing...' : 'Take a photo'}
      </button>
      <canvas
        ref={canvasEl}
        width={maxVideoSize}
        height={maxVideoSize}
      ></canvas>
    </div>
  )
}
```

In our service:

```js
class CV {
  // ...previous service code here...

  /**
   * We are going to use the _dispatch event we created before to
   * call the postMessage with the msg and the image as payload.
   *
   * Thanks to what we've implemented in the _dispatch, this will
   * return a promise with the processed image.
   */
  imageProcessing(payload) {
    return this._dispatch({ msg: 'imageProcessing', payload })
  }
}
```

In our worker:

```js
// ...previous worker code here...

/**
 * With OpenCV we have to work with the images as cv.Mat (matrices),
 * so you'll have to transform the ImageData to it.
 */
function imageProcessing({ msg, payload }) {
  const img = cv.matFromImageData(payload)
  let result = new cv.Mat()

  // This converts the image to a greyscale.
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY)
  postMessage({ msg, payload: imageDataFromMat(result) })
}

/**
 * This function converts again from cv.Mat to ImageData
 */
function imageDataFromMat(mat) {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat()
  const depth = mat.type() % 8
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
  mat.convertTo(img, cv.CV_8U, scale, shift)

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
      break
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
      break
    case cv.CV_8UC4:
      break
    default:
      throw new Error(
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
      )
  }
  const clampedArray = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  )
  img.delete()
  return clampedArray
}

onmessage = function (e) {
  switch (e.data.msg) {
    // ...previous onmessage code here...
    case 'imageProcessing':
      return imageProcessing(e.data)
    default:
      break
  }
}
```

The result:

<img class="center" alt="First result of image processing using OpenCV in JavaScript" src="/images/blog-images/28.gif" />

Although we have processed the image in a very simple way and we could have done it without using OpenCV, this is our "hello world" with OpenCV. It opens the doors to more complex things.

## Conclusion

We have seen how to use the most used library for computer vision in the browser. We've seen how to compile OpenCV into webassembly and use it in a worker to not block the UI for a good performance. I hope that even if you have never heard of this library, now you'll give it a try.

<br />
<img class="center" src="/images/blog-images/29.jpg" alt="Example of computer vision" />
<br />

## Code

I've uploaded the code of this article on GitHub in case you want to take a look.

- CODE -> https://github.com/vinissimus/opencv-js-webworker
- DEMO -> https://vinissimus.github.io/opencv-js-webworker/

To see a more sophisticated example implemented in Vue.js, take a look at this other repo:

- https://github.com/latsic/imgalign

## References

- https://docs.opencv.org/3.4.10/d4/da1/tutorial_js_setup.html
- https://docs.opencv.org/master/de/d06/tutorial_js_basic_ops.html
- https://en.wikipedia.org/wiki/OpenCV
- https://github.com/latsic/imgalign
- https://opencv.org/
