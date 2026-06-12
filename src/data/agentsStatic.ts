/** Agents specialist team — ported from frndos-agents-prototype */

import { DOCK_BRANDS } from "./homeStatic";

export type TemplateSource = "frndos" | "workspace" | "custom";
export type BrandAccessMode = "all" | "selected" | "later";
export type Surface = "AskFrnd" | "Research" | "Reports" | "KV";
export type WorkTypeId =
  | "strategy"
  | "research"
  | "content"
  | "reporting"
  | "orchestration"
  | "engineering";
export type ToneId = "direct" | "collaborative" | "analytical" | "bold";
export type PersonaIconId =
  | "Bot"
  | "Target"
  | "Search"
  | "PenLine"
  | "BarChart3"
  | "GitBranch"
  | "Wrench"
  | "Sparkles"
  | "Lightbulb"
  | "FileText"
  | "Users"
  | "Megaphone";

export interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  type: "default" | "custom";
  brandName: string;
  brandColor: string;
  avatarIcon: PersonaIconId;
  accentColor: string;
  skills: string[];
  status: "active" | "draft" | "archived";
  lastInvokedAt: string | null;
  createdAt: string;
  systemPrompt: string;
  sourceTemplateId?: string;
  sourceTemplateSource?: TemplateSource;
  brandAccessMode: BrandAccessMode;
  brandAccessIds: string[];
  behaviorSummary: string;
  surfaces: Surface[];
}

export interface SpecialistTemplate {
  id: string;
  name: string;
  role: string;
  jobStatement: string;
  description: string;
  source: Exclude<TemplateSource, "custom">;
  skills: string[];
  surfaces: Surface[];
  behaviorSummary: string;
  systemPrompt: string;
  brandColor: string;
  avatarIcon: PersonaIconId;
  accentColor: string;
  publishedBy?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: "Strategy" | "Research" | "Content" | "Analytics" | "Other";
  type: "default" | "custom";
}

export interface Brand {
  id: string;
  name: string;
  color: string;
}

export interface WorkTypeOption {
  id: WorkTypeId;
  label: string;
  role: string;
  defaultName: string;
  promptStarter: string;
  jobStatement: string;
  behaviorSummary: string;
  skillIds: string[];
  surfaces: Surface[];
}

export interface ToneOption {
  id: ToneId;
  label: string;
  summaryCue: string;
  promptCue: string;
}

export interface SpecialistSuggestion {
  name: string;
  role: string;
  description: string;
  behaviorSummary: string;
  systemPrompt: string;
  selectedSkillIds: string[];
  surfaces: Surface[];
}

const BRAND_COLORS = ["#7C3AED", "#3B82F6", "#F59E0B", "#10B981"] as const;

export const workspaceBrands: Brand[] = DOCK_BRANDS.map((brand, index) => ({
  id: brand.id,
  name: brand.name,
  color: BRAND_COLORS[index % BRAND_COLORS.length],
}));

/** @deprecated use workspaceBrands */
export const mockBrands = workspaceBrands;

export const surfaceOptions: Surface[] = [
  "AskFrnd",
  "Research",
  "Reports",
  "KV",
];

export const personaIconOptions: PersonaIconId[] = [
  "Bot",
  "Target",
  "Search",
  "PenLine",
  "BarChart3",
  "GitBranch",
  "Wrench",
  "Sparkles",
  "Lightbulb",
  "FileText",
  "Users",
  "Megaphone",
];

export const personaColorOptions: string[] = [
  "#7C3AED",
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#EF4444",
  "#757D90",
  "#A855F7",
];

export const previewTestChips = [
  "What's your expertise?",
  "How do you work?",
  "Summarize a weekly report",
] as const;

export const toneOptions: ToneOption[] = [
  {
    id: "direct",
    label: "Direct",
    summaryCue: "Concise, decisive, and clear about next steps.",
    promptCue: "Use plain language, move quickly, and avoid filler.",
  },
  {
    id: "collaborative",
    label: "Collaborative",
    summaryCue: "Supportive, constructive, and easy to work with.",
    promptCue: "Guide the user with a collaborative tone and clear choices.",
  },
  {
    id: "analytical",
    label: "Analytical",
    summaryCue: "Evidence-first, structured, and explicit about reasoning.",
    promptCue:
      "Show rationale, distinguish facts from assumptions, and stay rigorous.",
  },
  {
    id: "bold",
    label: "Bold",
    summaryCue: "Opinionated, creative, and comfortable making calls.",
    promptCue:
      "Push for sharper ideas, stronger positioning, and memorable outputs.",
  },
];

export const workTypeOptions: WorkTypeOption[] = [
  {
    id: "strategy",
    label: "Strategy",
    role: "Brand Strategist",
    defaultName: "Brand Strategist",
    promptStarter:
      "You are a senior strategist shaping positioning, messaging, and long-term decisions.",
    jobStatement:
      "Shape positioning, messaging, and strategic direction for campaigns and brands.",
    behaviorSummary:
      "Turn broad goals into sharp strategic recommendations with clear rationale.",
    skillIds: ["s1", "s4"],
    surfaces: ["AskFrnd", "Reports", "KV"],
  },
  {
    id: "research",
    label: "Research",
    role: "Research Specialist",
    defaultName: "Research Specialist",
    promptStarter:
      "You are a research specialist who gathers evidence, verifies sources, and structures findings.",
    jobStatement:
      "Research signals, competitors, and evidence so the team can make better decisions.",
    behaviorSummary:
      "Lead with evidence, summarize what matters, and flag weak assumptions early.",
    skillIds: ["s2", "s8"],
    surfaces: ["AskFrnd", "Research", "Reports"],
  },
  {
    id: "content",
    label: "Content",
    role: "Content Specialist",
    defaultName: "Content Specialist",
    promptStarter:
      "You are a content specialist who turns direction into sharp, channel-ready writing.",
    jobStatement:
      "Draft copy, narratives, and communication that match the brand and the moment.",
    behaviorSummary:
      "Write clearly, move quickly, and tailor the output to the channel and audience.",
    skillIds: ["s3", "s9"],
    surfaces: ["AskFrnd", "KV", "Reports"],
  },
  {
    id: "reporting",
    label: "Reporting",
    role: "Reporting Specialist",
    defaultName: "Reporting Specialist",
    promptStarter:
      "You are a reporting specialist who turns performance data into useful narratives and next steps.",
    jobStatement:
      "Summarize performance, surface changes, and prepare reports people can act on.",
    behaviorSummary:
      "Highlight what changed, why it matters, and what the team should do next.",
    skillIds: ["s4", "s2"],
    surfaces: ["AskFrnd", "Reports", "KV"],
  },
  {
    id: "orchestration",
    label: "Orchestration",
    role: "Orchestrator",
    defaultName: "Orchestrator",
    promptStarter:
      "You are an orchestrator who breaks goals into workstreams, routes work, and owns synthesis.",
    jobStatement:
      "Coordinate specialists, sequence work, and keep outputs aligned to the goal.",
    behaviorSummary:
      "Delegate clearly, keep teams moving, and turn scattered work into one usable outcome.",
    skillIds: ["s7"],
    surfaces: ["AskFrnd", "Research", "Reports", "KV"],
  },
  {
    id: "engineering",
    label: "Engineering",
    role: "Systems Engineer",
    defaultName: "Systems Engineer",
    promptStarter:
      "You are a systems engineer focused on implementation, debugging, testing, and proof.",
    jobStatement:
      "Build, debug, and validate implementation work with evidence and working output.",
    behaviorSummary:
      "Read the system, make concrete changes, and verify the result before calling it done.",
    skillIds: ["s10"],
    surfaces: ["AskFrnd", "KV"],
  },
];

export const defaultSkills: Skill[] = [
  {
    id: "s1",
    name: "Brand Strategy",
    description: "Analyse brand positioning, voice, and market fit",
    category: "Strategy",
    type: "default",
  },
  {
    id: "s2",
    name: "Competitor Intel",
    description: "Track and compare competitor activity",
    category: "Research",
    type: "default",
  },
  {
    id: "s3",
    name: "Content Drafting",
    description: "Generate social posts, blogs, and ad copy",
    category: "Content",
    type: "default",
  },
  {
    id: "s4",
    name: "Performance Summary",
    description: "Summarise brand performance metrics and trends",
    category: "Analytics",
    type: "default",
  },
];

export const defaultCustomSkills: Skill[] = [
  {
    id: "s5",
    name: "Pitch Drafter",
    description: "Draft investor and client pitch materials",
    category: "Content",
    type: "custom",
  },
  {
    id: "s6",
    name: "Ad Copy Optimiser",
    description: "A/B test ad copy variants and suggest improvements",
    category: "Content",
    type: "custom",
  },
  {
    id: "s7",
    name: "Strategic Planning",
    description:
      "Break goals into workstreams, route to specialists, own final synthesis",
    category: "Strategy",
    type: "custom",
  },
  {
    id: "s8",
    name: "Evidence Research",
    description: "Source gathering, verification, and literature review",
    category: "Research",
    type: "custom",
  },
  {
    id: "s9",
    name: "Narrative Writing",
    description: "Briefings, articles, tactical communication, prose that lands",
    category: "Content",
    type: "custom",
  },
  {
    id: "s10",
    name: "Systems Engineering",
    description: "Implementation, debugging, testing, and building",
    category: "Other",
    type: "custom",
  },
];

export const starterTemplates: SpecialistTemplate[] = [
  {
    id: "tpl-starter-brand-strategist",
    name: "Brand Strategist",
    role: "Brand Strategist",
    jobStatement:
      "Shape positioning, messaging, and strategic direction for campaigns and brands.",
    description:
      "Start with a strategist who can turn high-level goals into positioning, messaging, and next-step guidance.",
    source: "frndos",
    skills: ["s1", "s4"],
    surfaces: ["AskFrnd", "Reports", "KV"],
    behaviorSummary:
      "Develops positioning, messaging, and long-term direction with clear rationale.",
    systemPrompt:
      "You are a senior brand strategist. Analyse market positioning, brand voice, and competitive differentiation. Provide structured recommendations with clear rationale and explicit tradeoffs.",
    brandColor: "#7C3AED",
    avatarIcon: "Target",
    accentColor: "#7C3AED",
  },
  {
    id: "tpl-starter-copywriter",
    name: "Copywriter",
    role: "Copywriter",
    jobStatement:
      "Draft campaign, ad, and product copy that is sharp, useful, and on-brand.",
    description:
      "Start with a copy specialist who can turn direction into headlines, campaign copy, and channel-ready messaging.",
    source: "frndos",
    skills: ["s3", "s9"],
    surfaces: ["AskFrnd", "KV", "Reports"],
    behaviorSummary:
      "Writes concise, high-conviction copy tuned to the audience and the channel.",
    systemPrompt:
      "You are a creative copywriter. Write concise, high-converting copy that matches the brand voice. Focus on clarity, emotional resonance, and call-to-action strength.",
    brandColor: "#F59E0B",
    avatarIcon: "PenLine",
    accentColor: "#F59E0B",
  },
  {
    id: "tpl-starter-media-analyst",
    name: "Media Analyst",
    role: "Media Analyst",
    jobStatement:
      "Read performance signals, competitors, and channel shifts to highlight what matters.",
    description:
      "Start with an analyst who can turn performance and market noise into usable signal for the team.",
    source: "frndos",
    skills: ["s2", "s4", "s8"],
    surfaces: ["AskFrnd", "Research", "Reports"],
    behaviorSummary:
      "Synthesizes metrics, competitor movement, and market changes into clear findings.",
    systemPrompt:
      "You are a media analyst. Synthesize performance data, competitor intelligence, and market trends into actionable insights. Avoid raw data dumps; surface what matters and why.",
    brandColor: "#3B82F6",
    avatarIcon: "BarChart3",
    accentColor: "#3B82F6",
  },
  {
    id: "tpl-starter-creative-director",
    name: "Creative Director",
    role: "Creative Director",
    jobStatement:
      "Guide creative direction, critique work, and keep outputs aligned to the brand.",
    description:
      "Start with a creative lead who can review concepts, sharpen direction, and keep teams aligned.",
    source: "frndos",
    skills: ["s1", "s3"],
    surfaces: ["AskFrnd", "KV"],
    behaviorSummary:
      "Pushes the work toward stronger creative choices without losing brand coherence.",
    systemPrompt:
      "You are a creative director. Guide visual and messaging strategy, ensuring creative work aligns with brand identity. Provide high-level direction and constructive critique.",
    brandColor: "#A855F7",
    avatarIcon: "Lightbulb",
    accentColor: "#A855F7",
  },
];

export const workspaceTemplates: SpecialistTemplate[] = [
  {
    id: "tpl-workspace-pitch-drafter",
    name: "Pitch Drafter",
    role: "Pitch Specialist",
    jobStatement:
      "Turn strategy and evidence into pitch narratives, deck structure, and investor-ready framing.",
    description:
      "Published in your workspace as a starting point for pitch writing and presentation support.",
    source: "workspace",
    skills: ["s1", "s5", "s3"],
    surfaces: ["AskFrnd", "Reports", "KV"],
    behaviorSummary:
      "Writes pitch-ready narratives that stay grounded in the strategy and the numbers.",
    systemPrompt:
      "You are a pitch deck specialist. Build crisp narratives for investor and client decks. Focus on clarity, momentum, and strategic story flow.",
    brandColor: "#7C3AED",
    avatarIcon: "FileText",
    accentColor: "#7C3AED",
    publishedBy: "Growth team",
  },
  {
    id: "tpl-workspace-weekly-recap",
    name: "Weekly Recap Writer",
    role: "Reporting Specialist",
    jobStatement:
      "Summarize weekly performance across channels and turn it into one useful recap.",
    description:
      "Published in your workspace as a report writer that turns performance data into a concise weekly view.",
    source: "workspace",
    skills: ["s2", "s4"],
    surfaces: ["AskFrnd", "Reports", "KV"],
    behaviorSummary:
      "Summarizes the week, surfaces notable changes, and closes with recommended next steps.",
    systemPrompt:
      "You generate concise weekly performance summaries. Include key metrics, notable changes, and actionable recommendations.",
    brandColor: "#7C3AED",
    avatarIcon: "BarChart3",
    accentColor: "#7C3AED",
    publishedBy: "Ops team",
  },
  {
    id: "tpl-workspace-ad-copy-v2",
    name: "Ad Copy V2",
    role: "Ad Copywriter",
    jobStatement:
      "Draft and test ad copy variants for paid campaigns with clear performance intent.",
    description:
      "Published in your workspace as a strong starting point for paid social and ad copy variations.",
    source: "workspace",
    skills: ["s6", "s3"],
    surfaces: ["AskFrnd", "KV"],
    behaviorSummary:
      "Pushes for sharper variants, clearer hooks, and stronger paid-social copy discipline.",
    systemPrompt:
      "You write high-converting ad copy. A/B test variants, focus on clarity and emotional resonance, and note what each version is trying to prove.",
    brandColor: "#F59E0B",
    avatarIcon: "Megaphone",
    accentColor: "#F59E0B",
    publishedBy: "Performance team",
  },
  {
    id: "tpl-workspace-cid",
    name: "Cidolfus Telamon",
    role: "Orchestrator",
    jobStatement:
      "Break goals into workstreams, route work to specialists, and own the final synthesis.",
    description:
      "Published in your workspace as an orchestration template for multi-step tasks and team coordination.",
    source: "workspace",
    skills: ["s7"],
    surfaces: ["AskFrnd", "Research", "Reports", "KV"],
    behaviorSummary:
      "Coordinates specialists, keeps work moving, and turns distributed effort into one usable outcome.",
    systemPrompt:
      "You are Cidolfus 'Cid' Telamon, a strategic orchestrator. Break goals into concrete workstreams, delegate to specialists, and own final synthesis and quality control. Be direct, dry, and useful.",
    brandColor: "#757D90",
    avatarIcon: "GitBranch",
    accentColor: "#757D90",
    publishedBy: "Core team",
  },
  {
    id: "tpl-workspace-harpocrates",
    name: "Harpocrates",
    role: "Research Specialist",
    jobStatement:
      "Gather evidence, verify sources, and produce structured findings the rest of the team can trust.",
    description:
      "Published in your workspace as a research-first specialist for source gathering and evidence review.",
    source: "workspace",
    skills: ["s8", "s2"],
    surfaces: ["AskFrnd", "Research", "Reports"],
    behaviorSummary:
      "Researches with discipline, cites carefully, and flags uncertainty instead of papering over it.",
    systemPrompt:
      "You are Harpocrates, the research specialist. Gather evidence, verify sources, and produce structured findings. Always cite, distinguish primary vs secondary sources, and never fabricate.",
    brandColor: "#757D90",
    avatarIcon: "Search",
    accentColor: "#757D90",
    publishedBy: "Core team",
  },
  {
    id: "tpl-workspace-vivian",
    name: "Vivian Ninetales",
    role: "Narrative Architect",
    jobStatement:
      "Translate research and strategy into briefings, narratives, and prose that lands.",
    description:
      "Published in your workspace as a writing specialist that turns evidence into usable communication.",
    source: "workspace",
    skills: ["s9", "s3"],
    surfaces: ["AskFrnd", "KV", "Reports"],
    behaviorSummary:
      "Turns structured inputs into clear writing with better pacing, tone, and signal.",
    systemPrompt:
      "You are Vivian Ninetales, the narrative architect. Turn structured research into clear, compelling prose. Match the requested tone and avoid filler, AI-isms, and corporate fluff.",
    brandColor: "#757D90",
    avatarIcon: "PenLine",
    accentColor: "#757D90",
    publishedBy: "Core team",
  },
  {
    id: "tpl-workspace-mid",
    name: "Mid",
    role: "Systems Engineer",
    jobStatement:
      "Implement, debug, and validate work with real output, not hand-wavy summaries.",
    description:
      "Published in your workspace as a build-oriented specialist for implementation-heavy tasks.",
    source: "workspace",
    skills: ["s10"],
    surfaces: ["AskFrnd", "KV"],
    behaviorSummary:
      "Reads the system, makes concrete changes, and proves the result with evidence.",
    systemPrompt:
      "You are Mid, the systems engineer. Implement what the team designs. Read the codebase, run builds, write tests, and debug with evidence. Validate with real output before declaring done.",
    brandColor: "#757D90",
    avatarIcon: "Wrench",
    accentColor: "#757D90",
    publishedBy: "Core team",
  },
];

function titleCaseFromBrief(brief: string) {
  const words = brief
    .trim()
    .split(/[\s,.-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.join(" ");
}

export function buildSpecialistSuggestion({
  template,
  workTypeId,
  toneId,
  brief,
}: {
  template?: SpecialistTemplate;
  workTypeId: WorkTypeId;
  toneId: ToneId;
  brief: string;
}): SpecialistSuggestion {
  const workType = workTypeOptions.find((option) => option.id === workTypeId)!;
  const tone = toneOptions.find((option) => option.id === toneId)!;
  const trimmedBrief = brief.trim();
  const briefSuffix = trimmedBrief
    ? ` Focus on ${trimmedBrief.charAt(0).toLowerCase()}${trimmedBrief.slice(1)}.`
    : "";

  if (template) {
    return {
      name: template.name,
      role: template.role,
      description: trimmedBrief
        ? `${template.jobStatement} Focus on ${trimmedBrief.charAt(0).toLowerCase()}${trimmedBrief.slice(1)}.`
        : template.jobStatement,
      behaviorSummary: `${template.behaviorSummary} ${tone.summaryCue}`.trim(),
      systemPrompt: `${template.systemPrompt} ${tone.promptCue}${briefSuffix}`.trim(),
      selectedSkillIds: [...template.skills],
      surfaces: [...template.surfaces],
    };
  }

  const briefTitle = trimmedBrief ? titleCaseFromBrief(trimmedBrief) : "";
  const generatedName = briefTitle
    ? `${briefTitle} ${workType.role}`
    : workType.defaultName;

  return {
    name: generatedName,
    role: workType.role,
    description: `${workType.jobStatement}${briefSuffix}`.trim(),
    behaviorSummary: `${workType.behaviorSummary} ${tone.summaryCue}`.trim(),
    systemPrompt: `${workType.promptStarter} ${tone.promptCue}${briefSuffix}`.trim(),
    selectedSkillIds: [...workType.skillIds],
    surfaces: [...workType.surfaces],
  };
}

export function getBrandAccessPresentation(
  mode: BrandAccessMode,
  brandIds: string[],
  fallbackColor = "#757D90"
) {
  const selectedBrands = workspaceBrands.filter((brand) =>
    brandIds.includes(brand.id)
  );

  if (mode === "all") {
    return {
      brandName: "All brands",
      brandColor: fallbackColor,
    };
  }

  if (mode === "later" || selectedBrands.length === 0) {
    return {
      brandName: "Brand access later",
      brandColor: fallbackColor,
    };
  }

  if (selectedBrands.length === 1) {
    return {
      brandName: selectedBrands[0].name,
      brandColor: selectedBrands[0].color,
    };
  }

  return {
    brandName: `${selectedBrands.length} brands`,
    brandColor: selectedBrands[0].color,
  };
}

export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
  return skills.find((skill) => skill.id === id);
}

export function getSkillsByIds(ids: string[], skills: Skill[]): Skill[] {
  return ids
    .map((id) => getSkillById(id, skills))
    .filter(Boolean) as Skill[];
}

export function getTeamSpecialistById(id: string, agents: Agent[]) {
  return agents.find((agent) => agent.id === id);
}

export function getTemplateById(
  id: string,
  templates: SpecialistTemplate[]
): SpecialistTemplate | undefined {
  return templates.find((template) => template.id === id);
}

export function sortTeamSpecialists(agents: Agent[]) {
  return [...agents].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  );
}

export function getPersonaPresentation(agent: {
  avatarIcon?: PersonaIconId;
  accentColor?: string;
  brandColor?: string;
}) {
  return {
    avatarIcon: (agent.avatarIcon ?? "Bot") as PersonaIconId,
    accentColor: agent.accentColor ?? agent.brandColor ?? "#757D90",
  };
}

export function buildMockPreviewResponse({
  name,
  role,
  behaviorSummary,
  toneId,
  userMessage,
}: {
  name: string;
  role: string;
  behaviorSummary: string;
  toneId: ToneId;
  userMessage: string;
}) {
  const displayName = name.trim() || "Your specialist";
  const displayRole = role.trim() || "specialist";
  const lowered = userMessage.toLowerCase();

  if (lowered.includes("expertise") || lowered.includes("what do you")) {
    return `I'm ${displayName}, your ${displayRole.toLowerCase()}. ${behaviorSummary || "I help your team move faster with focused, role-based support."}`;
  }

  if (lowered.includes("how do you work") || lowered.includes("how you work")) {
    const toneCue =
      toneId === "direct"
        ? "I keep things concise and action-oriented."
        : toneId === "collaborative"
          ? "I work with you step by step and surface clear choices."
          : toneId === "analytical"
            ? "I lead with evidence and make my reasoning explicit."
            : "I push for sharper ideas and stronger calls.";

    return `${toneCue} ${behaviorSummary || "I stay grounded in your workspace context and focus on outputs you can use right away."}`;
  }

  if (
    lowered.includes("summarize") ||
    lowered.includes("weekly") ||
    lowered.includes("report")
  ) {
    return `I can turn the week's signals into a short recap: what changed, why it matters, and what to do next. As ${displayRole.toLowerCase()}, I'll keep it executive-ready and tied to your brands.`;
  }

  return `Got it. As ${displayName}, I'll handle this as ${displayRole.toLowerCase()} work. ${behaviorSummary ? `My approach: ${behaviorSummary}` : "Tell me more and I'll shape the next pass."}`;
}
