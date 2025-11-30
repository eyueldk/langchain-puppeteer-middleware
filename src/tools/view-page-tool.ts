import { tool } from "langchain";
import { Session } from "../session";
import { getView } from "../utils";

export function createViewPageTool({ session }: { session: Session }) {
  return tool(
    async () => {
      const output = await getView(session.page);
      return output;
    },
    {
      name: "viewPage",
      description:
        "View the current browsing session in a simplified form only containing 'interesting' elements.",
    },
  );
}
