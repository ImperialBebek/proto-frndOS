/** PROTOTYPE v3 Ask Frnd chat side panel — Figma Chat section */

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useChat } from "@/context/ChatProvider";
import type { PitchChatScriptMessage } from "@/data/pitchStatic";
import { prefersReducedMotion, v3LayoutMotion } from "@/lib/v3ShellMotion";
import { ChatPanelHeader } from "./chat/ChatPanelHeader";
import { useChatThread } from "./chat/useChatThread";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatComposer } from "./chat/ChatComposer";

const CONTENT_SLIDE = 16;

export type PitchChatContext = {
  key: string;
  stepLabel: string;
  pills: string[];
  script: PitchChatScriptMessage[];
};

type AskFrndChatPanelProps = {
  open: boolean;
  onClose: () => void;
  initialMessage?: string;
  pinnedAgentId?: string;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onClearPinnedAgent?: () => void;
  pitchContext?: PitchChatContext | null;
  chatMode?: "docked" | "floating";
  onToggleChatMode?: () => void;
  onNewChatRequest?: () => void;
  onOpenHistory?: () => void;
  onSelectConversation?: (id: string | null) => void;
};

export function AskFrndChatPanel({
  open,
  onClose,
  initialMessage,
  pinnedAgentId,
  menuOpen,
  onMenuOpenChange,
  onClearPinnedAgent,
  pitchContext = null,
  chatMode,
  onToggleChatMode,
  onNewChatRequest,
  onOpenHistory,
  onSelectConversation,
}: AskFrndChatPanelProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const { setActiveConversationId } = useChat();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const thread = useChatThread({
    open,
    initialMessage,
    pinnedAgentId,
    onClearPinnedAgent,
    pitchContext,
  });

  const isPitchMode = thread.isPitchMode;

  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner) return;

      const reduce = prefersReducedMotion();
      const layoutMotion = v3LayoutMotion(reduce);

      if (reduce) {
        gsap.set(inner, { x: 0, autoAlpha: open ? 1 : 0 });
        return;
      }

      gsap.to(inner, {
        x: open ? 0 : CONTENT_SLIDE,
        autoAlpha: open ? 1 : 0,
        ...layoutMotion,
        overwrite: "auto",
      });
    },
    { dependencies: [open] }
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleNewChat = () => {
    if (isPitchMode) {
      thread.resetPitchThread();
      return;
    }
    onNewChatRequest?.();
    setSwitcherOpen(false);
  };

  const handleSelectConversation = (id: string | null) => {
    if (id === null) {
      handleNewChat();
      return;
    }
    setActiveConversationId(id);
    onSelectConversation?.(id);
    setSwitcherOpen(false);
  };

  return (
    <aside
      role="dialog"
      aria-label="Ask Frnd chat"
      aria-hidden={!open}
      className="flex h-full w-full min-w-0 flex-col overflow-hidden"
    >
      <div
        ref={innerRef}
        className="flex h-full w-full min-w-0 flex-col"
      >
        <ChatPanelHeader
          title={thread.headerTitle}
          isNewChat={thread.isNewChat}
          isPitchMode={isPitchMode}
          switcherOpen={switcherOpen}
          onSwitcherOpenChange={setSwitcherOpen}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onOpenHistory={onOpenHistory}
          onClose={onClose}
          onMenuToggle={() => onMenuOpenChange(!menuOpen)}
          chatMode={chatMode}
          onToggleChatMode={onToggleChatMode}
          showSwitcher={!isPitchMode}
        />

        <ChatMessageList
          messages={thread.messages}
          isResponding={thread.isResponding}
          pitchContext={pitchContext}
          pinnedSpecialist={thread.pinnedSpecialist}
          pinnedPersona={thread.pinnedPersona}
          sortedSpecialists={thread.sortedSpecialists}
          onClearPin={thread.clearPin}
          onPinSpecialist={thread.pinSpecialist}
          onDraftPrefill={(text) => thread.setDraft(text)}
          layout="panel"
        />

        <ChatComposer
          draft={thread.draft}
          setDraft={thread.setDraft}
          showPicker={thread.showPicker}
          setShowPicker={thread.setShowPicker}
          pickerQuery={thread.pickerQuery}
          setPickerQuery={thread.setPickerQuery}
          visibleSpecialists={thread.visibleSpecialists}
          pinnedSpecialist={thread.pinnedSpecialist}
          isResponding={thread.isResponding}
          onSend={thread.handleSend}
          onPinSpecialist={thread.pinSpecialist}
          layout="panel"
        />
      </div>
    </aside>
  );
}
