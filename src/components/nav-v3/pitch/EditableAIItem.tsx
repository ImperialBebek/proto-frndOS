/** PROTOTYPE Reusable AI-item control — inline edit + subtle hover regenerate.
 *  This is the key interaction users expect on every AI-presented item.
 *  - Edit: inline textarea, persisted to localStorage (per pitch + field).
 *  - Regenerate: real AI via /api/pitch/regenerate, or cycles canned variants
 *    in mock mode. */

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowsClockwise,
  Check,
  CircleNotch,
  PencilSimple,
  X,
} from "@phosphor-icons/react";
import { useAiMode } from "@/context/AiModeProvider";
import { regenerateField } from "@/lib/ai/pitchAiClient";

const OVERRIDE_EVENT = "frnd:pitch-field-override";

function editStorageKey(fieldKey: string) {
  return `frnd.pitch.edit.${fieldKey}`;
}

/** Read any persisted manual edit for a field (used to render overrides). */
export function readFieldOverride(fieldKey: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(editStorageKey(fieldKey));
}

/** Write or clear a field override and notify listeners. */
export function writeFieldOverride(fieldKey: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(editStorageKey(fieldKey));
  } else {
    window.localStorage.setItem(editStorageKey(fieldKey), value);
  }
  window.dispatchEvent(
    new CustomEvent(OVERRIDE_EVENT, { detail: { fieldKey, value } })
  );
}

function useFieldOverride(fieldKey: string) {
  const [override, setOverride] = useState<string | null>(null);

  useEffect(() => {
    setOverride(readFieldOverride(fieldKey));
  }, [fieldKey]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ fieldKey: string; value: string | null }>)
        .detail;
      if (detail?.fieldKey === fieldKey) {
        setOverride(detail.value);
      }
    };
    window.addEventListener(OVERRIDE_EVENT, handler);
    return () => window.removeEventListener(OVERRIDE_EVENT, handler);
  }, [fieldKey]);

  const persist = useCallback(
    (next: string | null) => {
      writeFieldOverride(fieldKey, next);
      setOverride(next);
    },
    [fieldKey]
  );

  return { override, persist };
}

type EditableAIItemProps = {
  /** Stable key — include pitchId + optionId so edits are per pitch + option */
  fieldKey: string;
  /** Human label for the field (used in the regenerate prompt) */
  label: string;
  /** Default (mock/canned) value */
  value: string;
  /** Extra context handed to the AI on regenerate */
  context?: string;
  /** Canned alternatives cycled in mock mode */
  variants?: string[];
  multiline?: boolean;
  /** Tailwind classes for the rendered text */
  textClassName?: string;
  /** Render the value with a leading [NEEDS INFO] treatment */
  needsInfo?: boolean;
  /** Called when the field is focused (for assistant context) */
  onFocusField?: () => void;
};

export function EditableAIItem({
  fieldKey,
  label,
  value,
  context,
  variants = [],
  multiline = true,
  textClassName = "text-sm leading-relaxed text-text-inverse-subtle",
  needsInfo = false,
  onFocusField,
}: EditableAIItemProps) {
  const { isReal } = useAiMode();
  const { override, persist } = useFieldOverride(fieldKey);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const current = override ?? value;

  const startEdit = () => {
    onFocusField?.();
    setDraft(current);
    setNote(null);
    setEditing(true);
  };

  const saveEdit = () => {
    persist(draft.trim() === value.trim() ? null : draft.trim());
    setEditing(false);
  };

  const regenerate = useCallback(async () => {
    setNote(null);
    if (isReal) {
      setBusy(true);
      try {
        const next = await regenerateField({
          fieldLabel: label,
          currentValue: current,
          context,
        });
        if (next) persist(next);
      } catch (error) {
        setNote(error instanceof Error ? error.message : "Regenerate failed");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (variants.length === 0) {
      setNote("Mock mode — switch to Live AI to regenerate this.");
      return;
    }
    const nextIndex = (variantIndex + 1) % (variants.length + 1);
    setVariantIndex(nextIndex);
    persist(nextIndex === 0 ? null : variants[nextIndex - 1]);
  }, [isReal, label, current, context, variants, variantIndex, persist]);

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.min(8, Math.max(2, Math.ceil(draft.length / 60)))}
            autoFocus
            className="w-full rounded-sm border border-white/30 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-text-inverse outline-none focus:border-sky-400/60"
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            className="h-9 w-full rounded-sm border border-white/30 bg-white/[0.04] px-3 text-sm text-text-inverse outline-none focus:border-sky-400/60"
          />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={saveEdit}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-black transition hover:bg-white/90"
          >
            <Check size={12} weight="bold" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-text-inverse-subtle transition hover:text-text-inverse"
          >
            <X size={12} />
            Cancel
          </button>
          {override !== null && (
            <button
              type="button"
              onClick={() => {
                persist(null);
                setEditing(false);
              }}
              className="ml-auto text-[10px] text-text-inverse-subtlest underline-offset-2 transition hover:text-text-inverse-subtle hover:underline"
            >
              Reset to AI version
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/edit relative"
      onFocus={onFocusField}
      onMouseEnter={onFocusField}
    >
      <span
        className={
          needsInfo
            ? "text-sm leading-relaxed text-amber-300"
            : textClassName
        }
      >
        {needsInfo ? `[NEEDS INFO] — ${current}` : current}
      </span>
      {override !== null && (
        <span className="ml-2 align-middle text-[9px] font-medium uppercase tracking-wide text-text-inverse-subtlest">
          edited
        </span>
      )}
      <span className="pointer-events-none absolute -top-1 right-0 flex items-center gap-1 opacity-0 transition group-hover/edit:pointer-events-auto group-hover/edit:opacity-100">
        <button
          type="button"
          onClick={startEdit}
          title="Edit"
          className="flex size-6 items-center justify-center rounded-sm bg-card-bg/90 text-text-inverse-subtle shadow-sm ring-1 ring-line transition hover:text-text-inverse"
        >
          <PencilSimple size={12} />
        </button>
        <button
          type="button"
          onClick={regenerate}
          disabled={busy}
          title={isReal ? "Regenerate with Live AI" : "Regenerate"}
          className="flex size-6 items-center justify-center rounded-sm bg-card-bg/90 text-text-inverse-subtle shadow-sm ring-1 ring-line transition hover:text-sky-300 disabled:opacity-50"
        >
          {busy ? (
            <CircleNotch size={12} className="animate-spin" />
          ) : (
            <ArrowsClockwise size={12} />
          )}
        </button>
      </span>
      {note && (
        <span className="mt-1 block text-[10px] text-text-inverse-subtlest">
          {note}
        </span>
      )}
    </div>
  );
}
