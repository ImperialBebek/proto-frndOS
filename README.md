# New Navigation — Home Prototype

**PROTOTYPE — throwaway.** Two navigation variants on one app:

| Variant | URL | Figma |
|---------|-----|-------|
| **v1** (default) | [localhost:3000](http://localhost:3000) | [Home `2487:5908`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2487-5908), [Brand `2492:6699`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2492-6699) |
| **v2** | [localhost:3000/?variant=v2](http://localhost:3000/?variant=v2) | [Floating (Brand Top) `2537:14183`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2537-14183) |

Use the **v1 / v2** control (top-right) to switch variants.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Desktop-only (min width ~1440px).

## Backgrounds

| View | Outer / page | Content card |
|------|----------------|--------------|
| Home | `#F6F6F6` (`grey-50`) | — |
| Brand | `#E7E7E7` (`grey-100`) | `#F6F6F6` rounded 16px inset |

## v1 — Dock behavior (Android tablet metaphor)

| View | Dock | Figma |
|------|------|-------|
| Home | **Floating** — white pill, centered, brand avatars | `2487:5918` |
| Brand | **Sticky** — full-width 40px bar, brand avatars | `2492:6706` |

- Open brand (dock icon or “Your brands” card) → brand page + sticky dock
- **Home** in dock → back to home + floating dock
- Switch brand on sticky bar → same layout, new selection (primary border + inset glow)

## v2 — Navigation model

| View | Top bar | Bottom dock | Other |
|------|---------|-------------|--------|
| Home | **Brand switcher** (Home + brands) | **Tools** — Ask Frnd, Inbox, Pitch, Playground; hover chip + icon grow | “Your brands” cards are display-only |
| Brand | **Brand switcher** (same) | **Modules** — Insights, Studio, Research, Growth, Loyalty (sticky) | Floating pills: Ask Anything + ≤3 scroll-linked suggestions |

- Enter brand via **top switcher only**; **Home** tab exits brand
- Switch brand on top bar → same module tab stays selected
- Tool/module dock clicks are **visual-only** (no panel swap)
- Suggestion pills update with **pop animation** when scrolling Quick Brief → Performance → Audience sections
- ~200ms morph when dock mode changes (floating tools ↔ sticky modules)

## Scope

- Light theme matching Figma
- Static Figma copy and metrics
- Local visual state: top tabs (Home / Inbox / Playground), module tabs on brand (Insights active)
- Profile avatar in top nav (home + brand)
- No routing, API, or ⌘K palette

## Stack

Next.js App Router, Tailwind CSS, Geist, Phosphor icons.
