/** Shared shell chrome row — Figma 2614:9352; height synced across sidebar, content, chat */

import type { ReactNode } from "react";

export const V3_SHELL_TOP_BAR_HEIGHT_PX = 72;

const paddingByVariant = {
  sidebar: "px-4",
  content: "px-6",
  chat: "px-4",
} as const;

type ShellTopBarV3Props = {
  children: ReactNode;
  variant?: keyof typeof paddingByVariant;
  className?: string;
};

export function ShellTopBarV3({
  children,
  variant = "content",
  className = "",
}: ShellTopBarV3Props) {
  return (
    <header
      className={`flex shrink-0 items-center ${paddingByVariant[variant]} ${className}`.trim()}
      style={{ height: "var(--v3-shell-top-bar-height)" }}
    >
      {children}
    </header>
  );
}
