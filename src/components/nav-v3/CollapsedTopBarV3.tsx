/** PROTOTYPE v3 card top bar — Figma 2614:9352 */

"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { Bell, SidebarSimple } from "@phosphor-icons/react";
import { V3_USER } from "@/data/navV3Static";
import { ShellTopBarV3 } from "./ShellTopBarV3";

type CollapsedTopBarV3Props = {
  sidebarOpen: boolean;
  pageTitle: string;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onHamburgerEnter: () => void;
  onHamburgerLeave: () => void;
};

export const CollapsedTopBarV3 = forwardRef<
  HTMLButtonElement,
  CollapsedTopBarV3Props
>(function CollapsedTopBarV3(
  {
    sidebarOpen,
    pageTitle,
    onNotificationClick,
    onProfileClick,
    onHamburgerEnter,
    onHamburgerLeave,
  },
  hamburgerRef
) {
  return (
    <ShellTopBarV3 variant="content" className="justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {!sidebarOpen && (
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Open navigation"
            onPointerEnter={onHamburgerEnter}
            onPointerLeave={onHamburgerLeave}
            onFocus={onHamburgerEnter}
            onBlur={onHamburgerLeave}
            className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <SidebarSimple size={24} />
          </button>
        )}

        <span className="truncate text-sm font-medium tracking-[-0.14px] text-text-inverse">
          {pageTitle}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          aria-label="Open notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-rounded bg-primary-400 ring-2 ring-card-bg" />
        </button>
        <button
          type="button"
          onClick={onProfileClick}
          className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-rounded ring-1 ring-line transition hover:ring-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          aria-label="Open profile menu"
        >
          <Image
            src={V3_USER.avatarUrl}
            alt=""
            width={20}
            height={20}
            className="size-5 object-cover"
            unoptimized
          />
        </button>
      </div>
    </ShellTopBarV3>
  );
});
