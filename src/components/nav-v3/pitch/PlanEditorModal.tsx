/** PROTOTYPE Plan editor — pick a scope option (Lean/Balanced/Ambitious) and
 *  edit the deliverable tracks. Deleting a track that already has progress is
 *  blocked; rebuilding the pipeline resets work progress. */

"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CaretRight,
  Lock,
  Plus,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  describeTrackType,
  getScopeOptions,
  PITCH_TRACK_TYPE_LABEL,
  type NewPitchTrackInput,
  type PitchCaseDecode,
  type PitchScopeOption,
  type PitchStepDef,
  type PitchTrackType,
} from "@/data/pitchStatic";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";

type EditableTrack = NewPitchTrackInput & { key: string; stepId?: string };

let keySeq = 0;
const nextKey = () => `pe-${++keySeq}`;

function toEditable(step: PitchStepDef): EditableTrack {
  return {
    key: nextKey(),
    stepId: step.id,
    title: step.label,
    type: step.trackType ?? "campaign",
    summary: step.summary,
    planLabel: step.planLabel,
    reasoning: step.reasoning,
    sourceExcerpt: step.sourceExcerpt,
    sourcePage: step.sourcePage,
  };
}

function scopeToEditable(tracks: NewPitchTrackInput[]): EditableTrack[] {
  return tracks.map((t) => ({ ...t, key: nextKey() }));
}

export function PlanEditorModal({
  decode,
  currentSteps,
  getTrackSubProgress,
  onClose,
  onSave,
}: {
  decode: PitchCaseDecode;
  currentSteps: PitchStepDef[];
  getTrackSubProgress: (trackId: string) => { approved: number; total: number };
  onClose: () => void;
  onSave: (tracks: NewPitchTrackInput[]) => void;
}) {
  const scopeOptions = useMemo(() => getScopeOptions(decode), [decode]);
  const initial = useMemo(
    () => currentSteps.filter((s) => s.kind === "track").map(toEditable),
    [currentSteps]
  );
  const [tracks, setTracks] = useState<EditableTrack[]>(initial);
  const [activeScope, setActiveScope] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progressFor = (track: EditableTrack) =>
    track.stepId ? getTrackSubProgress(track.stepId).approved : 0;

  const hasWorkInProgress = initial.some((t) => progressFor(t) > 0);

  const applyScope = (option: PitchScopeOption) => {
    if (hasWorkInProgress) {
      setError(
        "Some tracks already have approved work — switching scope would reset that. Remove progress first or edit tracks individually."
      );
      return;
    }
    setError(null);
    setActiveScope(option.id);
    setTracks(scopeToEditable(option.tracks));
  };

  const updateTrack = (key: string, patch: Partial<NewPitchTrackInput>) => {
    setTracks((prev) =>
      prev.map((t) => (t.key === key ? { ...t, ...patch } : t))
    );
    setActiveScope(null);
  };

  const removeTrack = (track: EditableTrack) => {
    if (progressFor(track) > 0) {
      setError(
        `"${track.title}" already has approved work — re-open and clear it before removing this track.`
      );
      return;
    }
    setError(null);
    setTracks((prev) => prev.filter((t) => t.key !== track.key));
    setActiveScope(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    setTracks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setActiveScope(null);
  };

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      { key: nextKey(), title: "New deliverable track", type: "campaign" },
    ]);
    setActiveScope(null);
  };

  const save = () => {
    if (tracks.length === 0) {
      setError("Keep at least one deliverable track.");
      return;
    }
    if (tracks.some((t) => !t.title.trim())) {
      setError("Every track needs a name.");
      return;
    }
    onSave(
      tracks.map(({ title, type, summary, planLabel, reasoning, sourceExcerpt, sourcePage }) => ({
        title: title.trim(),
        type,
        summary,
        planLabel,
        reasoning,
        sourceExcerpt,
        sourcePage,
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-md border border-line bg-card-bg shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-text-inverse">
              Edit the pitch plan
            </h3>
            <p className="mt-1 text-xs text-text-inverse-subtle">
              Pick a scope, then fine-tune the deliverable tracks. The AI only
              detects count + type — names and structure are yours.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {scopeOptions.length > 1 && (
            <section className="mb-5">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtlest">
                Scope options
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {scopeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => applyScope(option)}
                    className={`flex flex-col gap-1 rounded-md border p-3 text-left transition ${
                      activeScope === option.id
                        ? "border-sky-400/50 bg-sky-500/[0.08]"
                        : "border-line bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <span className="flex items-center justify-between text-sm font-medium text-text-inverse">
                      {option.label}
                      {option.id === "balanced" && (
                        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
                          Rec
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] leading-snug text-text-inverse-subtle">
                      {option.description}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-text-inverse-subtlest">
                      {option.tracks.length} track
                      {option.tracks.length === 1 ? "" : "s"}
                      <CaretRight size={9} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtlest">
                Deliverable tracks ({tracks.length})
              </p>
              <button
                type="button"
                onClick={addTrack}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-text-inverse-subtle transition hover:border-white/20 hover:text-text-inverse"
              >
                <Plus size={12} weight="bold" />
                Add track
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {tracks.map((track, index) => {
                const locked = progressFor(track) > 0;
                return (
                  <div
                    key={track.key}
                    className="flex items-center gap-2 rounded-md border border-line bg-white/[0.02] p-2.5"
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="text-text-inverse-subtlest transition hover:text-text-inverse disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === tracks.length - 1}
                        aria-label="Move down"
                        className="text-text-inverse-subtlest transition hover:text-text-inverse disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full ${TRACK_TYPE_COLOR[track.type]}`}
                    >
                      {TRACK_TYPE_ICON[track.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <input
                        value={track.title}
                        onChange={(e) =>
                          updateTrack(track.key, { title: e.target.value })
                        }
                        aria-label={`Track ${index + 1} name`}
                        className="h-7 w-full rounded-sm border border-transparent bg-transparent px-1.5 text-sm text-text-inverse outline-none transition focus:border-white/30 focus:bg-white/[0.03]"
                      />
                      <span className="px-1.5 text-[10px] text-text-inverse-subtlest">
                        {track.planLabel ??
                          describeTrackType(track.type, 1, 1)}
                      </span>
                    </div>
                    <select
                      value={track.type}
                      onChange={(e) =>
                        updateTrack(track.key, {
                          type: e.target.value as PitchTrackType,
                        })
                      }
                      aria-label={`Track ${index + 1} type`}
                      className="h-7 shrink-0 rounded-sm border border-line bg-white/[0.03] px-1.5 text-xs text-text-inverse outline-none focus:border-white/30 [&>option]:bg-neutral-900"
                    >
                      {(["brand", "campaign", "content"] as PitchTrackType[]).map(
                        (type) => (
                          <option key={type} value={type}>
                            {PITCH_TRACK_TYPE_LABEL[type]}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeTrack(track)}
                      aria-label={`Remove track ${index + 1}`}
                      title={
                        locked
                          ? "Has approved work — re-open to clear before removing"
                          : "Remove track"
                      }
                      className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-red-300"
                    >
                      {locked ? <Lock size={13} /> : <Trash size={13} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
          <p className="text-[11px] text-text-inverse-subtlest">
            Saving rebuilds the work pipeline; unapproved work resets.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90"
            >
              Save plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
