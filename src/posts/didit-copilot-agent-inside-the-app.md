---
title: 'Didit Copilot: shipping an AI agent that lives inside the app'
created: 07/09/2026
description: 'We just shipped Didit Copilot, an AI agent embedded in the Didit identity-verification console. It queries your data through an MCP server, drives the UI through WebMCP tools, and falls back to inferring the DOM. Here is the full architecture — gui-agent, Mastra, and the lessons — so you can build the same for your product.'
tags: ai, webmcp, mastra, agents, javascript
cover_image: /images/cover-images/40_cover_image.webp
cover_image_mobile: /images/cover-images/40_cover_image_mobile.webp
cover_color: '#F4F7FA'
---

A few months ago I wrote that [AI agents shouldn't control your apps; they should be the app](ai-agents-should-be-the-app). That post was the thesis. This one is the proof.

We just shipped **Didit Copilot**: an AI agent embedded in the [Didit](https://didit.me) Business Console, the dashboard our customers use to manage identity verification (KYC/KYB, AML screening, biometrics, workflows). You open a chat panel, ask in natural language, and the agent operates the console **in front of you**: it queries your data, opens pages, applies filters, and builds verification workflows on the visual editor; node by node, with a glow over everything it touches.

No screenshots. No robot moving your mouse. The app itself exposes its actions to the agent, and the agent composes them.

## One model, three tool families

The whole architecture boils down to a single decision: the LLM sees **three families of tools** and picks the right one for each step.

1. **`didit_*` — MCP server tools.** Business data lives behind an MCP server that acts as the signed-in user: sessions, analytics, users, billing. These run on the backend with the user's own token, so the agent can never see more than the user can.

2. **`ui_*` — WebMCP browser tools.** The console registers its own actions as structured tools on the page: open this session, apply these filters, add a workflow step on the canvas. These run **inside the user's tab**, so the user watches them happen.

3. **DOM fallback.** When nothing is exposed for the job, the agent reads a text snapshot of the page and clicks/fills by element ref — the same trick [page-agent](https://github.com/alibaba/page-agent) popularized, no multimodal model needed.

The routing rule the agent follows: prefer a purpose-built `ui_*` tool, fall back to the DOM for anything visible on the page, and go to the MCP server for data. Let's see each one working; every video below is a real recording against our console.

## MCP server tools: the data path

Ask a data question and the agent chains MCP tools (`didit_context_get` → `didit_analytics` → `didit_session_search`), then streams the answer with real tables:

<figure align="center">
  <video src="/videos/didit-copilot-mcp-tools.mp4" controls muted playsInline width="100%"></video>
  <figcaption><small>"How many verification sessions did we get this week?" the agent resolves the org context, calls analytics, and renders the result as tables.</small></figcaption>
</figure>

Nothing exotic here, this is what MCP was designed for. The interesting part is the other two families.

## WebMCP tools: the app exposes itself

This is where [gui-agent](https://github.com/aralroca/gui-agent) comes in, an open-source library I built exactly for this pattern ([`@aralroca/gui-agent`](https://www.npmjs.com/package/@aralroca/gui-agent) on npm). It implements the emerging [W3C WebMCP draft](https://webmachinelearning.github.io/webmcp/): your app registers its actions as tools on `document.modelContext`, and any WebMCP agent, yours, or eventually the browser's native one, can call them.

With the React bindings, exposing an action is one hook:

```tsx
import { useTool } from "@aralroca/gui-agent/react";

function WorkflowEditor() {
  // Registered while mounted; auto-unregistered on unmount.
  useTool({
    name: "ui_create_workflow_step",
    description: "Add a verification step to the workflow on the canvas",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string", description: "Step type, e.g. AML or PHONE_VERIFICATION" },
        after: { type: "string", description: "Node id to insert after" },
      },
      required: ["feature"],
    },
    execute: ({ feature, after }) => workflowStore.addStep(feature, after),
  });
  return /* … */;
}
```

Registration is scoped to the page the user is on: mount the component, the tool exists; navigate away, it's gone. The agent's tool list always mirrors what the user can actually do right now.

Here's the agent building a workflow on the React Flow canvas, notice the subtle highlight ring over the node it creates (that's gui-agent's visualizer, themed to our console's own focus ring via CSS variables), and the **confirmation card** before the mutating tool runs:

<figure align="center">
  <video src="/videos/didit-copilot-webmcp-tools.mp4" controls muted playsInline width="100%"></video>
  <figcaption><small>"Add an AML Screening step right after the Face Match step" the agent reads the graph, asks for confirmation (it's a mutating action), inserts the node, auto-arranges the canvas, and centers it without touching your zoom.</small></figcaption>
</figure>

## DOM fallback: infer the page when nothing is exposed

You'll never cover every micro-interaction with first-class tools, and you shouldn't try. For the long tail, gui-agent synthesizes six DOM tools (`read_page`, `click`, `fill`, `select_option`, `wait_for_text`, `upload_file`). `read_page` returns a **text outline** of the interactive elements with stable refs:

```
[e1] button "Switch application" expanded=false
[e4] link "Home"
[e5] link "Users"
[e13] button "Columns" haspopup=menu
```

The model reasons over that outline and acts by ref. Text in, text out, cheap, fast, and it works with any model:

<figure align="center">
  <video src="/videos/didit-copilot-dom-fallback.mp4" controls muted playsInline width="100%"></video>
  <figcaption><small>"Show the Verifications column", no ui_* tool covers column visibility, so the agent reads the page, opens the Columns menu, and toggles it. Pure DOM inference.</small></figcaption>
</figure>


## The server side: Mastra + MCP

The brain runs in a small Node service built on [Mastra](https://mastra.ai). The agent itself is a few lines, model via OpenRouter, conversation memory in Postgres:

```ts
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export const copilot = new Agent({
  name: "didit-copilot",
  instructions: COPILOT_INSTRUCTIONS, // the 3-family routing rules live here
  model: openrouter("google/gemini-3.1-flash-lite"),
  memory: new Memory({ options: { lastMessages: 20 } }),
});
```

The MCP connection is **per request**, created with the calling user's Bearer token, that's what keeps the agent inside the user's permissions:

```ts
import { MCPClient } from "@mastra/mcp";

function diditMcpFor(accessToken: string) {
  return new MCPClient({
    servers: {
      didit: {
        url: new URL("https://mcp.didit.me/mcp"),
        requestInit: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      },
    },
  });
}
```

And here's the trick that makes the browser tools work. Each turn, the console sends the JSON specs of whatever `ui_*` tools are registered on the current page. The server turns them into AI SDK tools **without an `execute`**:

```ts
import { tool, jsonSchema } from "ai";

// An execute-less tool is not run on the server — its call is forwarded
// down the stream, the browser executes it via gui-agent's registry,
// and useChat sends the output back so the model continues.
clientTools[spec.name] = tool({
  description: spec.description,
  inputSchema: jsonSchema(spec.inputSchema),
});
```

The chat route hands both families to the agent and streams an AI SDK UI-message response, byte-compatible with `useChat` on the frontend:

```ts
const mcp = diditMcpFor(userToken);

const stream = await copilot.stream(messages, {
  toolsets: await mcp.getToolsets(), // didit_* (server-executed)
  clientTools,                       // ui_* + DOM (browser-executed)
});
```

Round trip: model calls `ui_create_workflow_step` → the call streams down → `onToolCall` in the browser executes it through gui-agent → the output goes back up → the model continues. The app is the runtime.

## Human-in-the-loop, enforced twice

Mutating tools (`ui_create_*`, `ui_delete_*`, `upload_file`, anything `*_delete`/`*_publish`) require the user's explicit confirmation, that's the card you saw in the workflow video. One design decision I'd defend hard: **the gate is by tool name**, a boring regex both sides agree on. No model judgment involved in deciding what's dangerous.

And a second lesson from recording these demos: we originally marked destructive client tools with the AI SDK's `needsApproval` flag on the server and trusted the framework to pause. It doesn't — approval gates run at execution time, and execute-less browser tools are never executed server-side, so the flag was silently ignored and mutating actions ran unconfirmed. We caught it on camera. The fix: the console now enforces the same by-name contract **client-side**, parking the call and showing the confirmation card before anything runs. If your agent executes tools in the browser, gate them in the browser, defense in depth is not optional when a framework sits between you and the pause button.

## Why this beats the puppeteering approach

Same argument as [last time](ai-agents-should-be-the-app), now with production mileage:

**1. Structured beats guessed.** A `ui_*` tool with a JSON schema succeeds or fails loudly. A bot guessing pixel coordinates degrades silently with every redesign.

**2. The user sees everything.** The glow, the chips, the confirmation cards, the agent works in the same UI the user is looking at. Trust comes from visibility.

**3. Permissions come free.** The MCP server acts as the signed-in user and the browser tools run in their session. There is no "agent account" with god-mode credentials.

**4. The fallback covers the tail.** You expose your 30 core actions as WebMCP tools and let DOM inference handle the rest. You don't need 100% coverage on day one.

If you want to build this for your own product: register your app's actions with [gui-agent](https://github.com/aralroca/gui-agent) (or any WebMCP implementation), put your data behind an MCP server, and wire a Mastra agent between them with execute-less tools for the browser side. That's the whole recipe.

The browser is turning into an agent runtime. The question is no longer whether an AI will operate your app, it's whether it will operate it **through the front door you built for it**, or by rattling every window. I know which one I'm building for.
