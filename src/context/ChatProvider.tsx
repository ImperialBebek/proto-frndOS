"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { BrandModuleId } from "@/data/navV3Static";
import {
  CHAT_SEED_VERSION_KEY,
  CHAT_STORAGE_KEY,
  CURRENT_CHAT_SEED_VERSION,
  SEED_CONVERSATIONS,
  createChatContext,
  deriveTitleFromMessage,
  filterHistoryConversations,
  getQuickAccessConversations,
  sortConversationsByUpdated,
  type ChatContext,
  type ChatMessage,
  type Conversation,
  type HistoryFilter,
} from "@/data/chatStatic";

type ChatContextType = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getConversation: (id: string) => Conversation | undefined;
  getQuickAccess: (brandId: string | null) => Conversation[];
  getFilteredHistory: (filter: HistoryFilter) => Conversation[];
  createConversation: (
    context: ChatContext,
    options?: { pinnedAgentId?: string }
  ) => Conversation;
  appendMessage: (
    conversationId: string,
    message: ChatMessage
  ) => void;
  updateConversation: (
    id: string,
    patch: Partial<Pick<Conversation, "title" | "pinnedAgentId" | "messages">>
  ) => void;
};

const ChatContextValue = createContext<ChatContextType | null>(null);

function persistConversations(conversations: Conversation[]) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return SEED_CONVERSATIONS;

  const seedVersion = localStorage.getItem(CHAT_SEED_VERSION_KEY);
  const stored = localStorage.getItem(CHAT_STORAGE_KEY);

  if (seedVersion !== CURRENT_CHAT_SEED_VERSION || !stored) {
    localStorage.setItem(CHAT_SEED_VERSION_KEY, CURRENT_CHAT_SEED_VERSION);
    persistConversations(SEED_CONVERSATIONS);
    return SEED_CONVERSATIONS;
  }

  try {
    const parsed = JSON.parse(stored) as Conversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return SEED_CONVERSATIONS;
    }
    return parsed;
  } catch {
    return SEED_CONVERSATIONS;
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConversations(loadConversations());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistConversations(conversations);
  }, [conversations, hydrated]);

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const getQuickAccess = useCallback(
    (brandId: string | null) => getQuickAccessConversations(conversations, brandId),
    [conversations]
  );

  const getFilteredHistory = useCallback(
    (filter: HistoryFilter) => filterHistoryConversations(conversations, filter),
    [conversations]
  );

  const createConversation = useCallback(
    (context: ChatContext, options?: { pinnedAgentId?: string }) => {
      const id = `chat-${Date.now()}`;
      const conversation: Conversation = {
        id,
        title: "New Chat",
        updatedAt: new Date().toISOString(),
        context,
        messages: [],
        pinnedAgentId: options?.pinnedAgentId,
      };
      setConversations((prev) => [conversation, ...prev]);
      setActiveConversationId(id);
      return conversation;
    },
    []
  );

  const updateConversation = useCallback(
    (
      id: string,
      patch: Partial<Pick<Conversation, "title" | "pinnedAgentId" | "messages">>
    ) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, ...patch, updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  const appendMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages, message];
          const title =
            c.title === "New Chat" && message.role === "user"
              ? deriveTitleFromMessage(message.text)
              : c.title;
          return {
            ...c,
            messages,
            title,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      setActiveConversationId,
      getConversation,
      getQuickAccess,
      getFilteredHistory,
      createConversation,
      appendMessage,
      updateConversation,
    }),
    [
      conversations,
      activeConversationId,
      getConversation,
      getQuickAccess,
      getFilteredHistory,
      createConversation,
      appendMessage,
      updateConversation,
    ]
  );

  return (
    <ChatContextValue.Provider value={value}>{children}</ChatContextValue.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContextValue);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}

export function useChatContextFromRoute(
  brandId: string | null,
  brandModule?: BrandModuleId
): ChatContext {
  return useMemo(
    () => createChatContext(brandId, brandModule),
    [brandId, brandModule]
  );
}

export { sortConversationsByUpdated };
