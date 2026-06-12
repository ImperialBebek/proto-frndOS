/** PROTOTYPE v3 chat history — in-panel + modal popup */

"use client";

import { useMemo, useState } from "react";
import {
  CaretDown,
  DotsThreeVertical,
  MagnifyingGlass,
  NotePencil,
  ClockCounterClockwise,
  X,
} from "@phosphor-icons/react";
import type { BrandModuleId } from "@/data/navV3Static";
import {
  groupHistorySections,
  type Conversation,
  type HistoryFilter,
} from "@/data/chatStatic";
import { getBrandModuleLabel } from "@/data/navV3Static";
import { useChat } from "@/context/ChatProvider";
import { ShellTopBarV3 } from "./ShellTopBarV3";

const MODULE_OPTIONS: { id: BrandModuleId | "all"; label: string }[] = [
  { id: "all", label: "All modules" },
  { id: "insights", label: "Insights" },
  { id: "studio", label: "Studio" },
  { id: "research", label: "Research" },
  { id: "growth", label: "Growth" },
  { id: "loyalty", label: "Loyalty" },
];

const OWNERSHIP_OPTIONS: { id: HistoryFilter["ownership"]; label: string }[] =
  [
    { id: "all", label: "All chats" },
    { id: "your", label: "Your chat" },
    { id: "shared", label: "Live shared chat" },
  ];

const SECTION_PAGE_SIZE = 4;

type ScopeChip = "context" | "all" | "general" | "brand";

type ChatHistoryViewProps = {
  conversations?: Conversation[];
  scopedFilter?: HistoryFilter;
  activeBrandId?: string | null;
  activeConversationId?: string | null;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  variant?: "panel" | "modal";
};

export function ChatHistoryView({
  conversations: conversationsProp,
  scopedFilter,
  activeBrandId = null,
  activeConversationId,
  menuOpen,
  onMenuOpenChange,
  onClose,
  onNewChat,
  onSelectConversation,
  variant = "panel",
}: ChatHistoryViewProps) {
  const { conversations: contextConversations } = useChat();
  const conversations = conversationsProp ?? contextConversations;

  const isModal = variant === "modal";

  const defaultScopeChip: ScopeChip = scopedFilter?.scope === "brand"
    ? "brand"
    : scopedFilter?.scope === "general"
      ? "general"
      : activeBrandId
        ? "brand"
        : "general";

  const [scopeChip, setScopeChip] = useState<ScopeChip>(
    isModal ? defaultScopeChip : "context"
  );
  const [search, setSearch] = useState("");
  const [ownership, setOwnership] = useState<HistoryFilter["ownership"]>("all");
  const [moduleFilter, setModuleFilter] = useState<BrandModuleId | "all">("all");
  const [ownershipOpen, setOwnershipOpen] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [sectionLimits, setSectionLimits] = useState<Record<string, number>>(
    {}
  );

  const effectiveScopedFilter = useMemo((): HistoryFilter | undefined => {
    if (!isModal || scopeChip === "context") return scopedFilter;
    if (scopeChip === "all") return undefined;
    if (scopeChip === "general") return { scope: "general" };
    if (scopeChip === "brand" && activeBrandId) {
      return { scope: "brand", brandId: activeBrandId };
    }
    return scopedFilter;
  }, [isModal, scopeChip, scopedFilter, activeBrandId]);

  const filtered = useMemo(() => {
    const base: HistoryFilter = {
      ...effectiveScopedFilter,
      search,
      ownership,
      module: moduleFilter,
    };
    let result = [...conversations];

    if (base.scope === "general") {
      result = result.filter((c) => c.context.scope === "general");
    } else if (base.scope === "brand" && base.brandId) {
      result = result.filter(
        (c) =>
          c.context.scope === "brand" && c.context.brandId === base.brandId
      );
    }

    if (ownership === "your") {
      result = result.filter((c) => !c.isShared);
    } else if (ownership === "shared") {
      result = result.filter((c) => c.isShared);
    }

    if (moduleFilter !== "all") {
      result = result.filter((c) => c.context.module === moduleFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [
    conversations,
    effectiveScopedFilter,
    search,
    ownership,
    moduleFilter,
  ]);

  const sections = useMemo(
    () =>
      groupHistorySections(filtered, {
        groupByModule: !effectiveScopedFilter?.scope,
      }),
    [filtered, effectiveScopedFilter?.scope]
  );

  const ownershipLabel =
    OWNERSHIP_OPTIONS.find((o) => o.id === ownership)?.label ?? "Your chat";
  const moduleLabel =
    moduleFilter === "all"
      ? "Your module"
      : getBrandModuleLabel(moduleFilter);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {!isModal && (
        <ShellTopBarV3
          variant="chat"
          className="justify-between gap-2 backdrop-blur-shallow"
        >
          <div className="flex min-w-0 items-center gap-4">
            <HistoryIconButton label="New chat" onClick={onNewChat}>
              <NotePencil size={20} />
            </HistoryIconButton>
            <HistoryIconButton label="Chat history" active>
              <ClockCounterClockwise size={20} />
            </HistoryIconButton>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 truncate text-base font-medium tracking-[-0.16px] text-text-inverse">
            Chat History
          </span>
          <div className="flex shrink-0 items-center gap-4">
            <HistoryIconButton
              label="Chat menu"
              onClick={() => onMenuOpenChange(!menuOpen)}
            >
              <DotsThreeVertical size={20} />
            </HistoryIconButton>
            <HistoryIconButton label="Close chat" onClick={onClose}>
              <X size={20} />
            </HistoryIconButton>
          </div>
        </ShellTopBarV3>
      )}

      {isModal && (
        <div className="shrink-0 border-b border-line px-4 py-3">
          <h2 className="text-base font-medium tracking-[-0.16px] text-text-inverse">
            Chat History
          </h2>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-line p-4">
          <div className="flex h-12 items-center gap-3 rounded-md bg-[var(--container-input)] px-3 backdrop-blur-shallow">
            <MagnifyingGlass
              size={20}
              className="shrink-0 text-text-inverse-subtlest"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.14px] text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none"
              aria-label="Search chats"
            />
          </div>

          {isModal && (
            <div className="mt-3 flex flex-wrap gap-2">
              <ScopeFilterChip
                label="All"
                active={scopeChip === "all"}
                onClick={() => setScopeChip("all")}
              />
              {activeBrandId && (
                <ScopeFilterChip
                  label="This brand"
                  active={scopeChip === "brand"}
                  onClick={() => setScopeChip("brand")}
                />
              )}
              <ScopeFilterChip
                label="General"
                active={scopeChip === "general"}
                onClick={() => setScopeChip("general")}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterChip
              label={ownershipLabel}
              open={ownershipOpen}
              onToggle={() => {
                setOwnershipOpen((o) => !o);
                setModuleOpen(false);
              }}
            >
              {OWNERSHIP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setOwnership(opt.id);
                    setOwnershipOpen(false);
                  }}
                  className={`flex w-full rounded-sm px-3 py-2 text-left text-sm transition hover:bg-white/[0.06] ${
                    ownership === opt.id
                      ? "text-text-inverse"
                      : "text-text-inverse-subtle"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </FilterChip>

            <FilterChip
              label={moduleLabel}
              open={moduleOpen}
              onToggle={() => {
                setModuleOpen((o) => !o);
                setOwnershipOpen(false);
              }}
            >
              {MODULE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setModuleFilter(opt.id);
                    setModuleOpen(false);
                  }}
                  className={`flex w-full rounded-sm px-3 py-2 text-left text-sm transition hover:bg-white/[0.06] ${
                    moduleFilter === opt.id
                      ? "text-text-inverse"
                      : "text-text-inverse-subtle"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </FilterChip>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {sections.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-text-inverse-subtle">
              No chats match your filters.
            </p>
          ) : (
            sections.map((section) => {
              const sectionKey = `${section.type}-${section.label}`;
              const limit =
                sectionLimits[sectionKey] ?? SECTION_PAGE_SIZE;
              const visible = section.conversations.slice(0, limit);
              const hasMore = section.conversations.length > limit;

              return (
                <div
                  key={sectionKey}
                  className="border-b border-line p-4 last:border-b-0"
                >
                  <p className="mb-2 px-2 text-xs font-medium text-text-inverse-subtlest">
                    {section.label}
                  </p>
                  <div className="flex flex-col gap-2">
                    {visible.map((conv) => (
                      <HistoryRow
                        key={conv.id}
                        conversation={conv}
                        active={conv.id === activeConversationId}
                        onSelect={() => onSelectConversation(conv.id)}
                      />
                    ))}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() =>
                          setSectionLimits((prev) => ({
                            ...prev,
                            [sectionKey]: limit + SECTION_PAGE_SIZE,
                          }))
                        }
                        className="flex w-full items-center rounded-sm p-2 text-left text-sm text-text-inverse transition hover:bg-white/[0.03]"
                      >
                        More
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ScopeFilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-full border px-3 text-xs font-medium tracking-[-0.12px] transition ${
        active
          ? "border-white/20 bg-white/[0.1] text-text-inverse"
          : "border-line text-text-inverse-subtle hover:bg-white/[0.04]"
      }`}
    >
      {label}
    </button>
  );
}

function HistoryRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2 rounded-sm p-2 text-left transition hover:bg-white/[0.03] ${
        active ? "bg-white/[0.05]" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm tracking-[-0.14px] text-text-inverse">
          {conversation.title}
        </p>
        {conversation.isShared && (
          <span className="mt-1 inline-flex h-5 items-center rounded-xs bg-white/[0.15] px-1.5 text-xs font-medium text-text-inverse">
            Shared
          </span>
        )}
      </div>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle">
        <DotsThreeVertical size={18} />
      </span>
    </button>
  );
}

function FilterChip({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium tracking-[-0.14px] text-text-inverse transition hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        {label}
        <CaretDown
          size={16}
          className={`text-text-inverse-subtle transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close filter menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={onToggle}
          />
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-md border border-line bg-card-bg p-1 shadow-lg backdrop-blur-default">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function HistoryIconButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className={`flex size-8 items-center justify-center rounded-rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
        active
          ? "text-text-inverse"
          : "text-text-inverse-subtle hover:bg-white/[0.06] hover:text-text-inverse"
      }`}
    >
      {children}
    </button>
  );
}
