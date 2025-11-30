import { tool } from "langchain";
import z from "zod";
import { Session } from "../session";

export function createInspectHTMLTool({ session }: { session: Session }) {
  return tool(
    async ({ cssSelector }) => {
      try {
        if (!cssSelector) {
          return await session.page.content();
        }
        return await session.page.$eval(
          cssSelector,
          (element) => element?.outerHTML,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return `Error occurred getting outer html of "${cssSelector}": ${errorMessage}`;
      }
    },
    {
      name: "inspectHTML",
      description:
        "Inspect the outer HTML of a specific element. If a selector is not provided, the outer HTML of the entire page will be returned.",
      schema: z.object({
        cssSelector: z
          .string()
          .optional()
          .describe("The CSS selector for the element"),
      }),
    },
  );
}
