import type { TemplateSource } from "@/data/agentsStatic";

export const AGENTS_HOME_PATH = "/agents";
export const AGENTS_NEW_PATH = "/agents/new";

export type AgentsRoute =
  | { view: "home" }
  | {
      view: "new";
      templateId?: string;
      templateSource?: Exclude<TemplateSource, "custom">;
      editId?: string;
    };

export function parseAgentsPathname(pathname: string): AgentsRoute | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && segments[0] === "agents") {
    return { view: "home" };
  }

  if (segments.length === 2 && segments[0] === "agents" && segments[1] === "new") {
    return { view: "new" };
  }

  return null;
}

export function parseAgentsSearchParams(
  searchParams: URLSearchParams
): Pick<AgentsRoute & { view: "new" }, "templateId" | "templateSource" | "editId"> {
  const templateId = searchParams.get("template") ?? undefined;
  const source = searchParams.get("source");
  const templateSource =
    source === "frndos" || source === "workspace" ? source : undefined;
  const editId = searchParams.get("edit") ?? undefined;

  return { templateId, templateSource, editId };
}

export function agentsNewPath(params?: {
  template?: string;
  source?: Exclude<TemplateSource, "custom">;
  edit?: string;
}): string {
  if (!params) return AGENTS_NEW_PATH;

  const query = new URLSearchParams();
  if (params.template) query.set("template", params.template);
  if (params.source) query.set("source", params.source);
  if (params.edit) query.set("edit", params.edit);

  const qs = query.toString();
  return qs ? `${AGENTS_NEW_PATH}?${qs}` : AGENTS_NEW_PATH;
}

export function getAgentsPageTitle(route: AgentsRoute | null): string | null {
  if (!route) return null;
  if (route.view === "home") return "Agents";
  return "New specialist";
}
