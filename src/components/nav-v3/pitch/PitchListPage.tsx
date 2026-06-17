/** PROTOTYPE Pitch list page — Figma 7141:2030 */

"use client";

import { useMemo, useState } from "react";
import { FunnelSimple, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_STAGES,
  type PitchListItem,
  type PitchStatus,
  type PitchStepDef,
} from "@/data/pitchStatic";

type PitchListPageProps = {
  onOpenPitch: (pitchId: string) => void;
  onStartNewPitch: () => void;
};

type FilterId = "all" | PitchStatus;
type SortId = "recent" | "deadline" | "progress";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ongoing", label: "Ongoing" },
  { id: "finished", label: "Finished" },
  { id: "draft", label: "Draft" },
];

const SORT_LABEL: Record<SortId, string> = {
  recent: "Sort: Recent",
  deadline: "Sort: Deadline",
  progress: "Sort: Progress",
};

const STATUS_ORDER: Record<PitchStatus, number> = {
  ongoing: 0,
  finished: 1,
  draft: 2,
};

export function PitchListPage({
  onOpenPitch,
  onStartNewPitch,
}: PitchListPageProps) {
  const { pitches, getProgress, getActiveStepId, getStepDef } = usePitch();
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("recent");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const base = { all: pitches.length, ongoing: 0, finished: 0, draft: 0 };
    for (const pitch of pitches) base[pitch.status] += 1;
    return base;
  }, [pitches]);

  const nearestDeadline = useMemo(() => {
    const ongoing = pitches.filter((pitch) => pitch.status === "ongoing");
    if (ongoing.length === 0) return null;
    return ongoing.reduce((min, pitch) =>
      pitch.daysLeft < min.daysLeft ? pitch : min
    );
  }, [pitches]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = pitches.filter((pitch) => {
      if (filter !== "all" && pitch.status !== filter) return false;
      if (!query) return true;
      return `${pitch.brand} ${pitch.project}`.toLowerCase().includes(query);
    });

    const sorted = [...filtered];
    if (sort === "recent") {
      sorted.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    } else if (sort === "deadline") {
      sorted.sort((a, b) => a.daysLeft - b.daysLeft);
    } else {
      sorted.sort(
        (a, b) => getProgress(b.id).percent - getProgress(a.id).percent
      );
    }
    return sorted;
  }, [pitches, filter, search, sort, getProgress]);

  const cycleSort = () => {
    setSort((prev) =>
      prev === "recent" ? "deadline" : prev === "deadline" ? "progress" : "recent"
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-16">
      <div className="flex w-full flex-col gap-8">
        <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <MetricCard label="Active Pitches" value={String(counts.ongoing)} />
          <MetricCard
            label="Finished this quarter"
            value={String(counts.finished)}
          />
          <MetricCard
            label="Nearest deadline"
            value={nearestDeadline ? `${nearestDeadline.daysLeft} days` : "—"}
          />
          <MetricCard label="Drafts waiting" value={String(counts.draft)} />
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center rounded-rounded">
              {FILTERS.map((item) => {
                const isActive = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`h-8 rounded-rounded px-3 text-sm font-medium tracking-[-0.14px] transition ${
                      isActive
                        ? "bg-white text-text-default shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
                        : "text-text-inverse hover:text-text-inverse"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-10 w-[264px] items-center gap-3 rounded-md bg-[var(--container-input)] px-3 backdrop-blur-shallow">
                <MagnifyingGlass
                  size={20}
                  className="shrink-0 text-text-inverse-subtlest"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search pitches..."
                  className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.14px] text-text-inverse outline-none placeholder:text-text-inverse-subtlest"
                />
              </div>
              <button
                type="button"
                onClick={cycleSort}
                className="inline-flex h-8 items-center gap-2 rounded-sm text-sm font-medium tracking-[-0.14px] text-text-inverse transition hover:bg-white/[0.04]"
              >
                <FunnelSimple size={20} />
                {SORT_LABEL[sort]}
              </button>
              <button
                type="button"
                onClick={onStartNewPitch}
                className="inline-flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-rounded bg-white px-4 text-sm font-medium tracking-[-0.14px] text-text-default transition hover:bg-white/90"
              >
                <Plus size={20} weight="bold" />
                New Pitch
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-md bg-white/5 py-16 text-center">
              <MagnifyingGlass size={24} className="text-text-inverse-subtlest" />
              <p className="text-sm font-medium text-text-inverse">
                No pitches found
              </p>
              <p className="text-xs text-text-inverse-subtlest">
                Try a different filter or search term
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((pitch) => (
                <PitchCard
                  key={pitch.id}
                  pitch={pitch}
                  progress={getProgress(pitch.id)}
                  activeStep={getStepDef(
                    pitch.id,
                    getActiveStepId(pitch.id)
                  )}
                  onOpen={() => onOpenPitch(pitch.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-white/5 p-4">
      <p className="text-sm tracking-[-0.14px] text-text-inverse-subtlest">
        {label}
      </p>
      <p className="text-2xl font-medium leading-[1.2] tracking-[-0.36px] text-text-inverse">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ pitch }: { pitch: PitchListItem }) {
  if (pitch.status === "finished") {
    return (
      <span className="inline-flex h-5 shrink-0 items-center rounded-xs bg-positive-950 px-1.5 text-xs font-medium text-positive-500">
        Done
      </span>
    );
  }
  if (pitch.status === "draft") {
    return (
      <span className="inline-flex h-5 shrink-0 items-center rounded-xs bg-white/10 px-1.5 text-xs font-medium text-text-inverse-subtle">
        Draft
      </span>
    );
  }
  if (pitch.daysLeft <= 5) {
    return (
      <span className="inline-flex h-5 shrink-0 items-center rounded-xs bg-negative-subtle px-1.5 text-xs font-medium text-red-50">
        High Priority
      </span>
    );
  }
  if (pitch.daysLeft <= 10) {
    return (
      <span className="inline-flex h-5 shrink-0 items-center rounded-xs bg-negative-subtle px-1.5 text-xs font-medium text-red-50">
        At Risk
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-xs bg-positive-950 px-1.5 text-xs font-medium text-positive-500">
      On Track
    </span>
  );
}

function PitchCard({
  pitch,
  progress,
  activeStep,
  onOpen,
}: {
  pitch: PitchListItem;
  progress: { approved: number; total: number; percent: number };
  activeStep: PitchStepDef | undefined;
  onOpen: () => void;
}) {
  const activeStage = PITCH_STAGES.find(
    (stage) => stage.id === activeStep?.stageId
  );
  const finished = pitch.status === "finished";

  const phaseLabel = pitch.newlyCreated
    ? "Brief Decoder: AI decoding brief…"
    : finished
      ? "All stages complete"
      : activeStep
        ? `${activeStage?.label ?? ""}: ${activeStep.label}`
        : "Not started";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex min-h-[205px] flex-col gap-4 rounded-md p-4 text-left transition ${
        pitch.newlyCreated
          ? "border border-sky-400/50 bg-sky-500/[0.06] shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
          : "bg-white/5 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: pitch.logoColor }}
        >
          {pitch.logoInitials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium tracking-[-0.14px] text-text-inverse">
            {pitch.brand}
          </h3>
          <p className="truncate text-xs text-text-inverse-subtle">
            {pitch.project}
          </p>
        </div>
        <StatusBadge pitch={pitch} />
      </div>

      <div className="flex flex-col gap-3">
        <p
          className={`text-xs font-medium leading-[1.4] ${
            pitch.newlyCreated ? "text-sky-300" : "text-text-inverse"
          }`}
        >
          {phaseLabel}
        </p>
        <div className="h-1 overflow-hidden rounded-md bg-positive-950">
          <div
            className="h-full rounded-md bg-positive-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-text-inverse-subtlest">
            {progress.approved} of {progress.total} phases
          </span>
          <span className="rounded bg-white/15 px-1 text-xs font-medium text-text-inverse backdrop-blur-[8px]">
            {progress.percent}%
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex items-center">
          {pitch.sc || pitch.ce ? (
            <>
              {pitch.sc && (
                <span
                  className="flex size-6 items-center justify-center rounded-full border-2 border-[#252525] text-[9px] font-semibold text-black"
                  style={{ backgroundColor: pitch.scColor ?? "#999" }}
                  title="Strategic Consultant"
                >
                  {pitch.sc}
                </span>
              )}
              {pitch.ce && (
                <span
                  className="-ml-1.5 flex size-6 items-center justify-center rounded-full border-2 border-[#252525] text-[9px] font-semibold text-black"
                  style={{ backgroundColor: pitch.ceColor ?? "#999" }}
                  title="Creative Executor"
                >
                  {pitch.ce}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs italic text-text-inverse-subtlest">
              Unassigned
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-text-inverse">
            {finished
              ? pitch.deadline
              : `${pitch.deadline} • ${pitch.daysLeft}d left`}
          </p>
          <p className="text-xs text-text-inverse-subtle">
            Modified {pitch.lastUpdated}
          </p>
        </div>
      </div>
    </button>
  );
}
