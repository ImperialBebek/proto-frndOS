"use client";

import { useEffect, useRef } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useChat } from "@/context/ChatProvider";
import { groupSwitcherSections } from "@/data/chatStatic";

type ChatQuickSwitcherProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConversation: (id: string | null) => void;
  isNewChatActive: boolean;
  disabled?: boolean;
  children: (props: {
    title: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    ariaExpanded: boolean;
  }) => React.ReactNode;
};

export function ChatQuickSwitcher({
  open,
  onOpenChange,
  onSelectConversation,
  isNewChatActive,
  disabled,
  children,
}: ChatQuickSwitcherProps) {
  const { conversations, activeConversationId } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);

  const { today, older } = groupSwitcherSections(conversations);

  const clearHoverTimer = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    clearHoverTimer();
    onOpenChange(true);
  };

  const handleMouseLeave = () => {
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => onOpenChange(false), 180);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, onOpenChange]);

  return (
    <div
      ref={containerRef}
      className="relative min-w-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children({
        title: "",
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: () => !disabled && onOpenChange(!open),
        ariaExpanded: open,
      })}

      {open && !disabled && (
        <div
          role="listbox"
          aria-label="Quick chat switcher"
          className="absolute left-0 top-full z-50 mt-2 w-[280px] rounded-md border border-line bg-[#1a1a1a] p-3 shadow-[0px_8px_12px_rgba(0,0,0,0.4)] backdrop-blur-default"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SwitcherSection label="Today">
            <SwitcherRow
              label="New chat"
              active={isNewChatActive}
              onSelect={() => {
                onSelectConversation(null);
                onOpenChange(false);
              }}
            />
            {today.map((conv) => (
              <SwitcherRow
                key={conv.id}
                label={conv.title}
                active={conv.id === activeConversationId}
                onSelect={() => {
                  onSelectConversation(conv.id);
                  onOpenChange(false);
                }}
              />
            ))}
          </SwitcherSection>

          {older.length > 0 && (
            <SwitcherSection label="Older" className="mt-4">
              {older.map((conv) => (
                <SwitcherRow
                  key={conv.id}
                  label={conv.title}
                  active={conv.id === activeConversationId}
                  onSelect={() => {
                    onSelectConversation(conv.id);
                    onOpenChange(false);
                  }}
                />
              ))}
            </SwitcherSection>
          )}
        </div>
      )}
    </div>
  );
}

function SwitcherSection({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 px-2 text-xs font-medium text-text-inverse-subtle">
        {label}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SwitcherRow({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onSelect}
      className={`flex h-8 w-full items-center justify-between gap-2 rounded-sm px-2 text-left text-sm tracking-[-0.14px] transition-colors hover:bg-white/[0.06] ${
        active
          ? "bg-white/[0.1] font-medium text-text-inverse"
          : "text-text-inverse"
      }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      {active && (
        <Check size={16} weight="bold" className="shrink-0 text-text-inverse" />
      )}
    </button>
  );
}

export function ChatSwitcherTitleButton({
  title,
  onClick,
  ariaExpanded,
}: {
  title: string;
  onClick: () => void;
  ariaExpanded: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-haspopup="listbox"
      className="flex max-w-full items-center gap-1 rounded-sm px-2 py-1 text-sm font-medium tracking-[-0.14px] text-text-inverse transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <span className="truncate">{title}</span>
      <CaretDown
        size={16}
        className={`shrink-0 text-text-inverse-subtle transition-transform ${
          ariaExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
