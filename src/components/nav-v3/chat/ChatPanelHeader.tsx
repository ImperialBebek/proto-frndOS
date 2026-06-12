"use client";

import {
  ClockCounterClockwise,
  Plus,
  X,
  DotsThreeVertical,
  PictureInPicture,
  SidebarSimple,
} from "@phosphor-icons/react";
import { ShellTopBarV3 } from "../ShellTopBarV3";
import { ChatIconButton } from "./ChatIconButton";
import {
  ChatQuickSwitcher,
  ChatSwitcherTitleButton,
} from "./ChatQuickSwitcher";

type ChatPanelHeaderProps = {
  title: string;
  isNewChat: boolean;
  isPitchMode: boolean;
  switcherOpen: boolean;
  onSwitcherOpenChange: (open: boolean) => void;
  onSelectConversation: (id: string | null) => void;
  onNewChat: () => void;
  onOpenHistory?: () => void;
  onClose: () => void;
  onMenuToggle: () => void;
  chatMode?: "docked" | "floating";
  onToggleChatMode?: () => void;
  showSwitcher?: boolean;
};

export function ChatPanelHeader({
  title,
  isNewChat,
  isPitchMode,
  switcherOpen,
  onSwitcherOpenChange,
  onSelectConversation,
  onNewChat,
  onOpenHistory,
  onClose,
  onMenuToggle,
  chatMode,
  onToggleChatMode,
  showSwitcher = true,
}: ChatPanelHeaderProps) {
  const displayTitle = isNewChat ? "New chat" : title;

  return (
    <ShellTopBarV3
      variant="chat"
      className="justify-between gap-2 backdrop-blur-shallow"
    >
      <div className="flex min-w-0 flex-1 items-center">
        {showSwitcher && !isPitchMode ? (
          <ChatQuickSwitcher
            open={switcherOpen}
            onOpenChange={onSwitcherOpenChange}
            onSelectConversation={onSelectConversation}
            isNewChatActive={isNewChat}
          >
            {({ onClick, ariaExpanded }) => (
              <ChatSwitcherTitleButton
                title={displayTitle}
                onClick={onClick}
                ariaExpanded={ariaExpanded}
              />
            )}
          </ChatQuickSwitcher>
        ) : (
          <span className="truncate px-2 text-sm font-medium tracking-[-0.16px] text-text-inverse">
            {displayTitle}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onToggleChatMode && (
          <ChatIconButton
            label={
              chatMode === "floating"
                ? "Dock chat panel"
                : "Float chat panel"
            }
            onClick={onToggleChatMode}
          >
            {chatMode === "floating" ? (
              <SidebarSimple size={18} className="rotate-180" />
            ) : (
              <PictureInPicture size={18} />
            )}
          </ChatIconButton>
        )}
        {!isNewChat && !isPitchMode && onOpenHistory && (
          <ChatIconButton label="Chat history" onClick={onOpenHistory}>
            <ClockCounterClockwise size={18} />
          </ChatIconButton>
        )}
        <ChatIconButton label="New chat" onClick={onNewChat}>
          <Plus size={18} />
        </ChatIconButton>
        <ChatIconButton label="Close chat" onClick={onClose}>
          <X size={18} />
        </ChatIconButton>
        {!isPitchMode && !isNewChat && (
          <ChatIconButton label="Chat menu" onClick={onMenuToggle}>
            <DotsThreeVertical size={18} />
          </ChatIconButton>
        )}
      </div>
    </ShellTopBarV3>
  );
}
