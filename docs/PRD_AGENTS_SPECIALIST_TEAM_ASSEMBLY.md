---
title: frndOS Agents — Specialist Team Assembly
slug: frndos-agents-specialist-team-assembly
author: Codex
created: 2026-06-08
status: draft
services: [web]
---

# frndOS Agents — Specialist Team Assembly PRD

## Overview

frndOS Agents is evolving from a prototype agent directory into a team-building product surface. The feature should help users understand that **Agents** is the product area, while **specialists** are the agent units they create and use inside a workspace.

The core product promise is:

**Assemble a team of specialists that can help across frndOS.**

Today, specialists are most visible inside AskFrnd chat, but the long-term direction is broader: specialists can support work such as research, reports, KV generation, and orchestration across other frndOS workflows. This PRD defines the product model, UX, and prototype requirements needed to establish that foundation.

### Primary users

- Brand and marketing operators working inside frndOS workspaces
- Users already using Claude or ChatGPT with role-based custom assistants
- Users who want stronger outcomes without needing to write system prompts from scratch

### Problem

The previous prototype made agents feel like isolated bots in a catalog:

- it did not clearly explain why users should have more than one agent
- it did not frame agents as a reusable team inside a workspace
- it over-indexed on manual setup and prompt-writing
- it did not clearly separate FRND from user-added specialists
- it did not communicate that specialists can support real frndOS work beyond generic chat

### Product thesis

frndOS should feel better than Claude or ChatGPT for specialist-based workflows because:

- specialists live inside a workspace
- brand access and context are explicit
- users can start from strong templates instead of blank prompts
- FRND remains the default assistant while specialists provide focused help
- the same specialist system can later expand into deeper workflow execution across frndOS

## Existing System Reconciliation

The current prototype already provides a working UI shell with three core routes:

- `/agents` for the roster/catalog surface
- `/agents/new` for specialist creation
- `/askfrnd` for conversation

The new PRD reconciles with several realities in the current system:

1. The current implementation is **web-only** and fully local.
2. State is persisted in browser localStorage; there is no backend, auth layer, or database.
3. AskFrnd is already the main active interaction surface; deeper cross-feature specialist execution is only partially represented today.
4. The previous “default vs custom agent” split is not strong enough for the desired product story. It needs to become **template catalog vs team specialist instances**.
5. FRND already exists as a distinct assistant surface and should remain separate from user-created specialists.

## User Stories

- As a workspace user, I want to understand what Agents is for, so I can see why building a specialist team is valuable.
- As a user coming from Claude or ChatGPT, I want to start from a strong specialist template, so I do not need to write prompts from scratch.
- As a user new to custom agents, I want guided specialist creation, so I can make something powerful with minimal typing.
- As a user managing multiple brands, I want to control which brands a specialist can work on, so the specialist stays grounded in the right context.
- As a user in AskFrnd, I want FRND to remain usable on its own, so the product still works before I build a team.
- As a user with a team of specialists, I want to chat with a specific specialist directly, so I can get focused help right away.
- As a user planning future workflows, I want to see that specialists can support work like research, reports, and KV, so the feature feels like part of frndOS and not a generic chatbot clone.

## Requirements

### Functional Requirements

**FR-1. Agents as product area**

The product must use `Agents` as the feature name in primary navigation and product chrome.

**FR-2. Specialists as user-facing unit**

The product must use `specialist` as the main onboarding and creation term for the units users build and use.

**FR-3. One long-lived Agents home**

The product must use one Agents home for both first-run and returning users, instead of a separate onboarding route.

**FR-4. Team-first page structure**

The Agents home must contain:

- a `Your team` section at the top
- a `Start with these specialists` section for frndOS starter templates
- a `From your workspace` section for workspace-published templates
- a distinct custom creation entry for `New specialist`

**FR-5. Template-based specialist creation**

Starter specialists and workspace-published specialists must behave as reusable templates, not fixed shared instances.

**FR-6. Reusable templates**

Users must be able to start from the same template multiple times to create different tuned variants.

**FR-7. Prefilled builder handoff**

Selecting `Start with this specialist` must open the specialist builder in a prefilled state rather than instantly creating the specialist.

**FR-8. Assisted builder**

The specialist builder must start from a lightweight guided flow:

- work type
- tone / behavior direction
- brand access mode
- optional short brief

The system must then suggest:

- specialist name
- role
- description
- capabilities / skills
- surfaces
- behavior summary
- underlying instructions

**FR-9. Human-readable editing**

Users must be able to edit the suggested specialist through human-readable fields before creation.

**FR-10. Advanced prompt editing**

Raw instructions must be hidden by default and only shown in an advanced section.

**FR-11. Workspace scope**

Specialists must live only within the current workspace. They are not shared across workspaces by default.

**FR-12. Brand access**

Each specialist must support explicit brand access state:

- all brands
- selected brands
- decide later

**FR-13. Team specialist instances**

When a user confirms a new specialist, the system must create a user-owned team specialist instance with independent editable state.

**FR-14. AskFrnd baseline**

AskFrnd must remain fully usable even when the user has zero specialists.

**FR-15. FRND separation**

FRND must remain a distinct assistant surface, not just another specialist card in the team.

**FR-16. Direct specialist usage**

Users must be able to explicitly choose and chat with specialists from AskFrnd.

**FR-17. Specialist visibility in AskFrnd**

Recently added team specialists must be easy to discover inside AskFrnd, including as direct chat entry points.

**FR-18. Capability signaling**

Template and team specialist cards must show which frndOS surfaces they can help with, such as AskFrnd, Research, Reports, and KV.

**FR-19. Workspace templates as visual-only scope**

Workspace-published templates must be represented visually in this phase, but publishing flows are out of scope.

**FR-20. Persistence**

User-owned team specialists and custom skills must persist across browser reloads in the prototype.

### Non-Functional Requirements

- The prototype must remain fully client-side and functional without a backend.
- The feature must preserve current App Router compatibility and pass production build checks.
- The feature must remain desktop-first and visually coherent within the existing prototype shell.
- The creation flow must minimize user typing and avoid making prompt-writing feel mandatory.
- The system must be extensible enough to support future orchestration and cross-feature execution.

## Service Breakdown

### Web

The web app is the only in-scope service for this prototype phase.

It must:

- expose the new team-first Agents home
- expose the assisted builder
- persist team specialists locally
- reflect the FRND + specialists model inside AskFrnd
- support template-prefill and specialist editing routes

### Future services not yet in scope

These are intentionally not required for this PRD phase:

- backend persistence
- auth / workspace membership
- publish-to-workspace APIs
- real orchestration or task assignment services
- real model inference or tool execution APIs

## UI / UX

### Agents home

The Agents home should answer three questions quickly:

1. What is this feature?
2. What team do I already have?
3. How do I start building or using specialists?

#### Section order

1. Page intro:
   - `Agents`
   - `Assemble a team of specialists that can help across frndOS.`
2. `Your team`
3. `Start with these specialists`
4. `From your workspace`
5. `New specialist`

#### Team section behavior

- Empty state:
  - explain the team concept
  - point users toward starter templates or custom creation
- Partial state:
  - show progress with 1-2 specialists
  - include a visible `Try your team in AskFrnd` CTA
- Established state:
  - show compact roster cards
  - preserve `Try your team in AskFrnd`

### Template cards

Each template card should prioritize:

1. the job/outcome it helps with
2. the specialist role
3. the surfaces it supports
4. the behavior summary
5. the CTA: `Start with this specialist`

### Specialist builder

The builder must feel like an assisted setup flow, not a raw config form.

#### Builder phases

1. Shape the specialist
   - work type
   - tone
   - brand access
   - optional brief
2. Tune the suggestion
   - specialist name
   - role
   - what it helps with
   - behavior summary
   - skills
   - surfaces
   - advanced instructions

### AskFrnd

AskFrnd should reinforce the model:

- FRND is always available
- specialists are optional but valuable
- recently added specialists should be visible
- users can choose a specialist explicitly
- orchestration remains a future behavior, not invisible automation

## Data Model

### Team specialist

The prototype should treat user-owned specialists as the main persisted entity, with fields such as:

- identity: id, name, role, description
- source metadata: sourceTemplateId, sourceTemplateSource
- scope: brandAccessMode, brandAccessIds
- capabilities: skills, surfaces
- behavior: behaviorSummary, systemPrompt
- status: active, draft, archived
- timestamps / usage: createdAt, lastInvokedAt

### Specialist template

Templates should be modeled separately from team specialists, with fields such as:

- id
- name
- role
- jobStatement
- description
- source (`frndos` or `workspace`)
- skills
- surfaces
- behaviorSummary
- systemPrompt
- brandColor
- publishedBy (workspace templates only)

### Prototype persistence

- Persisted:
  - team specialists
  - custom skills
- Not persisted as user-owned mutable state:
  - starter templates
  - workspace templates

## API Endpoints

There are no required production APIs in this prototype phase.

### Current prototype state

- no backend endpoints
- no auth endpoints
- no publish/share endpoints
- no orchestration endpoints

### Future API considerations

When the product moves beyond prototype phase, likely API areas include:

- workspace specialist CRUD
- publish specialist template to workspace
- assign brand access
- AskFrnd orchestration / routing
- execution surfaces beyond chat

These are intentionally not specified in detail yet because the current project is still validating the UX foundation.

## Acceptance Criteria

The feature is acceptable when:

1. The Agents home clearly communicates a team-building model rather than a generic agent directory.
2. Users can distinguish `starter templates`, `workspace templates`, and `their team`.
3. `Start with this specialist` opens a prefilled builder instead of instantly creating a specialist.
4. Users can create a specialist with minimal typing through the assisted builder.
5. Raw instructions are hidden by default but still available through an advanced section.
6. Users can set brand access to all brands, selected brands, or decide later.
7. A created specialist appears in `Your team` and persists across reload.
8. AskFrnd still works with zero specialists.
9. AskFrnd makes recently added specialists easy to discover and use directly.
10. The web app builds successfully in production mode without route or type errors.

## Success Signals

For the next iteration, the product should be considered directionally successful if users:

- understand the difference between FRND and specialists without explanation from the team
- start from templates more often than they begin from scratch
- can create a specialist without needing to write raw prompt text
- can identify at least one non-chat frndOS surface a specialist could help with

## Assumptions and Clarifications

- `Agents` remains the feature name; `specialist` is the user-facing creation and team term.
- FRND is not a team specialist.
- Specialists are workspace-scoped.
- Brand access is configurable per specialist.
- Workspace-published templates are represented visually in this phase, but publishing flows are not yet implemented.
- Some deeper specialist capabilities already exist conceptually or through engineering work, but the current prototype is primarily establishing the Agents foundation and user mental model.

## Non-Goals

This PRD does not include:

- backend or database design
- authentication
- multi-user collaboration flows
- true shared workspace publishing workflows
- fully automated orchestration
- deep execution inside every frndOS feature
- mobile-first redesign

## Open Questions

1. When workspace publishing becomes real, what permissions determine who can publish or update a shared specialist template?
2. When orchestration becomes real, how should FRND explain routing decisions to preserve trust?
3. What specialist capabilities are genuinely available today beyond chat, and which are only roadmap promises?
4. How should brand access behave when a workspace has dozens of brands instead of the small seeded prototype set?
5. When the product moves to backend persistence, what becomes the source of truth for starter templates vs workspace templates vs team specialists?
