/** PROTOTYPE Mock/Real AI toggle — real is only selectable when a key exists. */

"use client";

import { Cpu, Lightning } from "@phosphor-icons/react";
import { useAiMode } from "@/context/AiModeProvider";

export function AiModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, configured, setMode } = useAiMode();
  const isReal = mode === "real";

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.03] p-0.5"
      title={
        configured
          ? "Switch between mock data and live AI"
          : "Live AI unavailable — set OPENCODE_API_KEY to enable"
      }
    >
      <button
        type="button"
        onClick={() => setMode("mock")}
        aria-pressed={!isReal}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
          !isReal
            ? "bg-white/[0.10] text-text-inverse"
            : "text-text-inverse-subtle hover:text-text-inverse"
        }`}
      >
        <Cpu size={12} />
        {compact ? "Mock" : "Mock data"}
      </button>
      <button
        type="button"
        onClick={() => setMode("real")}
        disabled={!configured}
        aria-pressed={isReal}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
          isReal
            ? "bg-sky-500/20 text-sky-200"
            : configured
              ? "text-text-inverse-subtle hover:text-text-inverse"
              : "cursor-not-allowed text-text-inverse-subtlest opacity-50"
        }`}
      >
        <Lightning size={12} weight={isReal ? "fill" : "regular"} />
        {compact ? "Live" : "Live AI"}
      </button>
    </div>
  );
}
