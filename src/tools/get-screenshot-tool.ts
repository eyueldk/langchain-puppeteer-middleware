import { tool, ToolMessage } from "langchain";
import { Session } from "../session";

export function createGetScreenshotTool({ session }: { session: Session }) {
  return tool(
    async (_args, config) => {
      const screenshot = await session.page.screenshot({
        type: "jpeg",
        quality: 50,
      });
      return new ToolMessage({
        content: [
          {
            type: "image",
            source_type: "base64",
            mimeType: "image/jpeg",
            data: Buffer.from(screenshot).toString("base64"),
          },
        ],
        name: "getScreenshot",
        tool_call_id: config.toolCall?.id ?? `getScreenshot-${Date.now()}`,
      });
    },
    {
      name: "getScreenshot",
      description: "Take a screenshot of the current browsing session",
    },
  );
}
