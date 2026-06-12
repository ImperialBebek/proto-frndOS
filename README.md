# New Navigation — Home Prototype

**PROTOTYPE — throwaway.** Active build is **v3** at `/` ([Figma `2608:5779`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2608-5779), [`2614:8356`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2614-8356), [Ask Frnd + card frame `2614:9352`](https://www.figma.com/design/17yTkfyIVb5Aqcq0lTevOT/Foundations?node-id=2614-9352)).

Older **v1** / **v2** component trees remain in the repo for reference but are **not routed** from the app entry.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Desktop-only (min width ~1440px). `?variant=` query params are ignored.

## Deploy (Vercel)

**Production:** [new-navigation-seven.vercel.app](https://new-navigation-seven.vercel.app)

```bash
npm run build   # verify locally first
npx vercel --prod
```

Project linked as `new-navigation` under `raflynurfallah-gmailcoms-projects`.

## v3 — Shell

| Piece | Behavior |
|-------|----------|
| Left nav | Docked sidebar (240px) or collapsed + floating hover panel |
| Content | Rounded card; **8px** outer gutter when nav and/or Ask Frnd is open |
| Ask Frnd | Chat panel **outside** the card; card shrinks with matching frame |

## Scope

- Static Figma copy and metrics
- Local visual state only (tabs, brand tree, chat open)
- No routing, API, or ⌘K palette

## Stack

Next.js App Router, Tailwind CSS, Geist, Phosphor icons, GSAP (`@gsap/react`).
