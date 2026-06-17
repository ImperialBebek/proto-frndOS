---
version: alpha
name: frndOS
description: >
  Dark-first design system for frndOS — an AI-powered brand workspace.
  Canonical source: FRnD OS Figma libraries (Foundations, Typography, Components).
  Token names align with Figma variables where exposed; CSS custom properties in
  globals.css / tailwind.config.ts are noted where code lags Figma.
colors:
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
  stroke-default: "rgba(255, 255, 255, 0.1)"
  text-inverse: "#f6f6f6"
  text-inverse-subtle: "#b0b0b0"
  text-inverse-subtlest: "#888888"
  text-default: "#111111"
  text-subtle: "#5d5d5d"
  text-subtlest: "#888888"
  icon-inverse: "#f6f6f6"
  icon-inverse-subtle: "#d1d1d1"
  icon-inverse-subtlest: "#888888"
  primary: "#3a7ff7"
  surface-translucent-subtlest-on-app: "#1d1d1d"
  surface-translucent-subtle-on-app: "#353535"
  surface-input-on-app: "#1d1d1d"
  surface-nav-hover-on-app: "#1f1f1f"
  surface-nav-active-on-app: "#1d1d1d"
  surface-negative-subtle-on-app: "#2b1716"
  primary-50: "#eff9fe"
  primary-400: "#6dbef9"
  primary-500: "#4e9ef8"
  primary-600: "#3a7ff7"
  primary-700: "#2d67e9"
  primary-800: "#224eb0"
  primary-950: "#172d59"
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
  emerald-400: "#34d399"
  yellow-400: "#facc15"
  yellow-500: "#eab308"
  aqua-400: "#22deee"
  red-400: "#f87171"
  grey-50: "#f6f6f6"
  grey-100: "#e7e7e7"
  grey-200: "#d1d1d1"
  grey-950: "#111111"
typography:
  display-2xl:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-2xl-medium:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-2xl-bold:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xl:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xl-medium:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xl-bold:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-lg-medium:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-lg-bold:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-md:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-md-medium:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-md-bold:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-sm:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-sm-medium:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-sm-bold:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xs:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xs-medium:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
  display-xs-bold:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  text-xl:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-xl-medium:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-xl-bold:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-lg-medium:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-lg-bold:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.02em
  text-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-md-medium:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-md-bold:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-sm-medium:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-sm-bold:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.01em
  text-xs:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0em
  text-xs-medium:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  text-xs-bold:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 700
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
  avatar-initial-xs:
    backgroundColor: "{colors.yellow-500}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    size: 32px
  avatar-initial-sm:
    backgroundColor: "{colors.yellow-500}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-md-medium}"
    rounded: "{rounded.full}"
    size: 40px
  avatar-initial-md:
    backgroundColor: "{colors.yellow-500}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-xl-medium}"
    rounded: "{rounded.full}"
    size: 48px
  avatar-initial-lg:
    backgroundColor: "{colors.yellow-500}"
    textColor: "{colors.text-default}"
    typography: "{typography.display-xs-medium}"
    rounded: "{rounded.full}"
    size: 56px
  avatar-initial-xl:
    backgroundColor: "{colors.yellow-500}"
    textColor: "{colors.text-default}"
    typography: "{typography.display-sm-medium}"
    rounded: "{rounded.full}"
    size: 64px
  chip:
    backgroundColor: "{colors.surface-translucent-subtlest-on-app}"
    textColor: "{colors.text-inverse-subtle}"
    typography: "{typography.text-xs-medium}"
    rounded: "{rounded.full}"
    padding: 6px
  tab-rounded-active:
    backgroundColor: "{colors.container-light}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 8px
  tab-rounded-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.text-inverse-subtle}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 8px
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
    backgroundColor: "{colors.surface-translucent-subtle-on-app}"
    textColor: "{colors.text-inverse-subtle}"
  button-secondary:
    backgroundColor: "{colors.surface-translucent-subtlest-on-app}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
    height: 36px
  button-secondary-hover:
    backgroundColor: "{colors.container-translucent-subtle}"
  button-danger:
    backgroundColor: "{colors.surface-negative-subtle-on-app}"
    textColor: "{colors.red-400}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.icon-inverse-subtle}"
    rounded: "{rounded.full}"
    size: 36px
  button-icon-hover:
    backgroundColor: "{colors.surface-nav-hover-on-app}"
    textColor: "{colors.icon-inverse}"
  input:
    backgroundColor: "{colors.surface-input-on-app}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.text-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 40px
  input-hover:
    backgroundColor: "{colors.container-input-hover}"
  command-bar:
    backgroundColor: "{colors.surface-input-on-app}"
    textColor: "{colors.text-inverse-subtle}"
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
    backgroundColor: "{colors.surface-nav-hover-on-app}"
    textColor: "{colors.text-inverse}"
  menu-item-active:
    backgroundColor: "{colors.surface-nav-active-on-app}"
    textColor: "{colors.text-inverse}"
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
  page-canvas:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.text-inverse}"
  page-canvas-alt:
    backgroundColor: "{colors.grey-950}"
    textColor: "{colors.text-inverse}"
  popover:
    backgroundColor: "{colors.popover-bg}"
    textColor: "{colors.text-inverse}"
  modal-scrim:
    backgroundColor: "{colors.shell-overlay}"
  divider:
    backgroundColor: "{colors.surface-line}"
  divider-stroke:
    backgroundColor: "{colors.stroke-default}"
  link-primary:
    textColor: "{colors.primary}"
    typography: "{typography.text-sm-medium}"
  link-accent-500:
    textColor: "{colors.primary-500}"
    typography: "{typography.text-sm-medium}"
  link-primary-hover:
    textColor: "{colors.primary-600}"
    typography: "{typography.text-sm-medium}"
  link-primary-pressed:
    textColor: "{colors.primary-700}"
    typography: "{typography.text-sm-medium}"
  focus-ring:
    backgroundColor: "{colors.primary-400}"
  ask-frnd-pill:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.text-default}"
    typography: "{typography.text-sm-medium}"
    rounded: "{rounded.full}"
    padding: 12px
  ai-surface-tint:
    backgroundColor: "{colors.primary-50}"
    textColor: "{colors.primary-800}"
  ai-surface-deep:
    backgroundColor: "{colors.primary-950}"
    textColor: "{colors.text-inverse}"
  light-canvas:
    backgroundColor: "{colors.grey-50}"
    textColor: "{colors.text-default}"
  body-on-light-subtle:
    backgroundColor: "{colors.grey-50}"
    textColor: "{colors.text-subtle}"
  body-on-light-subtlest:
    backgroundColor: "{colors.grey-200}"
    textColor: "{colors.text-default}"
  placeholder-text:
    backgroundColor: "{colors.surface-input-on-app}"
    textColor: "{colors.text-inverse-subtlest}"
  impl-container-translucent-subtlest:
    backgroundColor: "{colors.container-translucent-subtlest}"
  impl-container-input:
    backgroundColor: "{colors.container-input}"
  impl-nav-hover:
    backgroundColor: "{colors.nav-hover}"
  impl-nav-active:
    backgroundColor: "{colors.nav-active}"
  icon-button-resting:
    backgroundColor: "transparent"
    textColor: "{colors.icon-inverse-subtlest}"
  status-positive-bg:
    backgroundColor: "{colors.positive-50}"
    textColor: "{colors.text-default}"
  status-positive-emphasis:
    backgroundColor: "{colors.positive-500}"
    textColor: "{colors.text-default}"
  status-negative-bg:
    backgroundColor: "{colors.negative-50}"
    textColor: "{colors.text-default}"
  status-warning-bg:
    backgroundColor: "{colors.warning-100}"
    textColor: "{colors.text-default}"
  status-warning-emphasis:
    backgroundColor: "{colors.warning-500}"
    textColor: "{colors.text-default}"
  delta-aqua:
    backgroundColor: "{colors.aqua-400}"
    textColor: "{colors.text-default}"
  delta-red:
    backgroundColor: "{colors.red-400}"
    textColor: "{colors.text-default}"
  metadata-on-light:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.text-subtlest}"
  status-positive-label:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.positive-600}"
  danger-zone-heading:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.negative-500}"
  danger-zone-body:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.negative-500}"
  impl-negative-600:
    backgroundColor: "{colors.negative-600}"
  warning-label:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.warning-600}"
---

# frndOS Design System

## Overview

frndOS is an AI-powered brand workspace ("What would you like to work on?").
The interface reads as a calm, dark operating system: a near-black canvas,
glassy translucent surfaces, and restrained Geist typography. Density is
professional but never cramped — generous vertical rhythm, hairline
separators, and a single bright accent.

Personality traits to preserve:

- **Quietly confident.** The UI chrome recedes; user content (brands,
  campaigns, metrics) and AI moments carry the visual energy.
- **Glassy, not flat.** Layering is communicated with white translucency and
  background blur rather than borders or heavy shadows.
- **AI-forward.** The FRnD blue (`primary` / `primary-600`, "Resolution Blue" in brand
  language) is reserved for AI entry points (Ask FRnD, greeting headline
  accents) and the single primary action of a screen.

When a rule or token is not explicitly defined, default to: dark surface,
translucent white container, Geist Medium label, pill or 12–16px radius, and
no shadow.

**Figma sources (canonical):**

- Foundations — colors, spacing, radius, elevation, blur
- Typography (FRnD OS) — Geist display and text scales
- Components (FRnD OS) — avatars, chips, tabs, buttons, inputs, and more

**Code drift (needs verification / follow-up):**

- `globals.css` and `tailwind.config.ts` do not yet expose the full Figma
  typography scale or avatar primitives.
- Foundations color/spacing/effects were not fully exposed via the provided
  Foundations URL node; values here use Figma variable names where discovered
  and existing code tokens as baseline. Re-verify when a node-specific
  Foundations URL is available.
- Prior docs referenced General Sans Variable for display; Figma Typography
  now uses Geist for both display and text.

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
  feel. In CSS, use the translucent tokens; in component YAML, use the
  matching `surface-*-on-app` tokens (solid colors composited over `app-bg`)
  so accessibility checks reflect real dark-canvas appearance.
- **Text on dark:** `text-inverse` (#f6f6f6) for primary copy,
  `text-inverse-subtle` (#b0b0b0) for supporting copy,
  `text-inverse-subtlest` (#888888) for placeholders and metadata. Icons
  follow the parallel `icon-inverse-*` scale.
- **Text on light:** `text-default` (#111111) on white pills, badges, and
  avatar initials. `text-subtle` (#5d5d5d) for secondary copy on light
  surfaces.
- **Strokes:** `stroke-default` / `surface-line` (white at 10%) for hairline
  dividers — never opaque grey borders.
- **FRnD blue (`primary` / `primary-600` #3a7ff7):** The canonical semantic
  accent from Figma Foundations. Used for the Ask FRnD pill, focus rings, and
  links. Lighter steps (`primary-400`, `primary-500`) suit hover and highlights;
  deeper steps (`primary-700`–`primary-950`) exist for pressed states and
  light-mode contexts.
- **Semantics:** `positive-500` (#55b88e) for upward deltas and success,
  `negative-500` (#e74136) for errors and the Danger Zone, `warning-*` ambers
  for incomplete-state banners (Studio uses `warning-900` #6a401c as a deep
  amber banner surface).
- **Data accents (emerald/yellow/aqua/red 400s):** Bright fills for metric
  delta chips and status badges on dark. They always carry dark
  (`text-default`) text.

Light mode exists in parts of the product (early Workspace Settings screens
use `grey-50` #f6f6f6 canvas with `text-default` #111111 and `text-subtle`
#5d5d5d), but **dark is normative**: reference designs are dark-first, and
the tokens above are the canonical values.

## Typography

**Geist** is the sole product typeface — both display and UI text. The Figma
Typography library defines two scales:

### Display scale (line-height 1.2, letter-spacing -0.015em)

| Token | Size | Weights |
|-------|------|---------|
| `display-2xl` | 72px | Regular, Medium, Bold |
| `display-xl` | 64px | Regular, Medium, Bold |
| `display-lg` | 48px | Regular, Medium, Bold |
| `display-md` | 40px | Regular, Medium, Bold |
| `display-sm` | 32px | Regular, Medium, Bold |
| `display-xs` | 24px | Regular, Medium, Bold |

Use for page titles, greeting headlines ("What would you like to work on?"),
and hero moments. Default to **Medium (500)** for headings.

### Text scale (line-height 1.4)

| Token | Size | Letter-spacing | Weights |
|-------|------|----------------|---------|
| `text-xl` | 20px | -0.02em | Regular, Medium, Bold |
| `text-lg` | 18px | -0.02em | Regular, Medium, Bold |
| `text-md` | 16px | -0.01em | Regular, Medium, Bold |
| `text-sm` | 14px | -0.01em | Regular, Medium, Bold |
| `text-xs` | 12px | 0 | Regular, Medium, Bold |

Use for navigation, labels, body copy, tables, inputs, and metadata.

### Weight policy

- **Product chrome:** Regular (400) for body and values; Medium (500) for
  labels, headings, buttons, and navigation.
- **Bold (700):** Documented in tokens for parity with Figma. Reserve Bold
  for authored/markdown content emphasis (headings inside AI messages,
  article body, blockquotes). Do not use Bold for routine UI chrome.
- **Never** use user-brand fonts (e.g. Poppins for "Ultra Milk") in product
  UI — those belong only inside brand-content previews.

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
- Hairline separators use `surface-line` / `stroke-default` (white at 10%)
  instead of borders.
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
- `full` (1000px) — the pill — for every button, chip, badge, avatar, search
  field in the top bar, the Ask FRnD control, and the dock.

Corners never mix sharp and rounded in the same view; nothing in frndOS has
a 0px radius except full-bleed imagery inside cards.

## Components

### Design-system primitives (Figma Components library)

- **Avatars (Initial).** Circular pills at five sizes: `xs` 32px, `sm` 40px,
  `md` 48px, `lg` 56px, `xl` 64px. Initial variant uses `yellow-500` fill
  with `text-default` initials. Typography scales with size: `text-sm-medium`
  at xs up through `display-sm-medium` at xl. Photo variant uses the same
  size scale with a circular crop.
- **Chips.** Pill, translucent `container-translucent-subtlest` fill,
  `text-inverse-subtle` label in `text-xs-medium`. Used for filters,
  command-bar destinations, and brand-DNA tags.
- **Tab Rounded.** Segmented pill group: active segment is a white pill
  (`container-light`) with `text-default`; inactive segments are transparent
  with `text-inverse-subtle`. Both use `text-sm-medium`.

### frndOS app patterns (product screens)

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
- **Segmented controls.** Same pattern as Tab Rounded — active segment white
  pill, inactive translucent.
- **Danger Zone.** A clearly separated settings section: `negative-500`
  heading, explanatory line, and `button-danger` — always last on the page.

### Reference components (token anchors)

Lightweight YAML entries that wire the full palette for lint and agent
discovery. These are not separate product UI — they document where each
semantic color belongs (`page-canvas`, `ask-frnd-pill`, `link-primary`,
`delta-aqua`, etc.).

## Do's and Don'ts

- Do reserve FRnD blue (`primary` / `primary-600`) for AI moments and at most one
  primary accent per screen; the default high-emphasis button is white.
- Do build layering with translucent white + blur; don't stack drop shadows
  on the dark canvas.
- Do use pills (`rounded.full`) for all interactive chrome — buttons, chips,
  badges, avatars, segmented controls.
- Do keep deltas and statuses on the vibrant 400 accents with dark text for
  contrast.
- Do use Geist for all product typography; display and text scales share one
  family per Figma.
- Do reserve Bold (700) for authored/markdown content; default UI chrome to
  Regular and Medium only.
- Don't use user-brand fonts (e.g. Poppins) or colors for frndOS UI — they
  belong only inside brand-content previews.
- Don't use `negative-500` outside errors and destructive actions; the
  Danger Zone pattern is its only settings appearance.
- Don't introduce opaque grey borders; separate with `surface-line` /
  `stroke-default` hairlines or spacing instead.
- Do maintain WCAG AA contrast: body text on `app-bg` uses `text-inverse`
  or `text-inverse-subtle`; `text-inverse-subtlest` is for metadata and
  placeholders only, never paragraphs.
