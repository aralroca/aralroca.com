---
title: Classify any kind of image. Skin cancer detection example
created: 06/29/2020
description: Learn how to implement any kind of image recognition by implementing a skin cancer detection in Tensorflow.js.
tags: tensorflow, javascript, machine-learning, react
cover_image: /images/cover-images/12_cover_image.jpg
cover_image_mobile: /images/cover-images/12_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/12_cover_image_vert.jpg
cover_color: '#030102'
---

This article is a small tutorial to implement an application that uses a given image of a skin freckle to predict if it's benign or malignant. To do this we'll use Tensorflow.js to make the prediction directly on the browser.

I recommend reading [this other article](https://aralroca.com/blog/first-steps-with-tensorflowjs) where I introduce Tensorflow.js.

However, with this tutorial you'll be able to classify any kind of image in an easy way even without any knowledge of ML. Also, it can be replicated for any image classification problem.

**We will cover the following:**

- [The dataset](#the-dataset)
- [Training the model](#training-the-model)
- [Testing our model](#testing-our-model)
- [Using the model in our (P)React app](#using-the-model-in-our-preact-app)
  - [Installing dependencies](#installing-dependencies)
  - [Loading the model](#loading-the-model)
  - [Using the model](#using-the-model)
- [Why in the browser?](#why-in-the-browser)
- [Code of this article](#code-of-this-article)
- [Conclusion](#conclusion)
- [References](#references)

> **Note:** I am a software engineer, not a scientist. Although this example should not be used for medical purposes because the dataset we are going to use is quite small. Besides, a model like this would have to pass scientific review. Take this article as educational from a software point of view.

## The dataset

Before we start training a model, we need to have many images of benign and malignant freckles, as varied as possible, to not have any bias. We have two options:

* Recopilate our custom dataset
* Use an existing dataset

For this tutorial, I'm going to use this dataset from Kaggle, with 3297 images of freckles:

* https://www.kaggle.com/fanconic/skin-cancer-malignant-vs-benign

Thus, you only need to donwload it.

> **Note:** On [Kaggle](https://www.kaggle.com/datasets) you'll find a lot of available datasets, its a good place to search for data. For our purposes, we'll choose an small dataset of 163.66MB. I recommend using one not too big at least for now, so you won't end up with your device's resources.


## Training the model

Once our dataset of images is ready, we can train the model.

First thing we have to know is what kind of model we want. We'll train a [Image Classification Model](https://www.tensorflow.org/tutorials/images/classification), which after a given input image will say if it's benign or malignant.

There is a model called [Mobilenet](https://github.com/tensorflow/tfjs-examples/tree/master/mobilenet), already trained to classify images. The problem? It does not classify the images we want. To fix this we'll use a technique called [transfer learning](https://en.wikipedia.org/wiki/Transfer_learning), to use its "intelligence" to recognize our images.

Currently, we can transfer this knowledge without coding thanks to some open source tools. That's what we're going to do, we'll leave the code for the usage part of this model.

First, we're going to use this tool:

* https://thekevinscott.github.io/ml-classifier-ui/


Now you need to drag&drop the `train` folder from the downloaded dataset and wait. That's all.


> **Note:** Depending on your device GPU performance it can take a long time. If you have chosen a bigger dataset and your device doesn't have enough resources, you can use the [Colab](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/images/transfer_learning.ipynb) environment, modifying the dog-cat example for yours.


<br />
<img src="/images/blog-images/training-skin-cancer.gif" alt="Training the model" class="center" />

## Testing our model

Testing a model lets us know if it still works with new images, not only the ones you have already trained. That's how we know that a model is working.

To test it, we'll use the `test` folder of the dataset. We can drag & drop it again. It contains different images from the ones we've used in the training.

It will be much faster now than before.

<br />
<img src="/images/blog-images/test-skin-cancer.gif" alt="Testing the model" class="center" />

After checking that the trained model predicts quite well, we'll download it to use it in our app.

## Using the model in our (P)React app

We are going to create a Preact app with Snowpack by doing:

```
npx create-snowpack-app skin-cancer-detection --template @snowpack/app-template-preact --use-yarn
```

Then, we'll add our model downloaded files (JSON + weights) inside `skin-cancer-detection/public`.

```diff
public
├── favicon.ico
├── index.html
+├── model
+│   ├── ml-classifier-malignant-benign.json
+│   └── ml-classifier-malignant-benign.weights.bin
└── robots.txt
```

> **Note:** If you want to rename the model, don't forget to modify the `weightsManifest` inside the `.json` file to point correctly to the renamed `.weights.bin` file.

### Installing dependencies

To load the model we'll use [Tensorflow.js](https://www.tensorflow.org/js/tutorials/setup). Also, add `preact/hooks` to use hooks.

```
yarn add @tensorflow/tfjs preact/hooks
```

### Loading the model

To load our model, first we must load the Mobilenet model, as this is the model from which we have applied transfer learning. It's necessary for prediction. We will also load our model.

We're going to create two files:

* Hook to load the model
* Our component to load the hook

Hook to load the model (`src/hooks/useLoadSkinDetectionModel.js`):

```jsx
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "preact/hooks";

const pretrainedModel = {
  url:
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json",
  layer: "conv_pw_13_relu",
};

export default function useLoadSkinDetectionModel() {
  const [state, setState] = useState([]);

  useEffect(() => {
    async function loadModel() {
      const mobilenet = await tf.loadLayersModel(pretrainedModel.url);
      const layer = mobilenet.getLayer(pretrainedModel.layer);
      const pretrained = await tf.model({
        inputs: mobilenet.inputs,
        outputs: layer.output,
      });

      const model = await tf.loadLayersModel(
        "./model/ml-classifier-malignant-benign.json",
      );

      setState([model, pretrained]);
    }
    loadModel();
  }, []);

  return state;
}
```

Our component to load the hook (`src/SkinDetection.jsx`):

```js
import { h } from "preact";
import useLoadSkinDetectionModel from "./hooks/useLoadSkinDetectionModel";

export default function SkinDetection() {
  const model = useLoadSkinDetectionModel();

  if (!model) return "Loading the model...";

  return "Model loaded!";
}
```

In order to test if it loads correctly:

* Add the `<SkinDetection />` component inside your `src/App.jsx`.
* Run `yarn start`

<br />
<img src="/images/blog-images/model-loaded.gif" alt="Checking that the model is loaded correctly" class="center" />

We already have the loaded model. Now we are going to replace the displayed text "Model loaded!" by using this model.

### Using the model

In this tutorial we are going to implement something simple, simply loading an image from the filesystem. It will say the prediction (benign or malignant). We could complicate it by adding a camera that automatically takes pictures, but this is not the purpose of the article.

What we're going to do to get the prediction is this:

<img src="/images/blog-images/prediction-flow.png" alt="Flow to predict" class="center transparent" />

In order to implement this, we're going to replace our `SkinDetection` component to this:

```js
// @todo (I need to fix the code)
// @todo Change tensorflow version?
```

And the result:

```
@todo Add gif of prediction
```

Now that we have our application, let's use an image classification model trained by us!


## Why in the browser?

You've probably wondered at some point why we do it with JavaScript, rather than Python or something else.

<img src="/images/blog-images/why-in-the-browser.png" alt="Why in the browser" class="center transparent" />

Here are several reasons:

* **Faster predictions**: It's not necessary to make a request to any server from our application, so we save the time it takes for the request.
* **Working offline**: As in the previous point, we can make predictions with our device (mobile, tablet, desktop...) even without Internet.
* **Cost zero in money**: We just need to put our app on a CDN. If 2000 people are using the application at the same time to make predictions, we won't sature any server as there is no need even to have a server. Each user will make the predictions directly from their device.
* **Open source models**: Instead of hiding the models behind a server by using them with JavaScript, we are publishing them in such a way that any developer who likes the application can use the same models for their project. 

## Code of this article

The code of this article can be found in my GitHub: 

* https://github.com/aralroca/skin-cancer-detection-tfjs

And the demo link:

* https://aralroca.github.io/skin-cancer-detection-tfjs/

## Conclusion

We've seen how we can solve any kind of image classification problem with a few steps. As an example we have implemented a skin cancer detector that with a given image of a freckle, predicts whether if it's benign or malignant. This application should not be used as something medical, since we have used a very small dataset and it has no scientific review. This is only for educational purpose from a software point of view.

By understanding how we have implemented this detector, the same example can be replicated for any type of image classification:

* Differentiating cats and dogs
* Rock-paper-scissors game
* etc

## References

* https://github.com/thekevinscott/ml-classifier-ui
* https://thekevinscott.com/image-classification-with-javascript/
* https://www.tensorflow.org/js/tutorials
