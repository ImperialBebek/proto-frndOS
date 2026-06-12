"use client";

import { useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import type { HistoryFilter } from "@/data/chatStatic";
import { useChat } from "@/context/ChatProvider";
import { ChatHistoryView } from "../ChatHistoryView";
import type { HistoryPopupSource } from "./types";

type ChatHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  scopedFilter?: HistoryFilter;
  activeBrandId: string | null;
  activeConversationId?: string | null;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  source: HistoryPopupSource;
};

export function ChatHistoryModal({
  open,
  onClose,
  scopedFilter,
  activeBrandId,
  activeConversationId,
  menuOpen,
  onMenuOpenChange,
  onNewChat,
  onSelectConversation,
}: ChatHistoryModalProps) {
  const { conversations } = useChat();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close chat history"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat history"
        tabIndex={-1}
        className="relative flex max-h-[80vh] w-full max-w-[560px] flex-col overflow-hidden rounded-lg border border-line bg-card-bg shadow-[0_24px_80px_-18px_rgba(0,0,0,0.75)] outline-none backdrop-blur-container"
      >
        <div className="flex shrink-0 items-center justify-end border-b border-line px-2 py-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-rounded text-text-inverse-subtle transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatHistoryView
            variant="modal"
            conversations={conversations}
            scopedFilter={scopedFilter}
            activeBrandId={activeBrandId}
            activeConversationId={activeConversationId}
            menuOpen={menuOpen}
            onMenuOpenChange={onMenuOpenChange}
            onClose={onClose}
            onNewChat={onNewChat}
            onSelectConversation={onSelectConversation}
          />
        </div>
      </div>
    </div>
  );
}
