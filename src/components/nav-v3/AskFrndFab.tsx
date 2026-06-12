/** PROTOTYPE v3 AskFrnd FAB — Figma Navigation 12446:8068 */

"use client";

import { StarFour } from "@phosphor-icons/react";

type AskFrndFabProps = {
  onClick: () => void;
};

export function AskFrndFab({ onClick }: AskFrndFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask FRnD"
      className="absolute bottom-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-gradient-to-b from-primary-950 via-[#1b66cc] to-[#bde3fb] shadow-[0_0_4px_var(--primary-800,#224eb0)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <StarFour size={20} weight="fill" className="text-white" />
    </button>
  );
}
