/** PROTOTYPE Pitch list page — all pitches dashboard (frndOS Campaign Pitch) */

"use client";

import { useMemo, useState } from "react";
import {
  ArrowsDownUp,
  CalendarBlank,
  CheckCircle,
  Cpu,
  FileText,
  Files,
  MagnifyingGlass,
  Plus,
  Timer,
} from "@phosphor-icons/react";
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
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <section className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
              frndOS Pitch
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-text-inverse lg:text-4xl">
              Campaign Pitches
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-text-inverse-subtle">
              Upload a client brief, let frndOS decode it into a pitch plan, and
              run the full pipeline with a 2-person team in under 2 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNewPitch}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Plus size={16} weight="bold" />
            Start New Pitch
          </button>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Timer size={16} className="text-sky-400" />}
            label="Active pitches"
            value={String(counts.ongoing)}
          />
          <StatCard
            icon={<CheckCircle size={16} className="text-emerald-400" />}
            label="Finished this quarter"
            value={String(counts.finished)}
          />
          <StatCard
            icon={<CalendarBlank size={16} className="text-amber-400" />}
            label="Nearest deadline"
            value={
              nearestDeadline ? `${nearestDeadline.daysLeft} days` : "—"
            }
            hint={nearestDeadline?.brand}
          />
          <StatCard
            icon={<Files size={16} className="text-text-inverse-subtle" />}
            label="Drafts waiting"
            value={String(counts.draft)}
          />
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {FILTERS.map((item) => {
                const isActive = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-white text-black"
                        : "border border-line text-text-inverse-subtle hover:text-text-inverse"
                    }`}
                  >
                    {item.label}
                    <span className="ml-1.5 font-mono text-[10px] opacity-60">
                      {counts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 items-center gap-2 rounded-full border border-line px-3">
                <MagnifyingGlass
                  size={14}
                  className="text-text-inverse-subtlest"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search pitches..."
                  className="w-36 bg-transparent text-xs text-text-inverse outline-none placeholder:text-text-inverse-subtlest"
                />
              </div>
              <button
                type="button"
                onClick={cycleSort}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
              >
                <ArrowsDownUp size={14} />
                {SORT_LABEL[sort]}
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-md border border-line bg-white/[0.02] py-16 text-center">
              <MagnifyingGlass size={24} className="text-text-inverse-subtlest" />
              <p className="text-sm font-medium text-text-inverse">
                No pitches found
              </p>
              <p className="text-xs text-text-inverse-subtlest">
                Try a different filter or search term
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-line bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
          {label}
        </p>
      </div>
      <p className="mt-2 text-xl font-semibold text-text-inverse">
        {value}
        {hint && (
          <span className="ml-2 text-xs font-normal text-text-inverse-subtle">
            {hint}
          </span>
        )}
      </p>
    </div>
  );
}

function StatusBadge({ pitch }: { pitch: PitchListItem }) {
  if (pitch.status === "ongoing" && pitch.daysLeft <= 5) {
    return (
      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-300">
        Urgent
      </span>
    );
  }
  if (pitch.status === "ongoing") {
    return (
      <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-300">
        Ongoing
      </span>
    );
  }
  if (pitch.status === "finished") {
    return (
      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
        Finished
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-text-inverse-subtle">
      Draft
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

  const phaseLabel = finished
    ? "All stages complete"
    : activeStep
      ? `${activeStage?.label ?? ""} · ${activeStep.label}`
      : "Not started";

  const barColor = finished
    ? "bg-emerald-400"
    : pitch.status === "draft"
      ? "bg-white/20"
      : "bg-sky-400";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex flex-col gap-4 rounded-md border p-5 text-left transition ${
        pitch.newlyCreated
          ? "border-sky-400/50 bg-sky-500/[0.06] shadow-[0_0_0_3px_rgba(56,189,248,0.12)]"
          : "border-line bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      } ${finished ? "opacity-70 hover:opacity-100" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
            style={{ backgroundColor: pitch.logoColor }}
          >
            {pitch.logoInitials}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-text-inverse">
              {pitch.brand}
            </h3>
            <p className="truncate text-xs text-text-inverse-subtle">
              {pitch.project}
            </p>
          </div>
        </div>
        <StatusBadge pitch={pitch} />
      </div>

      <div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-text-inverse-subtle">
            {progress.approved} of {progress.total} steps
          </span>
          <span className="font-mono text-text-inverse-subtlest">
            {progress.percent}%
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        {pitch.newlyCreated ? (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-sky-300">
            <Cpu size={12} className="animate-pulse" />
            Brief Decoder · AI decoding brief…
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-inverse-subtle">
            <FileText size={12} />
            {phaseLabel}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          {pitch.sc || pitch.ce ? (
            <>
              {pitch.sc && (
                <span
                  className="flex size-6 items-center justify-center rounded-full text-[9px] font-semibold text-black"
                  style={{ backgroundColor: pitch.scColor ?? "#999" }}
                  title="Strategic Consultant"
                >
                  {pitch.sc}
                </span>
              )}
              {pitch.ce && (
                <span
                  className="-ml-1 flex size-6 items-center justify-center rounded-full text-[9px] font-semibold text-black ring-2 ring-card-bg"
                  style={{ backgroundColor: pitch.ceColor ?? "#999" }}
                  title="Creative Executor"
                >
                  {pitch.ce}
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] italic text-text-inverse-subtlest">
              Unassigned
            </span>
          )}
        </div>
        <div className="text-right">
          <p
            className={`text-[11px] font-medium ${
              finished
                ? "text-text-inverse-subtle"
                : pitch.daysLeft <= 3
                  ? "text-red-300"
                  : pitch.daysLeft <= 10
                    ? "text-amber-300"
                    : "text-text-inverse-subtle"
            }`}
          >
            {finished ? pitch.deadline : `${pitch.deadline} · ${pitch.daysLeft}d left`}
          </p>
          <p className="text-[10px] text-text-inverse-subtlest">
            Updated {pitch.lastUpdated}
          </p>
        </div>
      </div>
    </button>
  );
}

