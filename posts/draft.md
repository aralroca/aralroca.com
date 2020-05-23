---
title: 'Custom object detection: app to cut wine labels'
description: Cutting label
created: 05/20/2020
tags: tensorflow, javascript, machine-learning
cover_image: /images/cover-images/1_cover_image.jpg
cover_image_mobile: /images/cover-images/1_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/1_cover_image_vert.jpg
cover_color: '#393537'
---

Recently, at [Vinissimus](https://www.vinissimus.com/en/), I have been implementing an app for cutting wine image labels. I want to share here how I finally did it.

<img src="/images/blog-images/57.png" alt="Predicting where labels are located in the image" class="center" />

Before reading this article, I recommend [this other one](https://aralroca.com/blog/first-steps-with-tensorflowjs) I wrote, to understand very basic knowledge of ML (what a model is, how it works, etc)...

## COCO-SSD Model

COCO-SSD is a pretrained model for object detection.

> Object detection is a computer technology related to computer vision and image processing that deals with detecting instances of semantic objects of a certain class (such as humans, buildings, or cars) in digital images and videos. Well-researched domains of object detection include face detection and pedestrian detection. Object detection has applications in many areas of computer vision, including image retrieval and video surveillance. - [Wikipedia](https://en.wikipedia.org/wiki/Object_detection)

With this model we can make predictions of many everyday objects: bicycles, people, cars, birds, dogs, cats...

<img class="center" src="/images/blog-images/58.gif" alt="object detection example" />

It's already trained to be able to detect up to 90 different objects. And it does it very well. However, none of the objects is a wine label... So, will this model work for us?

## Transfering knowledge

Yes, it will serve us. The knowledge of COCO-SSD model has will help us. We are going to use a technique called transfer learning.

> Transfer learning (TL) is a research problem in machine learning (ML) that focuses on storing knowledge gained while solving one problem and applying it to a different but related problem. For example, knowledge gained while learning to recognize cars could apply when trying to recognize trucks. - [Wikipedia](https://en.wikipedia.org/wiki/Transfer_learning)

To do this, I want to share [this tutorial](https://www.dlology.com/blog/how-to-train-an-object-detection-model-easy-for-free) that I found that explains very well how to do it. Anyway, I will explain here in a simple way how we have done it, so that it is easy to replicate the steps without having much knowledge of ML.

### 1. Selecting our set of images

We select a set of

1. Resize your images to 800x600px and save it as `.jpg`. To resize all your images, you can use this [script](https://github.com/Tony607/object_detection_demo/blob/master/resize_images.py), and run it with:

```
python resize_images.py --raw-dir ./data/raw --save-dir ./data/images --ext jpg --target-size "(800, 600)"
```

In our case, we are going to put our wine bottles images:

@todo Add image

2. Split these files in two categories: **train** and **test**. To have a good acurracy I recommend 70% on training and 30% on test. And if you have a lower accuracy maybe is because you need to add more images in both sets.

3. Use [labelImg](https://github.com/tzutalin/labelImg) to mark the labels on each image. It generate a `.xml` file for each image.

4. Open the [Colab](https://colab.research.google.com/github/Tony607/object_detection_demo/blob/master/tensorflow_object_detection_training_colab.ipynb)

5. Prepare tfrecord from images

6) On the left menu, open the files, localize the folder `raw` and upload there your images.

%tensorflow_version 1.x

## Using the model

If you try to load directly the model on Tensorflow.js, you are going to get this error:

> Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models.

This is because we need to convert first to JSON.

--output_json=true

## References

- https://www.dlology.com/blog/how-to-train-an-object-detection-model-easy-for-free/
