# langchainjs-browsing

A LangChain library that provides browser automation tools for AI agents. This package allows AI agents to interact with web pages through a set of browser automation tools.

## Installation

```bash
npm install langchainjs-browsing langchain puppeteer
# or
pnpm add langchainjs-browsing langchain puppeteer
```

## Usage

### Basic Example

```typescript
import { createAgent } from "langchain";
import { launch } from "puppeteer";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createBrowsingMiddleware } from "langchainjs-browsing";

// Launch a Puppeteer browser
const browser = await launch({ headless: false });
const page = await browser.newPage();

// Create your LLM
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

// Create an agent with the browsing library
const agent = createAgent({
  model,
  middleware: [createBrowsingMiddleware({ page })],
});

// Use the agent to browse and interact with web pages
const response = await agent.invoke({
  messages: ["Navigate to https://example.com and tell me what you see."],
});

console.log(response.messages.at(-1)?.text);
```

### Selective Tool Inclusion

You can choose which tools to make available to the agent:

```typescript
const agent = createAgent({
  model,
  middleware: [
    createBrowsingMiddleware({
      page,
      includeTools: {
        goto: true,
        click: true,
        type: true,
        viewPage: true,
        getScreenshot: false, // Exclude screenshot tool
        inspectNetwork: false, // Exclude network inspector
      },
    }),
  ],
});
```

## Available Tools

The library provides the following tools:

- **`goto`** - Navigate to a URL in the current browsing session
- **`click`** - Click an element using a CSS selector
- **`type`** - Type text into an input element using a CSS selector
- **`evaluate`** - Execute JavaScript code in the browsing session context
- **`viewPage`** - View the current browsing session in a simplified form containing only 'interesting' elements
- **`inspectHTML`** - Inspect the outer HTML of a specific element or the entire page
- **`inspectConsole`** - Retrieve console logs from the current browsing session
- **`inspectNetwork`** - Inspect network logs of the current session
- **`getCookies`** - Return cookies for the current session as a JSON string
- **`getScreenshot`** - Take a screenshot of the current browsing session

## API

### `createBrowsingMiddleware(options)`

Creates browsing tools for LangChain agents.

#### Options

- `page` (required): A Puppeteer `Page` instance
- `includeTools` (optional): An object to selectively enable/disable tools
  - Type: `Partial<Record<ToolName, boolean>>`
  - Default: All tools enabled

#### Tool Names

```typescript
type ToolName =
  | "goto"
  | "click"
  | "type"
  | "evaluate"
  | "getCookies"
  | "viewPage"
  | "getScreenshot"
  | "inspectHTML"
  | "inspectConsole"
  | "inspectNetwork";
```

## Development

### Install Dependencies

```bash
pnpm install
```

### Run Playground

```bash
pnpm start
```

### Build

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Format Code

```bash
pnpm format
```

## License

MIT
