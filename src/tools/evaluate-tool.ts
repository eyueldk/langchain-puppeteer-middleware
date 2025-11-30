import { tool } from "langchain";
import z from "zod";
import { Session } from "../session";
import { getView } from "../utils";

export function createEvaluateTool({ session }: { session: Session }) {
  return tool(
    async ({ script, viewAfter }: { script: string; viewAfter?: boolean }) => {
      try {
        const result = await session.page.evaluate(script);
        const base = `Execution result: ${JSON.stringify(result)}`;
        const output = [base];
        if (viewAfter) {
          output.push(await getView(session.page));
        }
        return output.join("\n\n");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return `Execution failed with error: ${errorMessage}`;
      }
    },
    {
      name: "evaluate",
      description:
        "Execute JavaScript code in the current browsing session context",
      schema: z.object({
        script: z
          .string()
          .describe(
            "JavaScript code to execute. Must be a function body or expression that returns a value. It will be executed using puppeteer's page.evaluate(script).",
          ),
        viewAfter: z
          .boolean()
          .optional()
          .describe(
            "If true, return a simplified view after evaluating the script",
          ),
      }),
    },
  );
}
