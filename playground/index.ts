import path from "path";
import { createAgent } from "langchain";
import { launch } from "puppeteer";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createPuppeteerMiddleware } from "../src";

const browser = await launch({
  headless: false,
});
const page = await browser.newPage();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});
const agent = createAgent({
  model,
  middleware: [
    createPuppeteerMiddleware({
      page,
      includeTools: {
        getScreenshot: false,
      },
    }),
  ],
});
const indexHtmlPath = path.join(__dirname, "index.html");
const response = await agent.invoke({
  messages: [`Open local file '${indexHtmlPath}' and type 'Hello World!'.`],
});
console.log(response.messages.at(-1)?.text);
