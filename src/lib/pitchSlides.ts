/** PROTOTYPE Pitch export slide assembler — builds the printable deck from approved outputs */

import {
  IKEA_DECODE,
  PITCH_TRACK_TYPE_LABEL,
  WORK_TRACK_STEPS,
  getTrackSubStepOutput,
  getTrackSubStepsForDef,
  type PitchListItem,
  type PitchStepDef,
  type TrackContentBlock,
} from "@/data/pitchStatic";

export type SlideBullet = {
  label?: string;
  text: string;
  detail?: string;
};

export type SlideSection = {
  title?: string;
  body?: string;
  bullets?: readonly SlideBullet[];
};

export type SlideDef =
  | {
      kind: "cover";
      brand: string;
      initials: string;
      project: string;
      essence: string;
      deadline: string;
      preparedBy: string;
    }
  | {
      kind: "statement";
      eyebrow: string;
      statement: string;
      support?: string;
      meta?: string;
    }
  | {
      kind: "list";
      eyebrow: string;
      title: string;
      intro?: string;
      items: readonly SlideBullet[];
      twoColumn?: boolean;
    }
  | {
      kind: "gwtb";
      eyebrow: string;
      title: string;
      rows: readonly { label: string; hint: string; text: string }[];
      proposition: string;
    }
  | {
      kind: "track-summary";
      eyebrow: string;
      title: string;
      summary: string;
      subStepLabels: readonly string[];
      trackIndex: number;
      trackTotal: number;
    }
  | {
      kind: "blocks";
      eyebrow: string;
      title: string;
      intro?: string;
      sections: readonly SlideSection[];
    }
  | {
      kind: "closing";
      title: string;
      essence: string;
      nextSteps: readonly SlideBullet[];
      submission: string;
      preparedBy: string;
    };

const PREPARED_BY = "Prepared by frndOS · Maleo";

/** Flatten a rich track content block into slide-friendly sections */
function blockToSections(block: TrackContentBlock): SlideSection[] {
  switch (block.kind) {
    case "kv-concept":
      return [
        { title: "Headline", body: block.headline },
        { title: "Tagline", body: block.tagline },
        { title: "Key visual", body: block.visual },
        {
          title: "Art direction",
          bullets: block.artDirection.map((text) => ({ text })),
        },
      ];
    case "campaign-plan":
      return [
        { title: "Objective", body: block.objective },
        { title: "Audience moment", body: block.audienceMoment },
        {
          title: "Channel mix",
          bullets: block.channelMix.map((text) => ({ text })),
        },
        {
          title: "Phasing",
          bullets: block.phases.map((phase) => ({
            label: `${phase.phase} · ${phase.window}`,
            text: phase.focus,
          })),
        },
      ];
    case "channel-rollout":
      return [
        {
          title: "Channel adaptations",
          bullets: block.adaptations.map((adaptation) => ({
            label: adaptation.channel,
            text: adaptation.note,
            detail: adaptation.format,
          })),
        },
      ];
    case "positioning":
      return [
        { title: "Territory", body: block.territory },
        {
          title: "Pillars",
          bullets: block.pillars.map((pillar) => ({
            label: pillar.name,
            text: pillar.description,
          })),
        },
      ];
    case "visual-system":
      return [
        {
          title: "Visual elements",
          bullets: block.elements.map((element) => ({
            label: element.element,
            text: element.direction,
          })),
        },
      ];
    case "voice":
      return [
        {
          title: "Voice principles",
          bullets: block.principles.map((principle) => ({
            label: principle.name,
            text: principle.description,
          })),
        },
        {
          title: "Example lines",
          bullets: block.exampleLines.map((text) => ({ text })),
        },
      ];
    case "content-pillars":
      return [
        {
          title: "Pillars",
          bullets: block.pillars.map((pillar) => ({
            label: pillar.name,
            text: pillar.description,
            detail: pillar.examplePost,
          })),
        },
      ];
    case "format-system":
      return [
        {
          title: "Formats",
          bullets: block.formats.map((format) => ({
            label: format.name,
            text: format.role,
            detail: format.platform,
          })),
        },
      ];
    case "cadence":
      return [
        {
          title: "Cadence",
          bullets: block.entries.map((entry) => ({
            label: `${entry.period} — ${entry.theme}`,
            text: entry.beats.join(" · "),
          })),
        },
      ];
  }
}

export function buildPitchSlides(
  pitch: PitchListItem,
  approvedStepIds: readonly string[],
  trackSteps: readonly PitchStepDef[] = WORK_TRACK_STEPS
): SlideDef[] {
  const approved = new Set(approvedStepIds);
  const slides: SlideDef[] = [];
  const { deliverables } = IKEA_DECODE.pitchPlan;

  slides.push({
    kind: "cover",
    brand: pitch.brand,
    initials: pitch.logoInitials,
    project: pitch.project,
    essence: IKEA_DECODE.briefEssence,
    deadline: pitch.deadline,
    preparedBy: PREPARED_BY,
  });

  slides.push({
    kind: "statement",
    eyebrow: "Brief essence",
    statement: `“${IKEA_DECODE.briefEssence}”`,
    support: `Decoded from ${IKEA_DECODE.briefFileName} — ${IKEA_DECODE.projectType}.`,
  });

  slides.push({
    kind: "list",
    eyebrow: "Pitch plan",
    title: IKEA_DECODE.pitchPlan.headline,
    intro: IKEA_DECODE.pitchPlan.note,
    items: deliverables.map((deliverable) => ({
      label: deliverable.title,
      text: deliverable.summary,
      detail: PITCH_TRACK_TYPE_LABEL[deliverable.type],
    })),
    twoColumn: true,
  });

  slides.push({
    kind: "list",
    eyebrow: "Foundation · Research 4C",
    title: "Four signals ground the strategy",
    items: IKEA_DECODE.research4C.map((card) => ({
      label: `${card.title} — ${card.subtitle}`,
      text: card.insight,
      detail: card.takeaway,
    })),
    twoColumn: true,
  });

  slides.push({
    kind: "gwtb",
    eyebrow: "Foundation · Comm strategy",
    title: "GWTB strategy",
    rows: [
      { label: "Get", hint: "the audience", text: IKEA_DECODE.commStrategy.get },
      { label: "Who", hint: "currently think", text: IKEA_DECODE.commStrategy.who },
      { label: "To", hint: "instead believe", text: IKEA_DECODE.commStrategy.to },
      { label: "By", hint: "convincing them", text: IKEA_DECODE.commStrategy.by },
    ],
    proposition: IKEA_DECODE.commStrategy.proposition,
  });

  const selectedIdea =
    IKEA_DECODE.bigIdeas.find((idea) => idea.selected) ?? IKEA_DECODE.bigIdeas[0];
  slides.push({
    kind: "statement",
    eyebrow: "Foundation · Big idea",
    statement: selectedIdea.title,
    support: selectedIdea.premise,
    meta: `Locked big idea · O.R.A.C.L.E. ${selectedIdea.score.toFixed(1)} / 5`,
  });

  const trackTotal = trackSteps.length;
  trackSteps.forEach((track, index) => {
    if (!approved.has(track.id)) return;
    const deliverable = deliverables.find((item) => item.stepId === track.id);
    const subSteps = getTrackSubStepsForDef(track);
    const typeLabel = track.trackType
      ? PITCH_TRACK_TYPE_LABEL[track.trackType]
      : "Work track";

    slides.push({
      kind: "track-summary",
      eyebrow: typeLabel,
      title: deliverable?.title ?? track.label,
      summary: deliverable?.summary ?? track.summary,
      subStepLabels: subSteps.map((sub) => sub.label),
      trackIndex: index + 1,
      trackTotal,
    });

    for (const sub of subSteps) {
      const output = getTrackSubStepOutput(track.id, sub.id, track.trackType);
      if (!output) continue;
      slides.push({
        kind: "blocks",
        eyebrow: `${deliverable?.title ?? track.label} · ${sub.label}`,
        title: output.heading,
        intro: output.intro,
        sections: output.blocks.flatMap((block) => blockToSections(block)),
      });
    }
  });

  const logistics = IKEA_DECODE.businessBrief.find(
    (section) => section.id === "logistics"
  );
  const timeline = logistics?.fields.find((field) =>
    field.label.startsWith("Timeline")
  )?.value;
  const milestones = timeline
    ? timeline
        .replace(/\.\s*$/, "")
        .split("·")
        .map((part) => part.trim())
        .filter(Boolean)
    : [];
  const submission =
    milestones.find((part) => /submission|presentation/i.test(part)) ??
    `Due ${pitch.deadline}`;

  slides.push({
    kind: "closing",
    title: "Next steps",
    essence: IKEA_DECODE.briefEssence,
    nextSteps:
      milestones.length > 0
        ? milestones.map((text) => ({ text }))
        : [{ text: `Final presentation due ${pitch.deadline}` }],
    submission,
    preparedBy: PREPARED_BY,
  });

  return slides;
}
