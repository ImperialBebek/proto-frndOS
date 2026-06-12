"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";

type JoinBrandModalProps = {
  open: boolean;
  onClose: () => void;
};

export function JoinBrandModal({ open, onClose }: JoinBrandModalProps) {
  const [code, setCode] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setCode("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close join brand"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Join by invite"
        className="relative w-full max-w-[440px] rounded-lg border border-line bg-card-bg p-6 shadow-[0_24px_80px_-18px_rgba(0,0,0,0.75)] backdrop-blur-container"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium tracking-[-0.36px] text-text-inverse">
              Join by invite
            </h2>
            <p className="mt-1 text-sm text-text-inverse-subtle">
              Paste an invite link or enter an invite code from your brand owner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-rounded text-text-inverse-subtle transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={18} />
          </button>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text-inverse">
            Invite link or code
          </span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="https://frnd.os/invite/… or ABC-123"
            className="h-11 rounded-md border border-line bg-white/[0.04] px-4 text-sm text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </label>

        <button
          type="button"
          disabled={!code.trim()}
          className="mt-6 h-11 w-full rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
