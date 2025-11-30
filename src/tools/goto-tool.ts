import { tool } from "langchain";
import z from "zod";
import { Session } from "../session";
import { getView } from "../utils";

export function createGotoTool({ session }: { session: Session }) {
  return tool(
    async ({ url, viewAfter }: { url: string; viewAfter?: boolean }) => {
      try {
        await session.page.goto(url, { waitUntil: "networkidle2" });
        const base = `Navigated to URL: ${url}`;
        const output: string[] = [base];
        if (viewAfter) {
          output.push(await getView(session.page));
        }
        return output.join("\n\n");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return `Error navigating to ${url}: ${errorMessage}`;
      }
    },
    {
      name: "goto",
      description: "Navigate to a URL in the current browsing session",
      schema: z.object({
        url: z.string().describe("The URL to navigate to"),
        viewAfter: z
          .boolean()
          .optional()
          .describe("If true, return a simplified view after navigating"),
      }),
    },
  );
}
