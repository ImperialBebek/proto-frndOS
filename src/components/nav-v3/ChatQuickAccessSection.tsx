/** PROTOTYPE v3 sidebar chat quick access — Figma Navigation 12002:4244 */

"use client";

import { Chat, Plus } from "@phosphor-icons/react";
import type { Conversation } from "@/data/chatStatic";

const menuRowBase =
  "flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

type ChatQuickAccessSectionProps = {
  conversations: Conversation[];
  activeConversationId?: string | null;
  onSelect: (id: string) => void;
  onSeeAll: () => void;
  onNewChat: () => void;
};

export function ChatQuickAccessSection({
  conversations,
  activeConversationId,
  onSelect,
  onSeeAll,
  onNewChat,
}: ChatQuickAccessSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
      <div className="group flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-text-inverse-subtle">Chat</p>
        <button
          type="button"
          onClick={onSeeAll}
          className="pointer-events-none text-xs font-medium text-text-inverse-subtlest opacity-0 transition hover:text-text-inverse-subtle group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          See all
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        {conversations.length === 0 ? (
          <p className="px-2 py-1 text-xs text-text-inverse-subtlest">
            No recent chats
          </p>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                aria-current={isActive ? "true" : undefined}
                className={`${menuRowBase} ${
                  isActive
                    ? "bg-[var(--nav-active)] text-text-inverse"
                    : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
                }`}
              >
                <Chat
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                  className="shrink-0"
                />
                <span className="min-w-0 flex-1 truncate text-left">
                  {conv.title}
                </span>
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="flex h-8 w-full min-w-[120px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.05] px-4 py-2 text-xs font-medium text-text-inverse backdrop-blur-shallow transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <Plus size={16} className="shrink-0" />
        New Chat
      </button>
    </div>
  );
}
