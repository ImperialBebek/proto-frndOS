/** PROTOTYPE v3 chat conversations — sidebar quick access + global history */

import type { BrandModuleId } from "./navV3Static";
import { DOCK_BRANDS } from "./homeStatic";

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  agentName?: string;
  agentColor?: string;
};

export type ChatScope = "general" | "brand";

export type ChatContext = {
  scope: ChatScope;
  brandId?: string;
  module?: BrandModuleId;
};

export type ChatOwnership = "your" | "shared";

export type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  context: ChatContext;
  messages: ChatMessage[];
  isShared?: boolean;
  pinnedAgentId?: string;
};

export type HistoryFilter = {
  scope?: ChatScope;
  brandId?: string;
  ownership?: ChatOwnership | "all";
  module?: BrandModuleId | "all";
  search?: string;
};

export const CHAT_STORAGE_KEY = "frndos_chat_conversations";
export const CHAT_SEED_VERSION_KEY = "frndos_chat_seed_version";
export const CURRENT_CHAT_SEED_VERSION = "1";

const HOURS_AGO = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

const DAYS_AGO = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

function msg(
  id: string,
  role: "user" | "agent",
  text: string,
  agentName?: string
): ChatMessage {
  return {
    id,
    role,
    text,
    agentName: role === "agent" ? (agentName ?? "FRND") : undefined,
    agentColor: role === "agent" ? "#B8B8B8" : undefined,
  };
}

function seedConversation(
  partial: Omit<Conversation, "messages"> & { messages?: ChatMessage[] }
): Conversation {
  return {
    messages: partial.messages ?? [
      msg(`${partial.id}-u`, "user", "Can you help me with this?"),
      msg(
        `${partial.id}-a`,
        "agent",
        "I can help with that. What would you like to focus on first?"
      ),
    ],
    ...partial,
  };
}

export const SEED_CONVERSATIONS: Conversation[] = [
  seedConversation({
    id: "chat-general-1",
    title: "Financing help",
    updatedAt: HOURS_AGO(2),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-investment",
    title: "Investment opportunities",
    updatedAt: HOURS_AGO(3),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-budget",
    title: "Budget management",
    updatedAt: HOURS_AGO(4),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-cost",
    title: "Cost reduction strategies",
    updatedAt: HOURS_AGO(5),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-2",
    title: "Workspace onboarding checklist",
    updatedAt: DAYS_AGO(2),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-3",
    title: "Q1 planning priorities",
    updatedAt: DAYS_AGO(1),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-4",
    title: "Team specialist recommendations",
    updatedAt: DAYS_AGO(2),
    context: { scope: "general" },
    isShared: true,
  }),
  seedConversation({
    id: "chat-general-5",
    title: "Agency workflow setup",
    updatedAt: DAYS_AGO(3),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-general-6",
    title: "Client reporting templates",
    updatedAt: DAYS_AGO(4),
    context: { scope: "general" },
  }),
  seedConversation({
    id: "chat-ultra-1",
    title: "Introduction to Ultra Milk",
    updatedAt: HOURS_AGO(1),
    context: { scope: "brand", brandId: "ultra-milk", module: "insights" },
  }),
  seedConversation({
    id: "chat-ultra-2",
    title: "Campaign performance summary",
    updatedAt: HOURS_AGO(4),
    context: { scope: "brand", brandId: "ultra-milk", module: "insights" },
    isShared: true,
  }),
  seedConversation({
    id: "chat-ultra-3",
    title: "Studio asset refresh ideas",
    updatedAt: DAYS_AGO(1),
    context: { scope: "brand", brandId: "ultra-milk", module: "studio" },
  }),
  seedConversation({
    id: "chat-ultra-4",
    title: "Balanced Dialogues: Exploring AI Chat Threads",
    updatedAt: DAYS_AGO(1),
    context: { scope: "brand", brandId: "ultra-milk", module: "studio" },
  }),
  seedConversation({
    id: "chat-ultra-5",
    title: "Elevated Conversations: A Deep Dive into AI Chat Threads",
    updatedAt: DAYS_AGO(2),
    context: { scope: "brand", brandId: "ultra-milk", module: "insights" },
  }),
  seedConversation({
    id: "chat-ultra-6",
    title: "Research competitor landscape",
    updatedAt: DAYS_AGO(3),
    context: { scope: "brand", brandId: "ultra-milk", module: "research" },
  }),
  seedConversation({
    id: "chat-aqua-1",
    title: "Aqua Indonesia social listening",
    updatedAt: HOURS_AGO(3),
    context: { scope: "brand", brandId: "aqua", module: "insights" },
  }),
  seedConversation({
    id: "chat-aqua-2",
    title: "Growth funnel optimization",
    updatedAt: DAYS_AGO(1),
    context: { scope: "brand", brandId: "aqua", module: "growth" },
  }),
  seedConversation({
    id: "chat-aqua-3",
    title: "Loyalty program concepts",
    updatedAt: DAYS_AGO(2),
    context: { scope: "brand", brandId: "aqua", module: "loyalty" },
  }),
  seedConversation({
    id: "chat-ocbc-1",
    title: "OCBC campaign brief draft",
    updatedAt: HOURS_AGO(6),
    context: { scope: "brand", brandId: "ocbc", module: "studio" },
  }),
  seedConversation({
    id: "chat-ocbc-2",
    title: "Indonesia President 2026",
    updatedAt: HOURS_AGO(1),
    context: { scope: "brand", brandId: "ocbc", module: "research" },
    isShared: true,
  }),
];

export function createChatContext(
  brandId: string | null,
  module?: BrandModuleId
): ChatContext {
  if (brandId) {
    return { scope: "brand", brandId, module };
  }
  return { scope: "general" };
}

export function deriveTitleFromMessage(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 48) return trimmed;
  return `${trimmed.slice(0, 45)}…`;
}

export function sortConversationsByUpdated(
  conversations: Conversation[]
): Conversation[] {
  return [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function matchesQuickAccess(
  conversation: Conversation,
  brandId: string | null
): boolean {
  if (brandId) {
    return (
      conversation.context.scope === "brand" &&
      conversation.context.brandId === brandId
    );
  }
  return conversation.context.scope === "general";
}

/** Figma 12001:2208 — curated home sidebar chat list */
export const HOME_QUICK_ACCESS_IDS = [
  "chat-ultra-1",
  "chat-general-1",
  "chat-general-investment",
  "chat-general-budget",
  "chat-general-cost",
] as const;

export function getQuickAccessConversations(
  conversations: Conversation[],
  brandId: string | null,
  limit = 5
): Conversation[] {
  if (brandId === null) {
    const byId = new Map(conversations.map((c) => [c.id, c]));
    return HOME_QUICK_ACCESS_IDS.map((id) => byId.get(id)).filter(
      (c): c is Conversation => c !== undefined
    );
  }
  return sortConversationsByUpdated(conversations)
    .filter((c) => matchesQuickAccess(c, brandId))
    .slice(0, limit);
}

export function filterHistoryConversations(
  conversations: Conversation[],
  filter: HistoryFilter
): Conversation[] {
  let result = [...conversations];

  if (filter.scope === "general") {
    result = result.filter((c) => c.context.scope === "general");
  } else if (filter.scope === "brand" && filter.brandId) {
    result = result.filter(
      (c) =>
        c.context.scope === "brand" && c.context.brandId === filter.brandId
    );
  }

  if (filter.ownership === "your") {
    result = result.filter((c) => !c.isShared);
  } else if (filter.ownership === "shared") {
    result = result.filter((c) => c.isShared);
  }

  if (filter.module && filter.module !== "all") {
    result = result.filter((c) => c.context.module === filter.module);
  }

  if (filter.search?.trim()) {
    const q = filter.search.trim().toLowerCase();
    result = result.filter((c) => c.title.toLowerCase().includes(q));
  }

  return sortConversationsByUpdated(result);
}

export type HistorySection =
  | { type: "date"; label: string; conversations: Conversation[] }
  | { type: "module"; label: string; conversations: Conversation[] };

export function groupHistorySections(
  conversations: Conversation[],
  options?: { groupByModule?: boolean }
): HistorySection[] {
  const sorted = sortConversationsByUpdated(conversations);
  const sections: HistorySection[] = [];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const today: Conversation[] = [];
  const older: Conversation[] = [];

  for (const conv of sorted) {
    const d = new Date(conv.updatedAt);
    if (d >= todayStart) {
      today.push(conv);
    } else {
      older.push(conv);
    }
  }

  if (today.length > 0) {
    sections.push({ type: "date", label: "Today", conversations: today });
  }

  if (options?.groupByModule) {
    const byModule = new Map<string, Conversation[]>();
    for (const conv of older) {
      const label =
        conv.context.module ??
        (conv.context.scope === "general" ? "General" : "Other");
      const key = label;
      const list = byModule.get(key) ?? [];
      list.push(conv);
      byModule.set(key, list);
    }
    const moduleOrder: string[] = [
      "insights",
      "studio",
      "research",
      "growth",
      "loyalty",
      "General",
      "Other",
    ];
    const labels = [...byModule.keys()].sort((a, b) => {
      const ai = moduleOrder.indexOf(a);
      const bi = moduleOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    for (const label of labels) {
      const convs = byModule.get(label);
      if (convs?.length) {
        sections.push({
          type: "module",
          label: label.charAt(0).toUpperCase() + label.slice(1),
          conversations: convs,
        });
      }
    }
  } else if (older.length > 0) {
    sections.push({
      type: "date",
      label: "Earlier",
      conversations: older,
    });
  }

  return sections;
}

export function getBrandNameForChat(brandId: string): string {
  return DOCK_BRANDS.find((b) => b.id === brandId)?.name ?? brandId;
}

/** Global recents for the quick chat switcher header dropdown */
export function getSwitcherConversations(
  conversations: Conversation[],
  limit = 8
): Conversation[] {
  return sortConversationsByUpdated(conversations).slice(0, limit);
}

export type SwitcherSections = {
  today: Conversation[];
  older: Conversation[];
};

export function groupSwitcherSections(
  conversations: Conversation[]
): SwitcherSections {
  const sorted = getSwitcherConversations(conversations, 8);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const today: Conversation[] = [];
  const older: Conversation[] = [];

  for (const conv of sorted) {
    const d = new Date(conv.updatedAt);
    if (d >= todayStart) {
      today.push(conv);
    } else {
      older.push(conv);
    }
  }

  return { today, older };
}

export function isNewChatConversation(conv: Conversation | undefined): boolean {
  if (!conv) return true;
  return conv.title === "New Chat" && conv.messages.length === 0;
}
