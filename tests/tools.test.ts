import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import puppeteer, { Browser, Page } from "puppeteer";
import { Session } from "../src/session";
import { createGotoTool } from "../src/tools/goto-tool";
import { createClickTool } from "../src/tools/click-tool";
import { createTypeTool } from "../src/tools/type-tool";
import { createEvaluateTool } from "../src/tools/evaluate-tool";
import { createGetScreenshotTool } from "../src/tools/get-screenshot-tool";
import { createInspectHTMLTool } from "../src/tools/inspect-html-tool";
import { createViewPageTool } from "../src/tools/view-page-tool";

describe("Browser Tools Integration Tests", () => {
  let browser: Browser;
  let page: Page;
  let session: Session;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    session = new Session({ page });
    session.start();
  });

  afterAll(async () => {
    session.stop();
    await browser.close();
  });

  test("goto tool should navigate to a URL", async () => {
    const gotoTool = createGotoTool({ session });
    const result = await gotoTool.invoke({ url: "https://example.com" });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    const url = page.url();
    expect(url).toBe("https://example.com/");
  });

  test("inspectHTML tool should return HTML content", async () => {
    const inspectHTMLTool = createInspectHTMLTool({ session });
    const result = await inspectHTMLTool.invoke({ cssSelector: "h1" });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("evaluate tool should execute JavaScript", async () => {
    const evaluateTool = createEvaluateTool({ session });
    const result = await evaluateTool.invoke({ script: "1 + 1" });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("type tool should type text into an input", async () => {
    await page.setContent(`
      <html>
        <body>
          <input id="test-input" type="text" />
        </body>
      </html>
    `);

    const typeTool = createTypeTool({ session });
    const result = await typeTool.invoke({
      cssSelector: "#test-input",
      text: "Hello World",
    });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);

    const inputValue = await page.$eval(
      "#test-input",
      (el) => (el as HTMLInputElement).value,
    );
    expect(inputValue).toBe("Hello World");
  });

  test("click tool should click an element", async () => {
    await page.setContent(`
      <html>
        <body>
          <button id="test-button" onclick="document.body.style.backgroundColor = 'red'">Click Me</button>
        </body>
      </html>
    `);

    const clickTool = createClickTool({ session });
    const result = await clickTool.invoke({ cssSelector: "#test-button" });

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);

    const bgColor = await page.evaluate(
      () => document.body.style.backgroundColor,
    );
    expect(bgColor).toBe("red");
  });

  test("getScreenshot tool should return a ToolMessage", async () => {
    const screenshotTool = createGetScreenshotTool({ session });
    // @ts-ignore - ToolMessage content structure
    const result = await screenshotTool.invoke({});

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
  });

  test("viewPage tool should return simplified page content", async () => {
    await page.setContent(`
      <html>
        <body>
          <h1>Test Title</h1>
          <p>Test Paragraph</p>
          <a href="#">Test Link</a>
        </body>
      </html>
    `);

    const viewPageTool = createViewPageTool({ session });
    const result = await viewPageTool.invoke({});

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
