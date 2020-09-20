---
title: Labelai - speed up training your AI models with a free open source app
created: 09/20/2020
description: I've launched Labelai. Training AI models are now more friendlier. Use it from any device ensuring security. It has support for ImageNet and YOLO.
tags: machine-learning, tensorflow, javascript
cover_image: /images/cover-images/19_cover_image.jpeg
cover_image_mobile: /images/cover-images/19_cover_image_mobile.jpeg
cover_image_vert: /images/cover-images/19_cover_image_vert.jpeg
cover_color: '#EFF0F2'
dev_to: labelai-speed-up-training-your-ai-models-with-a-free-open-source-app-51ld
---

I'd like to tell you why I made **[Labelai](https://github.com/aralroca/labelai)**, a tool that makes it easier to train image recognition AI models (ImageNet, YOLO and its variants) from any device ensuring security.

## A little bit of context

When we want to directly use existing image recognition models such as ImageNet, COCO-ssd or YOLO, we are limited to predict only everyday objects such as cars, people, etc. This is because these models have only learned to recognize these objects within an image. However, there are techniques such as transfer-learning that allow us to retrain these models to **predict what we want**. 

In order to retrain these models, we have to **manually label each object** that we want to recognize by writing the coordinates of the object in a text file for each image to train. This way the model will be able to learn how to recognize them. This labeling process can be very boring and tedious.

Currently, there are not many alternative tools for this labeling process. The best known current tool is [labelImg](https://github.com/tzutalin/labelImg). The tool is good and does its job, although it has some root problems:

- **Not available in all devices**. It can only be downloaded as a desktop application.
- **Requires installation**. It requires installation and it isn't very beginner-friendly. Depending on your OS and Python version the dependencies will be different. For example on Mac with Python 3+, you need to install first some dependencies like `qt` and `libxml2` with Homebrew, and `pyqt5` and `lxml` with pip.
- **Security**. The application manipulates the files on your system. In theory, it only manipulates files related to annotations. I say "in theory", because we hope there won't be a bug in the future touching what it shouldn't... 
- **Updates are not automatic**. Related to the previous point, many updates are made for security reasons, especially if it has dependencies. The fact that updates are not done automatically makes it your responsibility to keep your application up to date.


## Launching Labelai

Using labelImg during the last months, I realized that a **web application** inspired by it would solve several of these problems:

- **Available in all devices**. Being a web application makes it accessible from any device, even tablets, and mobiles.
- **No installation required**. It speeds up the start, as it does not require installation and has no dependencies on your operating system. Only the browser.
- **Automatic updates**. You will always have the latest version available.
- **Security**. No file on your system is directly manipulated. Files are imported/saved using the security layer of your browser.
- **Beginner-friendly**. We want it to be an easy-to-use process without losing flexibility. To start, you only need to open a browser with any device.

So during my August holiday, I took the opportunity to implement the first POC of my idea. And today, I announce that its **first version is out**.

<a href="https://github.com/aralroca/labelai">
  <figure align="center">
    <img class="center" src="/images/blog-images/labelai.png" alt="Labelai logo" />
    <figcaption><small>Labelai</small></figcaption>
  </figure>
</a>

This version 1.0.0 is focused on being useful as a web tool to label your images and supports both **ImageNet** and **YOLO**, and its variants.

In addition, I tried to improve the user experience when labeling by making it less necessary to press so many buttons.

Currently, I have some future ideas to expand the features so that it does not remain only as an annotation tool, but to train models after labeling the images.

<figure align="center">
  <img class="center" src="/images/blog-images/demo.gif" alt="Labelai demo" />
  <figcaption><small>Labelai demo</small></figcaption>
</figure>


## Future features

As a free open-source tool we want to evolve according to the contributions of the community. However, in the first version, there are some things that have not yet been implemented and the idea is to implement them for the next version:

* **Improve tablet / mobile experience**. Now the support is minimal, it works, but not as well as some users would like. For example, it is not very responsive. This should be improved in a next version.
* Possibility to **train directly** your labeled images **with the same app** and also to save the generated model.
* **Offline** support. Now it only works online, but one of the improvements would be to support it offline as PWA.

Any further improvements you would like to make? Please let me know in the comments.

## Try it

I encourage you to try the app and contribute to GitHub to evolve this tool according to the community.

* App: https://labelai.vercel.app/
* GitHub: https://github.com/aralroca/labelai

To help me boost this project, please, let me know that you like it by **starring on GitHub**.