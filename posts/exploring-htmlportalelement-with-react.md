---
title: Exploring HTMLPortalElement with React
description: In this article, I will explain how to use HTMLPortalElement doing a “Hello world” demo with React.
tags: portals, htmlportalelement, react, react.js
created: 06/10/2019
cover_image: https://aralroca.files.wordpress.com/2019/06/pedro-lastra-137923-unsplash-e1560074127908.jpg?w=2560&h=1163&crop=1
---

HTMLPortalElement is a draft of a new HTML Element, very similar to iframes but with the big difference that it allows to navigate to the content of the "iframe" by using a page transition.

<img class="center" src="/images/blog-images/3.gif" alt="Example of HTMLPortalElement" />

To know more about it, I recommend to read these references:

<ul>
	<li><a href="https://wicg.github.io/portals/#the-portalactivateevent-interface">https://wicg.github.io/portals/#the-portalactivateevent-interface</a></li>
	<li><a href="https://web.dev/hands-on-portals">https://web.dev/hands-on-portals</a></li>
	<li><a href="https://github.com/WICG/portals/blob/master/explainer.md">https://github.com/WICG/portals/blob/master/explainer.md</a></li>
</ul>

In this article, I will explain how to use this future feature to do a "Hello world" demo with React.

<h2>Getting started</h2>
First of all, to use this draft feature you'll need Chrome Canary. Once you have it, activate the flag of Portals:

<img class="center" src="/images/blog-images/4.png" alt="Portal flag in Chrome" />

Next, we'll test portals. Remember that portals need to be on the top level of our app (unlike it happens with iframes).

<strong>Hello world with HTMLPortalElement and React:</strong>

<pre style="margin: 0; line-height: 125%;"><span style="color: #008800; font-weight: bold;">import</span> React, { useState, useEffect, useRef } from <span style="background-color: #fff0f0;">'react'</span>;
<span style="color: #008800; font-weight: bold;">import</span> { render } from <span style="background-color: #fff0f0;">'react-dom'</span>;

<span style="color: #008800; font-weight: bold;">function</span> PortalExample() {
  <span style="color: #008800; font-weight: bold;">if</span> (<span style="color: #333333;">!</span><span style="color: #007020;">window</span>.HTMLPortalElement) {
    <span style="color: #008800; font-weight: bold;">return</span> <span style="background-color: #fff0f0;">'HTMLPortalElement is not supported in your browser.'</span>
  }

  <span style="color: #008800; font-weight: bold;">return</span> (
    <span style="color: #333333;"><</span>portal
      src<span style="color: #333333;">=</span><span style="background-color: #fff0f0;">"https://www.aralroca.com"</span>
    <span style="color: #333333;">/></span>
  );
}

render(<span style="color: #333333;"><</span>PortalExample <span style="color: #333333;">/></span>, <span style="color: #007020;">document</span>.getElementById(<span style="background-color: #fff0f0;">'root'</span>));
</pre>

We get a similar result than using an iframe:

<img class="center" src="/images/blog-images/5.png" alt="Devtools inspecting the portal" />

Nevertheless, we want a beautiful transition to navigate to the content of this page. How could we get this?

<h2>Navigating to a portal</h2>
As I said, there is a significant difference between portals and iframes; with portals we can navigate to the content. In order to do that, the element has the function <strong>activate</strong> to go to the page.
<pre style="margin: 0; line-height: 125%;"><span style="color: #333333;"><</span>portal
  src<span style="color: #333333;">=</span><span style="background-color: #fff0f0;">"https://www.aralroca.com"</span>
   <span style="color: #888888;">// navigate to content</span>
  onClick<span style="color: #333333;">=</span>{({ target }) <span style="color: #333333;">=></span> target.activate()} 
<span style="color: #333333;">/></span>
</pre>
Now we can navigate to the content. Although without any transition... yet:

<img class="center" src="/images/blog-images/6.gif" alt="Using the portal" width="800" height="412" />

<h2>Adding a page transition</h2>
Instead of calling the <strong>activate</strong> function on the <strong>onClick</strong> event, we are going to use the <strong>onClick</strong> event to add an extra css class with the transition. Then, we are going to use the <strong>onTransitionEnd </strong>event to control when the css transition is finished. After that, we'll call the <strong>activate </strong>function<strong>.</strong>

Therefore, our css transition is going to scale the portal until the portal fits all the content of the page (width and height 100%).

React code:

<pre style="margin: 0; line-height: 125%;"><span style="color: #008800; font-weight: bold;">import</span> React, { useState } from <span style="background-color: #fff0f0;">'react'</span>;
<span style="color: #008800; font-weight: bold;">import</span> { render } from <span style="background-color: #fff0f0;">'react-dom'</span>;

<span style="color: #008800; font-weight: bold;">import</span> <span style="background-color: #fff0f0;">'./style.css'</span>;

<span style="color: #008800; font-weight: bold;">function</span> PortalExample() {
  <span style="color: #008800; font-weight: bold;">const</span> [transition, setTransition] <span style="color: #333333;">=</span> useState(<span style="color: #008800; font-weight: bold;">false</span>)

  <span style="color: #008800; font-weight: bold;">if</span> (<span style="color: #333333;">!</span><span style="color: #007020;">window</span>.HTMLPortalElement) {
    <span style="color: #008800; font-weight: bold;">return</span> <span style="background-color: #fff0f0;">'HTMLPortalElement is not supported in your browser.'</span>
  }

  <span style="color: #008800; font-weight: bold;">return</span> (
    <span style="color: #333333;"><</span>portal
      src<span style="color: #333333;">=</span><span style="background-color: #fff0f0;">"https://www.aralroca.com"</span>
      className<span style="color: #333333;">=</span>{<span style="background-color: #fff0f0;">`portal ${transition ? 'portal-reveal' : ''}`</span>}
      onClick<span style="color: #333333;">=</span>{() <span style="color: #333333;">=></span> setTransition(<span style="color: #008800; font-weight: bold;">true</span>)}
      onTransitionEnd<span style="color: #333333;">=</span>{(e) <span style="color: #333333;">=></span> e.propertyName <span style="color: #333333;">===</span> <span style="background-color: #fff0f0;">'transform'</span> <span style="color: #333333;">&&</span> e.target.activate()}
    <span style="color: #333333;">/></span>
  );
}

render(<span style="color: #333333;"><</span>PortalExample <span style="color: #333333;">/></span>, <span style="color: #007020;">document</span>.getElementById(<span style="background-color: #fff0f0;">'root'</span>));
</pre>

Styles:

<pre style="margin: 0; line-height: 125%;"><span style="color: #007700;">body</span> {
  <span style="color: #008800; font-weight: bold;">background-color</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">#212121</span>;
}

<span style="color: #bb0066; font-weight: bold;">.portal</span> {
  <span style="color: #008800; font-weight: bold;">position</span><span style="color: #333333;">:</span> <span style="color: #008800; font-weight: bold;">fixed</span>;
  <span style="color: #008800; font-weight: bold;">width</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">100</span><span style="color: #333333;">%</span>;
  <span style="color: #008800; font-weight: bold;">cursor</span><span style="color: #333333;">:</span> <span style="color: #008800; font-weight: bold;">pointer</span>;
  <span style="color: #008800; font-weight: bold;">height</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">100</span><span style="color: #333333;">%</span>;
  transition<span style="color: #333333;">:</span> transform <span style="color: #6600ee; font-weight: bold;">0.4s</span>;
  box<span style="color: #333333;">-</span>shadow<span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">0</span> <span style="color: #6600ee; font-weight: bold;">0</span> <span style="color: #6600ee; font-weight: bold;">20px</span> <span style="color: #6600ee; font-weight: bold;">10px</span> <span style="color: #6600ee; font-weight: bold;">#999</span>;
  transform<span style="color: #333333;">:</span> scale(<span style="color: #6600ee; font-weight: bold;">0</span><span style="color: #333333;">.</span><span style="color: #6600ee; font-weight: bold;">4</span>);
}

<span style="color: #bb0066; font-weight: bold;">.portal.portal-reveal</span> {
  transform<span style="color: #333333;">:</span> scale(<span style="color: #6600ee; font-weight: bold;">1</span><span style="color: #333333;">.</span><span style="color: #6600ee; font-weight: bold;">0</span>);
}
</pre>

Finally, we get the page transition in our portal:

<img class="center" src="/images/blog-images/7.gif" alt="Adding a transition to the portal" width="800" height="412" />

Code: <a href="https://github.com/aralroca/HTMLPortalElement-react-example">https://github.com/aralroca/HTMLPortalElement-react-example</a>

<h2>Benefits of portals</h2>
Portals are a new proposal to load pages as an iframe, allowing the navigation to the content with a beautiful transition and improving the user's experience.

They can be useful for previews of videos / audio, so you can navigate to the content page without stop watching / listening the media at any moment.

<img class="center" src="/images/blog-images/8.gif" alt="Final example using portals" width="800" height="413" />

Of course, here we are using a different origin (YouTube). Nevertheless, if we use the same origin, we can communicate with the portal at any moment and do things like displaying a beauty preview or loading the rest of the content after the portal is activated.

<h2>Conclusion</h2>
Portals are still a proposal and maybe it's something we won't see in the future. Whatever, if it finally exists, it's going to be useful to preview content, especially, for media.

<iframe class="center youtube" src="https://www.youtube.com/embed/_4VkeU7E6oA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


<h2>References:</h2>
<ul>
	<li><a href="https://wicg.github.io/portals/#the-portalactivateevent-interface">https://wicg.github.io/portals/#the-portalactivateevent-interface</a></li>
	<li><a href="https://web.dev/hands-on-portals">https://web.dev/hands-on-portals</a></li>
	<li><a href="https://github.com/WICG/portals/blob/master/explainer.md">https://github.com/WICG/portals/blob/master/explainer.md</a></li>
</ul>
