---
version: alpha
name: frndOS
description: >
  Dark-first design system for frndOS — an AI-powered brand workspace.
  Captured from the Brand Settings, Workspace Settings, Studio, and New
  Navigation Figma files and reconciled with the implemented codebase tokens
  (globals.css / tailwind.config.ts). Token names mirror the CSS custom
  properties used in code.
colors:
  # Canvas & surfaces (dark-first)
  app-bg: "#111111"
  card-bg: "#1a1a1a"
  container-light: "#ffffff"
  container-translucent-subtlest: "#ffffff0d"
  container-translucent-subtle: "#ffffff26"
  container-input: "#ffffff0d"
  container-input-hover: "rgba(255, 255, 255, 0.08)"
  nav-active: "rgba(255, 255, 255, 0.05)"
  nav-hover: "rgba(255, 255, 255, 0.06)"
  popover-bg: "rgba(26, 26, 26, 0.96)"
  shell-overlay: "rgba(0, 0, 0, 0.42)"
  surface-line: "rgba(255, 255, 255, 0.1)"
  # Text on dark surfaces (the default in frndOS)
  text-inverse: "#f6f6f6"
  text-inverse-subtle: "#b0b0b0"
  text-inverse-subtlest: "#888888"
  # Text on light surfaces (white buttons, light cards)
  text-default: "#111111"
  text-subtle: "#5d5d5d"
  text-subtlest: "#888888"
  # Icons on dark surfaces
  icon-inverse: "#f6f6f6"
  icon-inverse-subtle: "#d1d1d1"
  icon-inverse-subtlest: "#888888"
  # Primary (FRnD blue)
  primary-50: "#eff9fe"
  primary-400: "#6dbef9"
  primary-500: "#4e9ef8"
  primary-600: "#3a7ff7"
  primary-700: "#2d67e9"
  primary-800: "#224eb0"
  primary-950: "#172d59"
  # Semantic
  positive-50: "#effcf6"
  positive-500: "#55b88e"
  positive-600: "#419170"
  negative-50: "#fdf1f1"
  negative-500: "#e74136"
  negative-600: "#d6362a"
  warning-50: "#fefcea"
  warning-100: "#fdf8c9"
  warning-500: "#e2b13d"
  warning-600: "#c18a2f"
  warning-900: "#6a401c"
  # Data accents (vibrant 400s for chips and deltas on dark)
  emerald-400: "#34d399"
  yellow-400: "#facc15"
  yellow-500: "#eab308"
  aqua-400: "#22deee"
  red-400: "#f87171"
  # Greys
  grey-50: "#f6f6f6"
  grey-100: "#e7e7e7"
  grey-200: "#d1d1d1"
  grey-950: "#111111"
typography:
  display-md:
    fontFamily: General Sans Variable
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xs:
    fontFamily: General Sans Variable
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  text-xl-medium:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-lg-medium:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-md-medium:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-sm-medium:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-xs-medium:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  text-xs:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0em
rounded:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  full: 1000px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar-width: 200px
  top-bar-height: 72px
components:
  button-primary:
    backgroundColor: "{colors.container-light}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 36px
  button-primary-hover:
    backgroundColor: "{colors.grey-100}"
  button-primary-disabled:
    backgroundColor: "{colors.container-translucent-subtle}"
    textColor: "{colors.text-inverse-subtlest}"
  button-secondary:
    backgroundColor: "{colors.container-translucent-subtlest}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 36px
  button-secondary-hover:
    backgroundColor: "{colors.container-translucent-subtle}"
  button-danger:
    backgroundColor: "rgba(231, 65, 54, 0.12)"
    textColor: "{colors.negative-500}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.icon-inverse-subtle}"
    rounded: "{rounded.full}"
    size: 36px
  button-icon-hover:
    backgroundColor: "{colors.nav-hover}"
    textColor: "{colors.icon-inverse}"
  input:
    backgroundColor: "{colors.container-input}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 40px
  input-hover:
    backgroundColor: "{colors.container-input-hover}"
  command-bar:
    backgroundColor: "{colors.container-input}"
    textColor: "{colors.text-inverse-subtlest}"
    typography: "{typography.text-md}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 48px
  menu-item:
    backgroundColor: "transparent"
    textColor: "{colors.text-inverse-subtle}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.xs}"
    padding: 8px
    height: 40px
  menu-item-hover:
    backgroundColor: "{colors.nav-hover}"
    textColor: "{colors.text-inverse}"
  menu-item-active:
    backgroundColor: "{colors.nav-active}"
    textColor: "{colors.text-inverse}"
  chip:
    backgroundColor: "{colors.container-translucent-subtlest}"
    textColor: "{colors.text-inverse-subtle}"
    typography: "{typography.text-xs-medium}"
    rounded: "{rounded.full}"
    padding: 6px
  status-badge-positive:
    backgroundColor: "{colors.emerald-400}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-xs-medium}"
    rounded: "{rounded.full}"
    padding: 4px
  status-badge-warning:
    backgroundColor: "{colors.yellow-400}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-xs-medium}"
    rounded: "{rounded.full}"
    padding: 4px
  card:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: 16px
  banner-warning:
    backgroundColor: "{colors.warning-900}"
    textColor: "{colors.warning-50}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.sm}"
    padding: 16px
---

# frndOS Design System

## Overview

frndOS is an AI-powered brand workspace ("What would you like to work on?").
The interface reads as a calm, dark operating system: a near-black canvas,
glassy translucent surfaces, and restrained typography. Density is
professional but never cramped — generous vertical rhythm, hairline
separators, and a single bright accent.

Personality traits to preserve:

- **Quietly confident.** The UI chrome recedes; user content (brands,
  campaigns, metrics) and AI moments carry the visual energy.
- **Glassy, not flat.** Layering is communicated with white translucency and
  background blur rather than borders or heavy shadows.
- **AI-forward.** The FRnD blue (`primary-500`, "Resolution Blue" in brand
  language) is reserved for AI entry points (Ask FRnD, greeting headline
  accents) and the single primary action of a screen.

When a rule or token is not explicitly defined, default to: dark surface,
translucent white container, Geist Medium label, pill or 12–16px radius, and
no shadow.

## Colors

The palette is rooted in a near-black canvas with translucent white layering
and one evocative blue accent.

- **App background (#111111):** The universal canvas (`app-bg` /
  `grey-950`). Every screen — navigation shell, settings, Studio — sits on
  this ink.
- **Card background (#1a1a1a):** One tonal step up (`card-bg`) for raised
  panels and popovers (`popover-bg` is its 96%-opacity translucent form).
- **Translucent containers (white at 5–15%):** The workhorse layering system.
  `container-translucent-subtlest` (#ffffff0d) for inputs, chips, and
  secondary buttons; `container-translucent-subtle` (#ffffff26) for hover and
  emphasized states. Combined with background blur these create the glassy
  feel.
- **Text on dark:** `text-inverse` (#f6f6f6) for primary copy,
  `text-inverse-subtle` (#b0b0b0) for supporting copy,
  `text-inverse-subtlest` (#888888) for placeholders and metadata. Icons
  follow the parallel `icon-inverse-*` scale.
- **FRnD blue (primary-500 #4e9ef8):** The sole interactive accent. Used for
  the greeting headline, the Ask FRnD pill, focus rings, and links. Deeper
  steps (600–950) exist for pressed states and light-mode contexts.
- **Semantics:** `positive-500` (#55b88e) for upward deltas and success,
  `negative-500` (#e74136) for errors and the Danger Zone, `warning-*` ambers
  for incomplete-state banners (Studio uses `warning-900` #6a401c as a deep
  amber banner surface).
- **Data accents (emerald/yellow/aqua/red 400s):** Bright fills for metric
  delta chips and status badges on dark. They always carry dark
  (`text-default`) text.

Light mode exists in parts of the product (early Workspace Settings screens
use `grey-50` #f6f6f6 canvas with `text-default` #111111 and `text-subtle`
#5d5d5d), but **dark is normative**: all six reference designs are dark, and
the tokens above are the canonical values.

## Typography

Two typefaces, two jobs:

- **Geist** carries all UI text — navigation, labels, body copy, tables,
  inputs. Sizes run 12px (`text-xs`) to 20px (`text-xl-medium`), line-height
  1.4, with tightening letter-spacing as sizes grow (0 at 12px, -0.01em at
  14–16px, -0.02em at 18–20px).
- **General Sans Variable** is the display voice — the "What would you like
  to work on?" greeting (`display-md`, 40px) and page-level headings
  (`display-xs`, 24px) at line-height 1.2 and -0.015em tracking.

Only two weights are used anywhere in the product chrome: **Regular (400)**
for body and values, **Medium (500)** for labels, headings, and buttons.
Never use bold (700) in UI chrome.

Note: fonts visible inside Brand Identity screens (e.g. Poppins for "Ultra
Milk") are *user brand content* managed by the customer — they are never used
for frndOS product UI.

## Layout

frndOS is an app-shell layout on a fixed dark canvas:

- **Sidebar (200px open, collapsible):** Pinned left, 8px inset from the
  window edge as a floating panel. Sections: logo + collapse control (72px
  header), main menus (Home, Search, Inbox, Playground, Pitch), a Brands
  switcher group, and a Chat history group. Menu items are 32–40px tall on an
  8px rhythm.
- **Top bar (72px, `top-bar-height`):** Breadcrumb / page title on the left,
  notifications and avatar on the right.
- **Bottom dock (brand modules):** Inside a brand context, a slim bottom dock
  carries module tabs (Insights, Studio, Research, Growth) with the **Ask
  FRnD** pill pinned bottom-right.
- **Settings pattern:** A two-column layout — a narrow sub-nav rail
  (grouped with small uppercase-ish section labels like "Brand Core",
  "Resources") and a single content column with field rows. A back arrow +
  page title header sits above both.
- **Content width:** Settings content columns are narrow (~480–560px);
  dashboard content (Studio, Home) runs wider with card grids of 2–4 columns.

Spacing follows a 4px base scale (`xs` 4 → `2xl` 48). Cards use 16–24px
internal padding; sections separate with 32–48px. Related controls group by
proximity inside cards rather than by boxes-within-boxes.

## Elevation & Depth

Depth is communicated through **translucency and blur, not shadow stacks**:

- Layered surfaces use white translucent fills (`container-translucent-*`)
  with background blur — 32px (`blur/container/default`) for major surfaces
  like the command bar and popovers, 16px (`blur/container/shallow`) for
  small chips and controls.
- Hairline separators use `surface-line` (white at 10%) instead of borders.
- A single shadow exists for truly raised elements (dragged cards, floating
  buttons): `0px 4px 8px rgba(0, 0, 0, 0.4)` (Figma `elevation/raised`).
- The scrim for modals and overlays is `shell-overlay` (black at 42%).

If an element needs more hierarchy, step its surface up one tonal layer
(`app-bg` → `card-bg` → translucent white) before reaching for a shadow.

## Shapes

The shape language is **soft and pill-forward**:

- `xs` (8px) for menu-item hover containers and small nested controls.
- `sm` (12px) for inputs, banners, and small cards.
- `md` (16px) for cards, panels, and the command bar.
- `lg` (24px) for large feature surfaces and modal sheets.
- `full` (1000px) — the pill — for every button, chip, badge, search field
  in the top bar, the Ask FRnD control, and the dock.

Corners never mix sharp and rounded in the same view; nothing in frndOS has
a 0px radius except full-bleed imagery inside cards.

## Components

- **Buttons.** `button-primary` is a white pill with dark text — on a dark
  canvas, white *is* the highest-emphasis color. Hover dims to `grey-100`;
  disabled drops to translucent white with muted text. `button-secondary` is
  a translucent pill for supporting actions. `button-danger` (Danger Zone
  "Delete Brand") is a translucent red pill with `negative-500` text.
  `button-icon` is a 36px transparent pill for toolbar icons.
- **Command bar / Ask FRnD.** The signature component: a 48px
  `container-input` field with `rounded.md` corners, placeholder in
  `text-inverse-subtlest`, a leading search icon, and trailing `⌘ K`
  keycaps. Suggestion rows beneath it pair a `text-inverse-subtle` prompt
  with a trailing `chip` naming the destination module (Calendar, Studio).
- **Menu items (sidebar).** 32–40px rows: 20px leading icon slot, Geist
  Medium 14px title, optional trailing slot (shortcut keycaps, badge).
  Resting state is transparent with `text-inverse-subtle`; hover and active
  fill with `nav-hover` / `nav-active` and brighten text to `text-inverse`.
- **Inputs & fields.** Translucent `container-input` fills, `rounded.sm`,
  label above in Geist Medium 14px with helper text in
  `text-inverse-subtlest` 12px. Settings fields stack label-left /
  control-right in wide layouts.
- **Chips & tags.** Pill, translucent fill, 12px Medium text. Used for
  brand-DNA values (audiences, competitors), command-bar destinations, and
  filters.
- **Status badges.** Solid vibrant pills (`emerald-400` positive,
  `yellow-400` warning/monitoring) with dark text — used on brand cards
  (Low / Medium / Monitoring) and metric deltas (+4%, +0.8%).
- **Cards.** `card-bg` surface, `rounded.md`, 16–24px padding. Brand metric
  cards pair a logo + name header row with a `surface-line`-separated metric
  grid (label in `text-inverse-subtlest` 12px above a 20px Medium value).
  Studio project/tool cards lead with media and caption below.
- **Banners.** Inline alert surfaces (`banner-warning`): deep amber fill,
  warning icon, title + supporting line, and right-aligned ghost + solid
  action pair (Dismiss / Fix Now).
- **Tables (Workspace Settings → People).** Dense rows on the dark canvas
  separated by `surface-line`; avatar + name leading, role dropdowns inline,
  metadata in `text-inverse-subtle`. Header row uses 12px Medium
  `text-inverse-subtlest`. Pagination pills and a per-page selector sit in a
  footer row.
- **Segmented controls.** Pill group (Internal Team / Guest Member): active
  segment is a white pill with dark text, inactive segments translucent.
- **Danger Zone.** A clearly separated settings section: `negative-500`
  heading, explanatory line, and `button-danger` — always last on the page.

## Do's and Don'ts

- Do reserve FRnD blue (`primary-500`) for AI moments and at most one
  primary accent per screen; the default high-emphasis button is white.
- Do build layering with translucent white + blur; don't stack drop shadows
  on the dark canvas.
- Do use pills (`rounded.full`) for all interactive chrome — buttons, chips,
  badges, segmented controls.
- Do keep deltas and statuses on the vibrant 400 accents with dark text for
  contrast.
- Don't use font weights other than 400 and 500 in product chrome.
- Don't use user-brand fonts (e.g. Poppins) or colors for frndOS UI — they
  belong only inside brand-content previews.
- Don't use `negative-500` outside errors and destructive actions; the
  Danger Zone pattern is its only settings appearance.
- Don't introduce opaque grey borders; separate with `surface-line`
  hairlines or spacing instead.
- Do maintain WCAG AA contrast: body text on `app-bg` uses `text-inverse`
  or `text-inverse-subtle`; `text-inverse-subtlest` is for metadata and
  placeholders only, never paragraphs.
