import { createMiddleware, DynamicTool, Tool, tool } from "langchain";
import { Session } from "./session";
import type { Page } from "puppeteer";
import { createGotoTool } from "./tools/goto-tool";
import { createClickTool } from "./tools/click-tool";
import { createEvaluateTool } from "./tools/evaluate-tool";
import { createGetCookiesTool } from "./tools/get-cookies-tool";
import { createInspectHTMLTool } from "./tools/inspect-html-tool";
import { createGetScreenshotTool } from "./tools/get-screenshot-tool";
import { createInspectConsoleTool } from "./tools/inspect-console-tool";
import { createInspectNetworkTool } from "./tools/inspect-network-tool";
import { createTypeTool } from "./tools/type-tool";
import { createViewPageTool } from "./tools/view-page-tool";

export type ToolName =
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

export type PuppeteerMiddlewareOptions = {
  page: Page;
  includeTools?: Partial<Record<ToolName, boolean>>;
};

export function createPuppeteerMiddleware({
  page,
  includeTools,
}: PuppeteerMiddlewareOptions) {
  const session = new Session({ page });
  const availableTools: Record<ToolName, () => any> = {
    goto: () => createGotoTool({ session }),
    click: () => createClickTool({ session }),
    type: () => createTypeTool({ session }),
    evaluate: () => createEvaluateTool({ session }),
    inspectConsole: () => createInspectConsoleTool({ session }),
    getCookies: () => createGetCookiesTool({ session }),
    viewPage: () => createViewPageTool({ session }),
    inspectHTML: () => createInspectHTMLTool({ session }),
    getScreenshot: () => createGetScreenshotTool({ session }),
    inspectNetwork: () => createInspectNetworkTool({ session }),
  };
  const tools = Object.entries(availableTools)
    .filter(([name]) => {
      const toolName = name as ToolName;
      if (!includeTools) return true;
      if (includeTools[toolName] !== undefined) {
        return includeTools[toolName];
      }
      return true;
    })
    .map(([, fn]) => fn());
  return createMiddleware({
    name: "puppeteer",
    tools,
  });
}
