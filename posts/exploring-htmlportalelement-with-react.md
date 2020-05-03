---
title: Exploring HTMLPortalElement with React
description: In this article, I will explain how to use HTMLPortalElement doing a “Hello world” demo with React.
tags: experimental, javascript, react
created: 06/10/2019
cover_image: /images/cover-images/3_cover_image.jpg
cover_image_mobile: /images/cover-images/3_cover_image_mobile.jpg
cover_image_vert: /images/cover-images/3_cover_image_vert.jpg
cover_color: '#D2C9BE'
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
<p>
First of all, to use this draft feature you'll need Chrome Canary. Once you have it, activate the flag of Portals:
</p>

<img class="center" src="/images/blog-images/4.png" alt="Portal flag in Chrome" />

Next, we'll test portals. Remember that portals need to be on the top level of our app (unlike it happens with iframes).

<strong>Hello world with HTMLPortalElement and React:</strong>

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';

function PortalExample() {
  if (!window.HTMLPortalElement) {
    return 'HTMLPortalElement is not supported in your browser.'
  }

  return (
    <portal src="https://www.aralroca.com" />
  );
}

render(<PortalExample />, document.getElementById('root'));
```

We get a similar result than using an iframe:

<img class="center" src="/images/blog-images/5.png" alt="Devtools inspecting the portal" />

Nevertheless, we want a beautiful transition to navigate to the content of this page. How could we get this?

<h2>Navigating to a portal</h2>
As I said, there is a significant difference between portals and iframes; with portals we can navigate to the content. In order to do that, the element has the function <strong>activate</strong> to go to the page.

```jsx
<portal
  src="https://www.aralroca.com"
   // navigate to content
  onClick={({ target }) => target.activate()} 
/>
```

Now we can navigate to the content. Although without any transition... yet:

<img class="center" src="/images/blog-images/6.gif" alt="Using the portal" width="800" height="412" />
<br />

<h2>Adding a page transition</h2>
Instead of calling the <strong>activate</strong> function on the <strong>onClick</strong> event, we are going to use the <strong>onClick</strong> event to add an extra css class with the transition. Then, we are going to use the <strong>onTransitionEnd </strong>event to control when the css transition is finished. After that, we'll call the <strong>activate </strong>function<strong>.</strong>

Therefore, our css transition is going to scale the portal until the portal fits all the content of the page (width and height 100%).

React code:

```jsx
import React, { useState } from 'react';
import { render } from 'react-dom';

import './style.css';

function PortalExample() {
  const [transition, setTransition] = useState(false)

  if (!window.HTMLPortalElement) {
    return 'HTMLPortalElement is not supported in your browser.'
  }

  return (
    <portal
      src="https://www.aralroca.com"
      className={`portal ${transition ? 'portal-reveal' : ''}`}
      onClick={() => setTransition(true)}
      onTransitionEnd={(e) => e.propertyName === 'transform' && e.target.activate()}
    />
  );
}

render(<PortalExample />, document.getElementById('root'));
```

Styles:

```css
body {
  background-color: #212121;
}

.portal {
  position: fixed;
  width: 100%;
  cursor: pointer;
  height: 100%;
  transition: transform 0.4s;
  box-shadow: 0 0 20px 10px #999;
  transform: scale(0.4);
}

.portal.portal-reveal {
  transform: scale(1.0);
}
```

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
