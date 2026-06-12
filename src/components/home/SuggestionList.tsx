/** PROTOTYPE suggestions — Figma 2492:6650 */

"use client";

import { ChatCircle } from "@phosphor-icons/react";
import { SUGGESTIONS } from "@/data/homeStatic";

export function SuggestionList() {
  return (
    <ul className="flex w-full max-w-[738px] flex-col gap-4 px-4">
      {SUGGESTIONS.map((suggestion) => (
        <li key={suggestion.text}>
          <button
            type="button"
            className="group flex w-full items-center justify-between gap-4 rounded-sm text-left transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span className="flex min-w-0 items-center gap-3">
              <ChatCircle
                size={20}
                className="shrink-0 text-text-subtle group-hover:text-text-default"
                aria-hidden
              />
              <span className="text-base tracking-[-0.16px] text-text-default">
                {suggestion.text}
              </span>
            </span>
            <span className="shrink-0 rounded-xs bg-[var(--container-translucent-subtle)] px-1.5 py-0.5 text-xs font-medium text-text-inverse backdrop-blur-[8px]">
              {suggestion.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
