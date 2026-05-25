/** PROTOTYPE command bar — Figma 2492:6643 */

"use client";

import { MagnifyingGlass, Command } from "@phosphor-icons/react";

export function CommandBar() {
  return (
    <div className="flex h-12 w-full max-w-[738px] items-center gap-3 rounded-md bg-white/80 px-4 py-2 shadow-command backdrop-blur-container">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MagnifyingGlass
          size={20}
          weight="bold"
          className="shrink-0 text-text-subtle"
          aria-hidden
        />
        <input
          type="text"
          readOnly
          placeholder="Ask FRnD or type a command..."
          aria-label="Ask FRnD or type a command"
          className="min-w-0 flex-1 bg-transparent text-sm text-text-subtle tracking-[-0.14px] placeholder:text-text-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-sm"
        />
      </div>
      <div className="flex shrink-0 items-center gap-2" aria-hidden>
        <kbd className="flex size-6 items-center justify-center rounded-xs border border-black/5 bg-white text-text-subtle">
          <Command size={16} weight="regular" />
        </kbd>
        <kbd className="flex size-6 items-center justify-center rounded-xs border border-black/5 bg-white text-xs font-medium text-text-subtle">
          K
        </kbd>
      </div>
    </div>
  );
}
