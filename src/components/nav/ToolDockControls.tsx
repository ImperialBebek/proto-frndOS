/** PROTOTYPE v2 tool dock — Figma 2537:14233 */

"use client";

import { useState } from "react";
import { TOOL_DOCK_ITEMS, type ToolDockId } from "@/data/navV2Static";
import type { DockVariant } from "./BottomDock";
import { DockHoverChip } from "./DockHoverChip";

export type ToolDockControlsProps = {
  variant: DockVariant;
  activeToolId: ToolDockId;
  onToolChange: (id: ToolDockId) => void;
};

export function ToolDockControls({
  variant,
  activeToolId,
  onToolChange,
}: ToolDockControlsProps) {
  const isFloating = variant === "floating";
  const [hoveredId, setHoveredId] = useState<ToolDockId | null>(null);

  return (
    <>
      {TOOL_DOCK_ITEMS.map((tool) => {
        const isActive = activeToolId === tool.id;
        const Icon = tool.icon;
        const showChip = hoveredId === tool.id;

        return (
          <div
            key={tool.id}
            className="relative"
            onMouseEnter={() => setHoveredId(tool.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {showChip && <DockHoverChip label={tool.label} />}
            <button
              type="button"
              onClick={() => onToolChange(tool.id)}
              aria-pressed={isActive}
              aria-label={tool.label}
              className={`flex shrink-0 items-center justify-center rounded-sm transition-[width,height,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                isFloating ? "size-10" : "size-6"
              } ${tool.tileClass} ${
                isActive && tool.id !== "ask-frnd"
                  ? "ring-2 ring-primary-500 ring-offset-2"
                  : ""
              }`}
            >
              <span className={tool.iconClass}>
                <Icon
                  size={isFloating ? 24 : 16}
                  weight={isActive ? "fill" : "regular"}
                />
              </span>
            </button>
          </div>
        );
      })}
    </>
  );
}
