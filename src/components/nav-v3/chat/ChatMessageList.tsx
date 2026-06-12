"use client";

import { useEffect, useRef } from "react";
import { Robot, X } from "@phosphor-icons/react";
import type { ChatMessage } from "@/data/chatStatic";
import type { Agent } from "@/data/agentsStatic";
import { PersonaAvatar } from "@/components/agents/PersonaAvatar";
import { getPersonaPresentation } from "@/data/agentsStatic";
import type { PitchChatContext } from "../AskFrndChatPanel";

type ChatMessageListProps = {
  messages: ChatMessage[];
  isResponding: boolean;
  pitchContext?: PitchChatContext | null;
  pinnedSpecialist?: Agent;
  pinnedPersona?: ReturnType<typeof getPersonaPresentation>;
  sortedSpecialists: Agent[];
  onClearPin: () => void;
  onPinSpecialist: (id: string) => void;
  onDraftPrefill: (text: string) => void;
  layout?: "panel" | "fullscreen";
};

export function ChatMessageList({
  messages,
  isResponding,
  pitchContext,
  pinnedSpecialist,
  pinnedPersona,
  sortedSpecialists,
  onClearPin,
  onPinSpecialist,
  onDraftPrefill,
  layout = "panel",
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFullscreen = layout === "fullscreen";
  const maxBubble = isFullscreen ? "max-w-[90%]" : "max-w-[90%]";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  return (
    <>
      {pitchContext && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-3 py-2">
          {pitchContext.pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-text-inverse-subtle"
            >
              {pill}
            </span>
          ))}
        </div>
      )}

      {pinnedSpecialist && pinnedPersona && (
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <span
            className="inline-flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: `${pinnedPersona.accentColor}20`,
              color: pinnedPersona.accentColor,
            }}
          >
            <PersonaAvatar
              icon={pinnedPersona.avatarIcon}
              accentColor={pinnedPersona.accentColor}
              size="sm"
              className="!h-4 !w-4 !rounded-full"
            />
            <span className="truncate">{pinnedSpecialist.name}</span>
            <button
              type="button"
              onClick={onClearPin}
              className="rounded-full hover:bg-white/10"
              aria-label="Clear pinned specialist"
            >
              <X size={10} />
            </button>
          </span>
        </div>
      )}

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
          isFullscreen ? "px-0 py-4" : "px-3 py-4"
        }`}
      >
        <div
          className={
            isFullscreen
              ? "mx-auto flex w-full max-w-[800px] flex-1 flex-col"
              : "flex min-h-0 flex-1 flex-col"
          }
        >
          {messages.length === 0 && pitchContext ? (
            <div className="flex min-h-full flex-col items-center justify-center gap-2 px-4 pb-24 text-center">
              <Robot size={20} className="text-text-inverse-subtlest" />
              <p className="text-xs text-text-inverse-subtlest">
                frndOS AI is loading the {pitchContext.stepLabel} context…
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div
              className={`flex min-h-full flex-col justify-center gap-6 text-center ${
                isFullscreen ? "px-4 pb-24" : "px-4 pb-24"
              }`}
            >
              <div>
                <h2
                  className={`font-medium leading-[1.15] tracking-[-0.96px] text-text-inverse ${
                    isFullscreen ? "text-[32px]" : "text-[32px]"
                  }`}
                >
                  Good morning,
                  <br />
                  Sabrina
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-text-inverse-subtle">
                  Anything I can help with?
                </p>
              </div>

              {pinnedSpecialist && pinnedPersona && (
                <div className="mx-auto max-w-full rounded-md border border-line bg-white/[0.02] p-3 text-left">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                    Pinned specialist
                  </p>
                  <button
                    type="button"
                    onClick={onClearPin}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: `${pinnedPersona.accentColor}20`,
                      color: pinnedPersona.accentColor,
                    }}
                  >
                    <PersonaAvatar
                      icon={pinnedPersona.avatarIcon}
                      accentColor={pinnedPersona.accentColor}
                      size="sm"
                      className="!h-4 !w-4 !rounded-full"
                    />
                    <span className="truncate">{pinnedSpecialist.name}</span>
                    <X size={10} />
                  </button>
                </div>
              )}

              {sortedSpecialists.length > 0 && !pinnedSpecialist ? (
                <div className="mx-auto max-w-full text-left">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                    Recently added
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {sortedSpecialists.slice(0, 3).map((specialist) => {
                      const persona = getPersonaPresentation(specialist);
                      return (
                        <button
                          key={specialist.id}
                          type="button"
                          onClick={() => {
                            onPinSpecialist(specialist.id);
                            onDraftPrefill(
                              `Help me work with ${specialist.name} on `
                            );
                          }}
                          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-text-inverse transition hover:border-white/20"
                        >
                          <PersonaAvatar
                            icon={persona.avatarIcon}
                            accentColor={persona.accentColor}
                            size="sm"
                            className="!h-4 !w-4 !rounded-full"
                          />
                          <span className="truncate">{specialist.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${maxBubble} rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/[0.06] text-text-inverse"
                    } ${isFullscreen && message.role === "user" ? "text-sm" : ""}`}
                  >
                    {message.role === "agent" && message.agentName && (
                      <div
                        className="mb-1 flex items-center gap-1 text-[10px] font-medium"
                        style={{ color: message.agentColor ?? "#B8B8B8" }}
                      >
                        <Robot size={10} />
                        {message.agentName}
                      </div>
                    )}
                    <div className="whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}
              {isResponding && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.06] px-3 py-2">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-text-inverse-subtlest">
                      <Robot size={10} />
                      {pinnedSpecialist ? pinnedSpecialist.name : "FRND"}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-text-inverse-subtlest" />
                      <span className="h-1.5 w-1.5 rounded-full bg-text-inverse-subtle" />
                      <span className="h-1.5 w-1.5 rounded-full bg-text-inverse-subtle" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
