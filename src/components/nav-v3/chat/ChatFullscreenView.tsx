"use client";

import { useState } from "react";
import {
  ClockCounterClockwise,
  Plus,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { ShellTopBarV3 } from "../ShellTopBarV3";
import { ChatIconButton } from "./ChatIconButton";
import {
  ChatQuickSwitcher,
  ChatSwitcherTitleButton,
} from "./ChatQuickSwitcher";
import { useChatThread } from "./useChatThread";
import { ChatMessageList } from "./ChatMessageList";
import { ChatComposer } from "./ChatComposer";

type ChatFullscreenViewProps = {
  open: boolean;
  initialMessage?: string;
  pinnedAgentId?: string;
  onClearPinnedAgent?: () => void;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onNewChatRequest: () => void;
  onOpenHistory: () => void;
  onSelectConversation: (id: string | null) => void;
  pageTitle?: string;
};

export function ChatFullscreenView({
  open,
  initialMessage,
  pinnedAgentId,
  onClearPinnedAgent,
  menuOpen,
  onMenuOpenChange,
  onNewChatRequest,
  onOpenHistory,
  onSelectConversation,
}: ChatFullscreenViewProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const thread = useChatThread({
    open,
    initialMessage,
    pinnedAgentId,
    onClearPinnedAgent,
    pitchContext: null,
  });

  const handleNewChat = () => {
    onNewChatRequest();
    setSwitcherOpen(false);
  };

  const handleSelect = (id: string | null) => {
    if (id === null) {
      onNewChatRequest();
    } else {
      onSelectConversation(id);
    }
  };

  if (!open) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ShellTopBarV3
        variant="content"
        className="justify-between gap-4 border-b border-line backdrop-blur-shallow"
      >
        <div className="flex min-w-0 flex-1 items-center">
          <ChatQuickSwitcher
            open={switcherOpen}
            onOpenChange={setSwitcherOpen}
            onSelectConversation={handleSelect}
            isNewChatActive={thread.isNewChat}
          >
            {({ onClick, ariaExpanded }) => (
              <ChatSwitcherTitleButton
                title={thread.isNewChat ? "New chat" : thread.headerTitle}
                onClick={onClick}
                ariaExpanded={ariaExpanded}
              />
            )}
          </ChatQuickSwitcher>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <ChatIconButton label="New chat" onClick={handleNewChat}>
            <Plus size={18} />
          </ChatIconButton>
          <ChatIconButton label="Chat history" onClick={onOpenHistory}>
            <ClockCounterClockwise size={18} />
          </ChatIconButton>
          <ChatIconButton
            label="Chat menu"
            onClick={() => onMenuOpenChange(!menuOpen)}
          >
            <DotsThreeVertical size={18} />
          </ChatIconButton>
        </div>
      </ShellTopBarV3>

      <ChatMessageList
        messages={thread.messages}
        isResponding={thread.isResponding}
        pinnedSpecialist={thread.pinnedSpecialist}
        pinnedPersona={thread.pinnedPersona}
        sortedSpecialists={thread.sortedSpecialists}
        onClearPin={thread.clearPin}
        onPinSpecialist={thread.pinSpecialist}
        onDraftPrefill={(text) => thread.setDraft(text)}
        layout="fullscreen"
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
        layout="fullscreen"
      />
    </div>
  );
}
