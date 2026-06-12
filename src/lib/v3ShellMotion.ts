/** Shared motion tokens for nav v3 shell (sidebar, chat, content card). */

export const V3_GUTTER = 8;
/** Figma 12001:2208 — sidebar column width */
export const V3_SIDEBAR_WIDTH = 200;
export const V3_SIDEBAR_DOCK_WIDTH = V3_SIDEBAR_WIDTH;
export const V3_OUTER_SHELL_INSET = 8;
export const V3_OUTER_SHELL_RADIUS = 32;
export const V3_FLOATING_SIDEBAR_WIDTH = 231;
export const V3_CARD_RADIUS = 16;
/** Flush with app canvas when shell is edge-to-edge */
export const V3_CONTENT_BG_FLUSH = "#111111";
/** Elevated content card when sidebar or chat gutter is visible */
export const V3_CONTENT_BG_ELEVATED = "#1a1a1a";
export const V3_CHAT_MAX_WIDTH = 346;
export const V3_CHAT_MIN_WIDTH = 280;
/** Gap from content card right edge to chat composer outer edge */
export const V3_CHAT_CARD_GAP = 16;
/** Gap from chat composer outer edge to viewport right edge */
export const V3_CHAT_COMPOSER_INSET = 16;

/** Shell layout — card inset, color, radius, sidebar/chat dock (smooth + synchronized) */
export const V3_LAYOUT_DURATION = 0.34;
export const V3_LAYOUT_EASE = "power2.inOut";

/** Overlay panels — slightly snappier than shell layout */
export const V3_DURATION_IN = 0.26;
export const V3_DURATION_OUT = 0.22;
export const V3_EASE_IN = "power2.out";
export const V3_EASE_OUT = "power2.inOut";

export const V3_FLOAT_DURATION_IN = 0.28;
export const V3_FLOAT_DURATION_OUT = 0.2;
export const V3_FLOAT_EASE_IN = "power2.out";
export const V3_FLOAT_EASE_OUT = "power2.in";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getChatPanelWidth(): number {
  if (typeof window === "undefined") return V3_CHAT_MAX_WIDTH;
  return Math.max(
    V3_CHAT_MIN_WIDTH,
    Math.min(V3_CHAT_MAX_WIDTH, window.innerWidth - 720)
  );
}

export type ShellPadding = {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
};

/** Asymmetric gutter — driven by which panel is docked (never pitch floating chat). */
export function getShellPadding(
  sidebarOpen: boolean,
  dockedChatOpen: boolean
): ShellPadding {
  if (dockedChatOpen) {
    return {
      paddingTop: V3_GUTTER,
      paddingBottom: V3_GUTTER,
      paddingLeft: 0,
      paddingRight: V3_CHAT_COMPOSER_INSET,
    };
  }
  if (sidebarOpen) {
    return {
      paddingTop: V3_GUTTER,
      paddingBottom: V3_GUTTER,
      paddingLeft: V3_GUTTER,
      paddingRight: 0,
    };
  }
  return {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };
}

export function getContentCardBackground(shellFloating: boolean): string {
  return shellFloating ? V3_CONTENT_BG_ELEVATED : V3_CONTENT_BG_FLUSH;
}

export function v3LayoutMotion(
  reduce = prefersReducedMotion()
): { duration: number; ease: string } {
  if (reduce) {
    return { duration: 0, ease: "none" };
  }
  return { duration: V3_LAYOUT_DURATION, ease: V3_LAYOUT_EASE };
}

export function v3MotionTiming(
  opening: boolean,
  reduce = prefersReducedMotion()
): { duration: number; ease: string } {
  if (reduce) {
    return { duration: 0, ease: "none" };
  }
  return opening
    ? { duration: V3_DURATION_IN, ease: V3_EASE_IN }
    : { duration: V3_DURATION_OUT, ease: V3_EASE_OUT };
}

export function v3FloatTiming(
  opening: boolean,
  reduce = prefersReducedMotion()
): { duration: number; ease: string } {
  if (reduce) {
    return { duration: 0, ease: "none" };
  }
  return opening
    ? { duration: V3_FLOAT_DURATION_IN, ease: V3_FLOAT_EASE_IN }
    : { duration: V3_FLOAT_DURATION_OUT, ease: V3_FLOAT_EASE_OUT };
}
