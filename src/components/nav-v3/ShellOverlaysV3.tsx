"use client";

import {
  ArrowsOutSimple,
  Bell,
  GearSix,
  NotePencil,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react";
import type { ChatDisplayMode } from "./chat/types";
import { V3_USER } from "@/data/navV3Static";

type ShellOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const itemClass =
  "flex w-full items-center gap-2 rounded-xs px-2 py-2 text-left text-sm font-medium tracking-[-0.14px] text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export function NotificationPopoverV3({ open, onClose }: ShellOverlayProps) {
  if (!open) return null;

  const notifications = [
    {
      title: "Design Review starts in 30 minutes",
      body: "Sabrina added a calendar brief to your workspace.",
      time: "Now",
      unread: true,
    },
    {
      title: "Ultra Milk campaign updated",
      body: "New visual directions were added to Studio.",
      time: "12m",
      unread: true,
    },
    {
      title: "OCBC NISP report is ready",
      body: "Weekly performance summary has been generated.",
      time: "1h",
      unread: false,
    },
    {
      title: "Samsung Indonesia brief",
      body: "Three collaborators commented on the pitch draft.",
      time: "2h",
      unread: false,
    },
  ];

  return (
    <div className="absolute right-4 top-[62px] z-40 w-[400px] overflow-hidden rounded-md border border-line bg-[var(--popover-bg)] shadow-[0_24px_80px_-18px_rgba(0,0,0,0.75)] backdrop-blur-container">
      <div className="flex items-center justify-between border-b border-line px-4 py-4">
        <div>
          <p className="text-sm font-medium tracking-[-0.14px] text-text-inverse">
            Notifications
          </p>
          <p className="mt-1 text-xs text-text-inverse-subtlest">
            Recent workspace updates
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xs px-2 py-1 text-xs font-medium text-text-inverse-subtle transition hover:bg-white/[0.06] hover:text-text-inverse"
        >
          Close
        </button>
      </div>
      <div className="max-h-[506px] overflow-y-auto">
        {notifications.map((item) => (
          <button
            key={`${item.title}-${item.time}`}
            type="button"
            className="group flex w-full gap-3 border-b border-line px-4 py-4 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs bg-white/[0.06] text-text-inverse-subtle">
              <Bell size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium tracking-[-0.14px] text-text-inverse">
                  {item.title}
                </span>
                {item.unread && (
                  <span className="mt-1 size-1.5 shrink-0 rounded-rounded bg-primary-400" />
                )}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-text-inverse-subtle">
                {item.body}
              </span>
              <span className="mt-2 block text-xs text-text-inverse-subtlest">
                {item.time}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProfileMenuV3({ open, onClose }: ShellOverlayProps) {
  if (!open) return null;

  return (
    <div className="absolute right-4 top-20 z-40 w-[272px] overflow-hidden rounded-md border border-line bg-[var(--popover-bg)] p-3 shadow-[0_24px_80px_-18px_rgba(0,0,0,0.75)] backdrop-blur-container">
      <div className="mb-3 flex items-center gap-3 border-b border-line px-1 pb-3">
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-rounded bg-[linear-gradient(135deg,#6dbef9,#224893)] text-xs font-semibold text-white ring-1 ring-line">
          {V3_USER.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium tracking-[-0.14px] text-text-inverse">
            {V3_USER.name}
          </span>
          <span className="block truncate text-xs text-text-inverse-subtlest">
            FRND workspace
          </span>
        </span>
      </div>
      <button type="button" className={itemClass} onClick={onClose}>
        <UserCircle size={20} />
        Profile
      </button>
      <button type="button" className={itemClass} onClick={onClose}>
        <NotePencil size={20} />
        Edit workspace
      </button>
      <button type="button" className={itemClass} onClick={onClose}>
        <GearSix size={20} />
        Settings
      </button>
      <button type="button" className={itemClass} onClick={onClose}>
        <SignOut size={20} />
        Sign out
      </button>
    </div>
  );
}

type ChatMenuV3Props = ShellOverlayProps & {
  chatDisplayMode?: ChatDisplayMode;
  onOpenFullscreen?: () => void;
  anchor?: "shell" | "fullscreen";
};

export function ChatMenuV3({
  open,
  onClose,
  chatDisplayMode = "closed",
  onOpenFullscreen,
  anchor = "shell",
}: ChatMenuV3Props) {
  if (!open) return null;

  const positionClass =
    anchor === "fullscreen"
      ? "absolute right-6 top-[62px]"
      : "absolute right-4 top-[62px]";

  return (
    <div
      className={`${positionClass} z-50 w-56 rounded-md border border-line bg-[var(--popover-bg)] p-2 shadow-[0_18px_56px_-18px_rgba(0,0,0,0.75)] backdrop-blur-container`}
    >
      {chatDisplayMode === "docked" && onOpenFullscreen && (
        <button
          type="button"
          className={itemClass}
          onClick={() => {
            onOpenFullscreen();
            onClose();
          }}
        >
          <ArrowsOutSimple size={20} />
          Open in full screen
        </button>
      )}
      <button type="button" className={itemClass} onClick={onClose}>
        <NotePencil size={20} />
        Rename chat
      </button>
      <button type="button" className={itemClass} onClick={onClose}>
        <GearSix size={20} />
        Chat settings
      </button>
    </div>
  );
}
