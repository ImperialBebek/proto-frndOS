/** PROTOTYPE v2 nav — Figma 2537:14183 */

import type { ComponentType } from "react";
import {
  StarFour,
  Tray,
  CardsThree,
  PaintBrush,
} from "@phosphor-icons/react";

export type ToolDockId = "ask-frnd" | "inbox" | "pitch" | "playground";

export type ToolDockItem = {
  id: ToolDockId;
  label: string;
  icon: ComponentType<{ size?: number; weight?: "fill" | "regular" }>;
  /** Figma 2537:14233 — per-tool dock tile */
  tileClass: string;
  iconClass: string;
};

export const TOOL_DOCK_ITEMS: ToolDockItem[] = [
  {
    id: "ask-frnd",
    label: "Ask Frnd",
    icon: StarFour,
    tileClass:
      "bg-gradient-to-b from-primary-950 via-[#1b66cc] to-[#bde3fb] text-white",
    iconClass: "text-white",
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Tray,
    tileClass: "bg-positive-50",
    iconClass: "text-positive-600",
  },
  {
    id: "pitch",
    label: "Pitch",
    icon: CardsThree,
    tileClass: "bg-negative-50",
    iconClass: "text-negative-500",
  },
  {
    id: "playground",
    label: "Playground",
    icon: PaintBrush,
    tileClass: "bg-warning-50",
    iconClass: "text-warning-600",
  },
];

export type NavVariant = "v1" | "v2";

export function parseNavVariant(param: string | null): NavVariant {
  return param === "v2" ? "v2" : "v1";
}
