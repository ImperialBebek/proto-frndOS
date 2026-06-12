"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { PersonaAvatar } from "./PersonaAvatar";
import {
  buildMockPreviewResponse,
  previewTestChips,
  type PersonaIconId,
  type ToneId,
} from "@/data/agentsStatic";

type PreviewMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
};

export function SpecialistPreview({
  name,
  role,
  behaviorSummary,
  toneId,
  avatarIcon,
  accentColor,
  expanded = true,
}: {
  name: string;
  role: string;
  behaviorSummary: string;
  toneId: ToneId;
  avatarIcon: PersonaIconId;
  accentColor: string;
  expanded?: boolean;
}) {
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponding]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isResponding) return;

    const userMessage: PreviewMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsResponding(true);

    window.setTimeout(() => {
      const reply: PreviewMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        text: buildMockPreviewResponse({
          name,
          role,
          behaviorSummary,
          toneId,
          userMessage: trimmed,
        }),
      };
      setMessages((current) => [...current, reply]);
      setIsResponding(false);
    }, 500);
  };

  if (!expanded) return null;

  const displayName = name.trim() || "Your specialist";
  const displayRole = role.trim() || "Specialist";

  return (
    <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-md border border-line bg-white/[0.02]">
      <div
        className="border-b border-line px-5 py-4"
        style={{ backgroundColor: `${accentColor}12` }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
          Preview
        </p>
        <div className="mt-3 flex items-center gap-3">
          <PersonaAvatar icon={avatarIcon} accentColor={accentColor} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-inverse">
              {displayName}
            </p>
            <p className="truncate text-xs text-text-inverse-subtle">
              {displayRole}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center px-4 text-center">
            <p className="text-sm leading-relaxed text-text-inverse-subtle">
              Send a message or try a sample test to see how this specialist
              might respond.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-white text-black"
                      : "bg-white/[0.06] text-text-inverse"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isResponding && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/[0.06] px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
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

      <div className="border-t border-line p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {previewTestChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              disabled={isResponding}
              className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[11px] text-text-inverse-subtle transition hover:border-white/20 hover:text-text-inverse disabled:opacity-40"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="What would you like to do?"
            className="w-full rounded-md border border-line bg-[var(--container-input)] px-4 py-3 pr-10 text-sm text-text-inverse outline-none transition placeholder:text-text-inverse-subtlest focus:border-white/20"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isResponding}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-inverse-subtle transition hover:text-text-inverse disabled:opacity-30"
          >
            <PaperPlaneTilt size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
