import { tool } from "langchain";
import z from "zod";
import { Session } from "../session";

export function createInspectNetworkTool({ session }: { session: Session }) {
  return tool(
    async ({
      limit,
      resourceTypes,
    }: {
      limit?: number;
      resourceTypes?: string[];
    }) => {
      const allowed = resourceTypes ? new Set(resourceTypes) : null;
      const entries = session.networkInspector.items
        .filter((e) => {
          return allowed === null || allowed.has(e.resourceType);
        })
        .slice(limit === undefined ? undefined : -limit);
      return JSON.stringify(entries);
    },
    {
      name: "inspectNetwork",
      description:
        "Inspect network logs of the current session. Optionally filter by an array of lower-case resource types (see schema). If omitted, returns all resource types.",
      schema: z.object({
        limit: z
          .number()
          .optional()
          .describe(
            "Maximum number of recent network logs to retrieve. If not provided, returns all logs.",
          ),
        resourceTypes: z
          .array(
            z.enum([
              "document",
              "stylesheet",
              "image",
              "media",
              "font",
              "script",
              "texttrack",
              "xhr",
              "fetch",
              "prefetch",
              "eventsource",
              "websocket",
              "manifest",
              "signedexchange",
              "ping",
              "cspviolationreport",
              "preflight",
              "fedcm",
              "other",
            ]),
          )
          .optional()
          .describe(
            "Array of lower-case resource types (puppeteer values). If omitted, returns all resource types.",
          ),
      }),
    },
  );
}
