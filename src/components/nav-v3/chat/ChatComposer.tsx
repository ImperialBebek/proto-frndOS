"use client";

import {
  Plus,
  ImagesSquare,
  GlobeSimple,
  Lightbulb,
  PaperPlaneTilt,
  At,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import type { Agent } from "@/data/agentsStatic";
import { PersonaAvatar } from "@/components/agents/PersonaAvatar";
import { getPersonaPresentation } from "@/data/agentsStatic";
import { ChatIconButton } from "./ChatIconButton";

type ChatComposerProps = {
  draft: string;
  setDraft: (value: string) => void;
  showPicker: boolean;
  setShowPicker: (value: boolean | ((prev: boolean) => boolean)) => void;
  pickerQuery: string;
  setPickerQuery: (value: string) => void;
  visibleSpecialists: Agent[];
  pinnedSpecialist?: Agent;
  isResponding: boolean;
  onSend: (prefilledText?: string) => void;
  onPinSpecialist: (id: string) => void;
  layout?: "panel" | "fullscreen";
};

export function ChatComposer({
  draft,
  setDraft,
  showPicker,
  setShowPicker,
  pickerQuery,
  setPickerQuery,
  visibleSpecialists,
  pinnedSpecialist,
  isResponding,
  onSend,
  onPinSpecialist,
  layout = "panel",
}: ChatComposerProps) {
  const isFullscreen = layout === "fullscreen";

  return (
    <div
      className={`relative shrink-0 ${isFullscreen ? "border-t border-line px-0 py-8" : "pb-4 pt-3"}`}
    >
      <div
        className={
          isFullscreen ? "mx-auto w-full max-w-[800px] px-4" : "px-3"
        }
      >
        {showPicker && (
          <div className="absolute bottom-full left-3 right-3 mb-2 max-h-48 overflow-y-auto rounded-md border border-line bg-card-bg p-2 shadow-lg">
            <div className="mb-2 flex items-center gap-2 px-1">
              <MagnifyingGlass
                size={14}
                className="text-text-inverse-subtlest"
              />
              <input
                value={pickerQuery}
                onChange={(event) => setPickerQuery(event.target.value)}
                placeholder="Search team..."
                className="flex-1 bg-transparent text-xs text-text-inverse outline-none placeholder:text-text-inverse-subtlest"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowPicker(false);
                  setPickerQuery("");
                }}
                className="rounded p-1 text-text-inverse-subtlest hover:text-text-inverse"
                aria-label="Close picker"
              >
                <X size={12} />
              </button>
            </div>
            {visibleSpecialists.map((specialist) => {
              const persona = getPersonaPresentation(specialist);
              return (
                <button
                  key={specialist.id}
                  type="button"
                  onClick={() => onPinSpecialist(specialist.id)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition hover:bg-white/[0.06]"
                >
                  <PersonaAvatar
                    icon={persona.avatarIcon}
                    accentColor={persona.accentColor}
                    size="sm"
                    className="!h-7 !w-7"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-text-inverse">
                      {specialist.name}
                    </p>
                    <p className="truncate text-[10px] text-text-inverse-subtlest">
                      {specialist.role}
                    </p>
                  </div>
                </button>
              );
            })}
            {visibleSpecialists.length === 0 && (
              <p className="px-2 py-1 text-[11px] text-text-inverse-subtlest">
                No specialists match.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col rounded-md bg-[var(--container-input)] backdrop-blur-shallow">
          <input
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (e.target.value.includes("@")) {
                setShowPicker(true);
                setPickerQuery(e.target.value.split("@")[1] || "");
              } else if (!showPicker) {
                setPickerQuery("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              pinnedSpecialist
                ? `Message ${pinnedSpecialist.name}...`
                : "What do you want to ask..."
            }
            aria-label="Ask anything"
            className="h-12 w-full bg-transparent px-4 text-sm tracking-[-0.14px] text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none"
          />
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <ChatIconButton label="Add">
                <Plus size={16} />
              </ChatIconButton>
              <ChatIconButton
                label="Mention specialist"
                onClick={() => setShowPicker((current) => !current)}
              >
                <At size={16} />
              </ChatIconButton>
              <ChatIconButton label="Attach image">
                <ImagesSquare size={16} />
              </ChatIconButton>
              <ChatIconButton label="Web search">
                <GlobeSimple size={16} />
              </ChatIconButton>
              <ChatIconButton label="Suggestions">
                <Lightbulb size={16} />
              </ChatIconButton>
            </div>
            <button
              type="button"
              aria-label="Send"
              disabled={!draft.trim() || isResponding}
              onClick={() => onSend()}
              className="flex size-8 items-center justify-center rounded-rounded bg-white/[0.08] text-text-inverse-subtle transition-colors hover:bg-white/[0.12] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-30"
            >
              <PaperPlaneTilt size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
