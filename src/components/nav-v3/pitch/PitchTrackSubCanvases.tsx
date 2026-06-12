/** PROTOTYPE Work track sub-step canvases — renderers for every TrackContentBlock kind */

"use client";

import {
  Broadcast,
  CalendarBlank,
  ChatCircleText,
  Compass,
  Crosshair,
  ImageSquare,
  PaintBrush,
  Quotes,
  SquaresFour,
  Stack,
} from "@phosphor-icons/react";
import {
  getTrackSubStepOutput,
  type PitchTrackType,
  type TrackContentBlock,
} from "@/data/pitchStatic";

export function TrackSubStepCanvas({
  trackStepId,
  subStepId,
  trackType,
}: {
  trackStepId: string;
  subStepId: string;
  trackType?: PitchTrackType;
}) {
  const output = getTrackSubStepOutput(trackStepId, subStepId, trackType);
  if (!output) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-text-inverse">
          {output.heading}
        </h3>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-inverse-subtle">
          {output.intro}
        </p>
      </div>
      {output.blocks.map((block, index) => (
        <TrackContentBlockView key={`${block.kind}-${index}`} block={block} />
      ))}
    </div>
  );
}

function TrackContentBlockView({ block }: { block: TrackContentBlock }) {
  switch (block.kind) {
    case "kv-concept":
      return <KvConceptBlock block={block} />;
    case "campaign-plan":
      return <CampaignPlanBlock block={block} />;
    case "channel-rollout":
      return <ChannelRolloutBlock block={block} />;
    case "positioning":
      return <PositioningBlock block={block} />;
    case "visual-system":
      return <VisualSystemBlock block={block} />;
    case "voice":
      return <VoiceBlock block={block} />;
    case "content-pillars":
      return <ContentPillarsBlock block={block} />;
    case "format-system":
      return <FormatSystemBlock block={block} />;
    case "cadence":
      return <CadenceBlock block={block} />;
    default:
      return null;
  }
}

function SectionEyebrow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* KV concept — hero card                                              */
/* ------------------------------------------------------------------ */

function KvConceptBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "kv-concept" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_45%)] p-6 lg:p-8">
        <SectionEyebrow
          icon={<ImageSquare size={14} className="text-sky-300" />}
          label={`Main key visual · ${block.title}`}
        />
        <p className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.4px] text-text-inverse lg:text-3xl">
          {block.headline}
        </p>
        <p className="mt-2 text-sm font-medium text-sky-200">{block.tagline}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-line bg-white/[0.02] p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
            Visual
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-inverse-subtle">
            {block.visual}
          </p>
        </div>
        <div className="rounded-md border border-line bg-white/[0.02] p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
            Art direction
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {block.artDirection.map((note) => (
              <li
                key={note}
                className="flex gap-2 text-sm leading-relaxed text-text-inverse-subtle"
              >
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-text-inverse-subtlest" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Campaign plan — objective, moment, mix, phases                      */
/* ------------------------------------------------------------------ */

function CampaignPlanBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "campaign-plan" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-line bg-white/[0.02] p-5">
        <SectionEyebrow
          icon={<Crosshair size={14} className="text-amber-300" />}
          label="Objective"
        />
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-inverse-subtle">
          {block.objective}
        </p>
        <div className="mt-3 rounded-sm border-l-2 border-sky-400/60 bg-sky-500/[0.06] px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-sky-300/80">
            Audience moment
          </p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-sky-200">
            {block.audienceMoment}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-line bg-white/[0.02] p-5">
        <SectionEyebrow
          icon={<Broadcast size={14} className="text-text-inverse-subtle" />}
          label="Channel mix"
        />
        <ul className="mt-3 flex flex-col gap-2">
          {block.channelMix.map((channel) => (
            <li
              key={channel}
              className="flex gap-2 text-sm leading-relaxed text-text-inverse-subtle"
            >
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-text-inverse-subtlest" />
              {channel}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
          Timeline · phases
        </p>
        <div className="flex flex-col gap-2">
          {block.phases.map((phase, index) => (
            <div key={phase.phase} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.04] font-mono text-[10px] text-text-inverse-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < block.phases.length - 1 && (
                  <span className="w-px flex-1 bg-line" />
                )}
              </div>
              <div className="mb-2 flex-1 rounded-md border border-line bg-white/[0.02] px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-text-inverse">
                    {phase.phase}
                  </p>
                  <span className="font-mono text-[10px] text-text-inverse-subtlest">
                    {phase.window}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-inverse-subtle">
                  {phase.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Channel rollout — adaptation rows                                   */
/* ------------------------------------------------------------------ */

function ChannelRolloutBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "channel-rollout" }>;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white/[0.02]">
      <div className="border-b border-line px-5 py-3">
        <SectionEyebrow
          icon={<Broadcast size={14} className="text-text-inverse-subtle" />}
          label="Channel adaptations"
        />
      </div>
      {block.adaptations.map((adaptation) => (
        <div
          key={adaptation.channel}
          className="grid gap-1 border-b border-line/50 px-5 py-3.5 last:border-b-0 sm:grid-cols-[160px_1fr]"
        >
          <div>
            <p className="text-sm font-medium text-text-inverse">
              {adaptation.channel}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-text-inverse-subtlest">
              {adaptation.format}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-text-inverse-subtle sm:pt-0.5">
            {adaptation.note}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Positioning — territory hero + pillars                              */
/* ------------------------------------------------------------------ */

function PositioningBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "positioning" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_right,_rgba(167,139,250,0.12),_transparent_45%)] p-6 lg:p-8">
        <SectionEyebrow
          icon={<Compass size={14} className="text-violet-300" />}
          label="Positioning territory"
        />
        <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-text-inverse">
          {block.territory}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {block.pillars.map((pillar, index) => (
          <div
            key={pillar.name}
            className="rounded-md border border-line bg-white/[0.02] p-4"
          >
            <span className="font-mono text-[10px] text-text-inverse-subtlest">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-1.5 text-sm font-medium text-text-inverse">
              {pillar.name}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-text-inverse-subtle">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Visual system — element direction cards                             */
/* ------------------------------------------------------------------ */

function VisualSystemBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "visual-system" }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {block.elements.map((element) => (
        <div
          key={element.element}
          className="rounded-md border border-line bg-white/[0.02] p-5"
        >
          <SectionEyebrow
            icon={<PaintBrush size={14} className="text-violet-300" />}
            label={element.element}
          />
          <p className="mt-2.5 text-sm leading-relaxed text-text-inverse-subtle">
            {element.direction}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Voice — principles + example lines                                  */
/* ------------------------------------------------------------------ */

function VoiceBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "voice" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-3">
        {block.principles.map((principle) => (
          <div
            key={principle.name}
            className="rounded-md border border-line bg-white/[0.02] p-4"
          >
            <div className="flex items-center gap-2">
              <ChatCircleText size={14} className="text-emerald-300" />
              <h4 className="text-sm font-medium text-text-inverse">
                {principle.name}
              </h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-inverse-subtle">
              {principle.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-line bg-white/[0.02] p-5">
        <SectionEyebrow
          icon={<Quotes size={14} className="text-text-inverse-subtle" />}
          label="Example lines"
        />
        <div className="mt-3 flex flex-col gap-2">
          {block.exampleLines.map((line) => (
            <p
              key={line}
              className="rounded-sm border-l-2 border-emerald-400/60 bg-emerald-500/[0.06] px-3 py-2 text-sm font-medium leading-relaxed text-emerald-200"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content pillars — pillar cards with example posts                   */
/* ------------------------------------------------------------------ */

function ContentPillarsBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "content-pillars" }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {block.pillars.map((pillar, index) => (
        <div
          key={pillar.name}
          className="flex flex-col gap-2.5 rounded-md border border-line bg-white/[0.02] p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SquaresFour size={14} className="text-emerald-300" />
              <h4 className="text-sm font-medium text-text-inverse">
                {pillar.name}
              </h4>
            </div>
            <span className="font-mono text-[10px] text-text-inverse-subtlest">
              P{String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-text-inverse-subtle">
            {pillar.description}
          </p>
          <div className="mt-auto rounded-sm bg-white/[0.04] px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
              Example post
            </p>
            <p className="mt-1 text-xs italic leading-relaxed text-text-inverse-subtle">
              {pillar.examplePost}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Format system — named format rows                                   */
/* ------------------------------------------------------------------ */

function FormatSystemBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "format-system" }>;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white/[0.02]">
      <div className="border-b border-line px-5 py-3">
        <SectionEyebrow
          icon={<Stack size={14} className="text-text-inverse-subtle" />}
          label="Repeatable formats"
        />
      </div>
      {block.formats.map((format) => (
        <div
          key={format.name}
          className="grid gap-1 border-b border-line/50 px-5 py-3.5 last:border-b-0 sm:grid-cols-[200px_1fr]"
        >
          <div>
            <p className="text-sm font-medium text-text-inverse">
              {format.name}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-text-inverse-subtlest">
              {format.platform}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-text-inverse-subtle sm:pt-0.5">
            {format.role}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cadence — quarterly rhythm grid                                     */
/* ------------------------------------------------------------------ */

function CadenceBlock({
  block,
}: {
  block: Extract<TrackContentBlock, { kind: "cadence" }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {block.entries.map((entry) => (
        <div
          key={entry.period}
          className="rounded-md border border-line bg-white/[0.02] p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-text-inverse-subtlest">
              {entry.period}
            </span>
            <CalendarBlank size={13} className="text-text-inverse-subtlest" />
          </div>
          <h4 className="mt-1.5 text-sm font-medium text-text-inverse">
            {entry.theme}
          </h4>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {entry.beats.map((beat) => (
              <li
                key={beat}
                className="flex gap-2 text-xs leading-relaxed text-text-inverse-subtle"
              >
                <span className="mt-[6px] size-1 shrink-0 rounded-full bg-text-inverse-subtlest" />
                {beat}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
