---
title: "AI agents shouldn't control your apps; they should be the app"
created: 03/31/2026
description: "From maintaining open source libraries to building an AI-powered tools OS with Rust and WebAssembly. How Kitmul went from a testing ground to 300+ browser-based tools."
tags: ai, webassembly, rust, javascript, privacy
cover_image: /images/cover-images/36_cover_image.webp
cover_image_mobile: /images/cover-images/36_cover_image_mobile.webp
cover_color: "#1a1a2e"
canonical: https://kitmul.com/en/blog/building-kitmul-ai-tools-os
---

[Kitmul](https://kitmul.com/en) started as something far more modest than what it is today. I maintain two open source libraries: [NextTranslate](https://github.com/aralroca/next-translate) and [Teaful](https://github.com/teafuljs/teaful). I needed a real Next.js project where I could iterate on them. Not artificial demos or example repositories; a live product where bugs surface naturally and limitations become obvious.

That was the only goal.

## The AI multiplier effect

To speed up development, I started using AI coding agents: Claude Code, Gemini, and Codex. Not just for productivity. I wanted to understand firsthand how these agents behave in a real development workflow. What they're good at, where they break, and how they change the way you think about building software.

What I didn't expect was the effect on scope. When you can implement an idea in minutes instead of hours, you stop triaging ideas. You just build them. I went from "let me maintain these two libraries" to "let me build 300+ tools" in just 3 weeks.

Currently I'm on Claude Code 20x. The combination of an agent that understands your codebase deeply and can execute multi-step tasks autonomously has been the biggest development velocity multiplier I've experienced.

## The architecture: everything on the user's device

Kitmul's fundamental technical decision is that everything runs on the client. No exceptions whenever possible.

The stack is straightforward: if native JavaScript is enough, use JavaScript. If the operation is intensive (audio processing, heavy image manipulation, track separation) compile to WebAssembly. For performance-critical parts, Rust compiled to WASM.

For example, here's how we merge PDFs entirely in the browser:

```ts
import { PDFDocument } from "pdf-lib";

export async function mergePDFs(files) {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save(); // Returns Uint8Array, never leaves the browser
}
```

Zero network calls. The file goes from `File API → pdf-lib → download`.

## Why Rust + WASM: the prime number checker

For heavier computation, JavaScript hits a wall. A real example from Kitmul: our [Prime Number Checker](https://kitmul.com/en/math/prime-number-checker). JavaScript can check primality for small numbers, but try testing a number with more than 1,200 digits and the browser tab freezes.

```ts
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// Works for small numbers, but for a 1200+ digit number?
// BigInt arithmetic becomes so slow the tab freezes.
```

The solution: we compiled a Rust crate that uses `num-bigint` with a Miller-Rabin primality test to WASM. The Rust side receives the number as a string (because it can be thousands of digits long) and returns whether it's prime:

```rust
use num_bigint::BigUint;
use num_traits::{One, Zero};

#[no_mangle]
pub extern "C" fn is_number_prime(ptr: *const u8, len: usize) -> i32 {
    let bytes = unsafe { std::slice::from_raw_parts(ptr, len) };
    let num_str = std::str::from_utf8(bytes).unwrap_or("0");
    let n = num_str.parse::<BigUint>().unwrap_or_else(|_| BigUint::zero());

    if n <= BigUint::one() { return 0; }

    if miller_rabin(&n) { 1 } else { 0 }
}
```

## The thesis: AI agents shouldn't control your apps. They should BE the app.

This is where I think the current industry is getting it wrong.

OpenAI with Operator, Anthropic with Computer Use, Google with Project Mariner: the big players are all building AI agents that **control existing applications**. They take screenshots of your screen, move your mouse, click buttons, fill forms. Essentially they're building really sophisticated RPA bots.

I think this approach is fundamentally flawed. Here's why:

**1. You're building on top of interfaces designed for humans, not machines.** When an AI agent navigates a website, it's fighting against dropdowns, modals, cookie banners, CAPTCHAs, and layout changes. Every website redesign can break the agent. This is fragile by design.

**2. You still depend on third-party services.** The AI agent might be smart, but it's still uploading your PDF to iLovePDF, still sending your images to Canva's servers, still giving your data to someone else. The privacy problem doesn't go away just because a robot is clicking the buttons.

**3. It's slow.** Screenshot → analyze → click → wait for page load → screenshot again. This loop takes seconds per action. Meanwhile, a direct function call takes milliseconds.

The alternative: what I'm building with Kitmul is radically different.

**The AI agent doesn't control apps. The AI agent IS the app.**

Instead of navigating to some website to remove an image background, the agent calls a local function that runs a WASM-compiled AI model directly in the browser. No screenshots. No navigation. No external servers. Just a function call that returns a result.

## From dev tools to tools for everyone

As an open source developer, I've always built for other developers. Libraries, CLI tools, build utilities. Limited audience, limited impact.

With Kitmul I flipped the question. Instead of "what tool does a dev need," I asked: "what tool do people search for on Google and end up on a website that charges them or uploads their files to a server."

The answer: hundreds of tools. Remove image backgrounds, separate audio tracks, convert formats, compress PDFs, generate QR codes. Tools people use daily, and for which many sites charge €10-20/month.

Today Kitmul has over 300. And they're not trivial wrappers.

## The part that gets really interesting: self-building tools

Here's where Kitmul diverges from everything else.

With 300+ tools, we cover a lot of use cases. But when a user asks for something we don't have, instead of saying "sorry, we can't do that," the system should be able to **create the tool on the fly with AI**; and then, critically, have a **human-in-the-loop** verify that the generated tool actually works correctly before it becomes part of the permanent catalog.

Think about it:

1. User asks: "I need a tool that converts MIDI files to sheet music."
2. The AI generates the tool: a client-side implementation using WebAssembly.
3. A human reviewer (me, or eventually a community of contributors) verifies the tool works, handles edge cases, and meets Kitmul's quality standards.
4. Once approved, the tool is permanently added to the catalog.
5. The next user who asks for the same thing gets the verified, production-quality tool instantly.

**The system literally builds itself based on what users need.** Every unanswered request becomes a signal. Every verified tool makes the platform more capable. It's a flywheel where AI generates, humans verify, and the catalog grows organically.

This is fundamentally different from the "generate code at runtime" approach that some AI companies are pursuing. Generated code running without verification is a liability: it might have bugs, security holes, or simply not work for edge cases. The human-in-the-loop step is not a limitation; it's a **feature**. It ensures every tool in the catalog is production-quality.

## See it in action

Here's a quick demo of how Kitmul works:

<iframe width="560" height="315" src="https://www.youtube.com/embed/_CW7LiagTi8" frameborder="0" allowfullscreen></iframe>

## What's next

The orchestration works for simple flows, but complex workflows with branching, conditionals, and feedback loops still need work. The self-building pipeline is being designed right now.

The long-term vision: a system where any task you do today with fragmented software (uploading files here, paying a subscription there, installing an app for something else) can be resolved within a single interface, executed locally, orchestrated by AI, and constantly expanding based on what users actually need.

The question I want to leave you with: **Do we really need AI agents that puppet our existing apps? Or do we need to rethink what the app itself should be?**

I think the answer is the latter. And I think the browser is the right runtime to prove it.
