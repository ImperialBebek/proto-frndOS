/** Multi-option brief variants — IKEA has 3 lensed options; others fall back to one. */

import {
  DEFAULT_CASE_ID,
  IKEA_DECODE,
  PITCH_CASES,
  type BriefOptionId,
  type PitchBriefOption,
  type PitchCaseDecode,
} from "@/data/pitchStatic";

function cloneSections(
  sections: PitchCaseDecode["businessBrief"]
): PitchCaseDecode["businessBrief"] {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({ ...field })),
  }));
}

function cloneStakeholders(
  stakeholders: PitchCaseDecode["stakeholders"]
): PitchCaseDecode["stakeholders"] {
  return stakeholders.map((person) => ({ ...person }));
}

function cloneAngles(
  angles: PitchCaseDecode["winningAngles"]
): PitchCaseDecode["winningAngles"] {
  return angles.map((angle) => ({ ...angle }));
}

function setField(
  sections: PitchCaseDecode["businessBrief"],
  sectionId: string,
  label: string,
  value: string,
  needsInfo?: boolean
) {
  const section = sections.find((item) => item.id === sectionId);
  const field = section?.fields.find((item) => item.label === label);
  if (!field) return;
  field.value = value;
  if (needsInfo !== undefined) field.needsInfo = needsInfo;
}

function wrapDecodeAsOption(
  decode: PitchCaseDecode,
  id: BriefOptionId = "balanced"
): PitchBriefOption {
  return {
    id,
    lens: "Balanced",
    descriptor: "Faithful interpretation of the client brief.",
    fitScore: 80,
    briefEssence: decode.briefEssence,
    projectType: decode.projectType,
    businessBrief: cloneSections(decode.businessBrief),
    stakeholders: cloneStakeholders(decode.stakeholders),
    winningAngles: cloneAngles(decode.winningAngles),
  };
}

/** IKEA FY27 — three strategic lenses derived from the canonical decode */
const IKEA_BRIEF_OPTIONS: PitchBriefOption[] = (() => {
  const balanced = wrapDecodeAsOption(IKEA_DECODE, "balanced");
  balanced.lens = "Balanced";
  balanced.descriptor =
    "Faithful read of the brief with proven pitch-winning tactics — platform ambition without overreaching.";
  balanced.fitScore = 85;

  const safeSections = cloneSections(IKEA_DECODE.businessBrief);
  setField(
    safeSections,
    "business",
    "Objective",
    "Defend IKEA's position as the trusted home-furnishing partner for Indonesian families through catalogue-led moments and proven retail activation."
  );
  setField(
    safeSections,
    "business",
    "Strategy",
    "Lean on seasonal catalogue peaks (Ramadan, back-to-school) and in-store experience upgrades rather than a new brand platform."
  );
  setField(
    safeSections,
    "product",
    "Key Message",
    "IKEA makes every square metre work harder — practical solutions families already trust."
  );
  setField(
    safeSections,
    "pitch",
    "Success Criteria",
    "Measurable store-visit lift within FY27, content the in-house team can run without agency dependency, zero brand-guideline risk."
  );
  setField(
    safeSections,
    "people",
    "Insights",
    "Families prioritise reliability and value over bold repositioning; they want IKEA to feel closer, not different."
  );

  const safeStakeholders = cloneStakeholders(IKEA_DECODE.stakeholders);
  safeStakeholders[0] = {
    ...safeStakeholders[0],
    winningHook:
      "Show a 12-month catalogue calendar that compounds — every KV ties back to store traffic, not a one-off platform idea.",
  };
  safeStakeholders[1] = {
    ...safeStakeholders[1],
    winningHook:
      "Lead with FY26 benchmark data and a conservative ROI model — prove the safe path still moves the needle.",
  };

  const safeAngles: PitchBriefOption["winningAngles"] = [
    {
      id: "catalogue-compound",
      angle:
        "Propose a 'Catalogue as Platform' — each seasonal drop builds on the last with a single visual system, no risky repositioning.",
      linkedStakeholderId: "andika",
      rationale:
        "Andika needs defendable multi-year thinking; a catalogue system is low-risk but still feels strategic.",
    },
    {
      id: "store-first",
      angle:
        "Pitch a store-visit guarantee model tied to Ramadan footfall — commit to measurable retail outcomes before any brand film.",
      linkedStakeholderId: "rina",
      rationale: "Rina signs on ROI; leading with retail proof matches her decision criteria.",
    },
  ];

  const safe: PitchBriefOption = {
    id: "safe",
    lens: "Safe",
    descriptor:
      "Low-risk, catalogue-led approach that defends store traffic without stretching beyond the brief.",
    fitScore: 72,
    briefEssence: "Ruang yang Familiar, Setiap Hari",
    projectType: "Seasonal Campaigns + Retail Activation",
    businessBrief: safeSections,
    stakeholders: safeStakeholders,
    winningAngles: safeAngles,
  };

  const boldSections = cloneSections(IKEA_DECODE.businessBrief);
  setField(
    boldSections,
    "business",
    "Objective",
    "Turn IKEA Indonesia into the cultural symbol of 'growing families in small spaces' — own a territory no competitor can copy."
  );
  setField(
    boldSections,
    "business",
    "Business Opportunity",
    "73% of urban families under 90m² is a cultural truth, not a product claim — IKEA can own the conversation about growth in constraint."
  );
  setField(
    boldSections,
    "business",
    "Strategy",
    "Launch a multi-year 'Growth Platform' with a physical device, UGC engine, and retail ritual — beyond catalogue, beyond campaign."
  );
  setField(
    boldSections,
    "product",
    "Brand",
    "Reframe IKEA from distant Scandinavian showroom to the brand that celebrates Indonesian family growth — emotionally indispensable."
  );
  setField(
    boldSections,
    "product",
    "Key Message",
    "Ruang kecil, tumbuh besar — every centimetre is a chapter in your family's story."
  );
  setField(
    boldSections,
    "pitch",
    "Creative Considerations",
    "Bold, warm, culturally rooted. Reference local family rituals, not UK tonality. Consider a launch device families keep for years."
  );

  const boldStakeholders = cloneStakeholders(IKEA_DECODE.stakeholders);
  boldStakeholders[0] = {
    ...boldStakeholders[0],
    motivation:
      "Wants IKEA Indonesia to be known for original thinking at regional — a platform that travels, not a local campaign.",
    winningHook:
      "Present the 'Growth Ruler' as a 3-year platform device with regional rollout potential — make him the architect of IKEA's Indonesian IP.",
  };

  const boldAngles: PitchBriefOption["winningAngles"] = [
    {
      id: "growth-ruler-platform",
      angle:
        "Build the entire pitch around the 'Growth Ruler' — a physical artefact families keep for years, with annual IKEA rituals tied to marking height.",
      linkedStakeholderId: "andika",
      rationale:
        "Beyond the brief but directly serves the 'room to grow' essence; creates ownable IP Andika can defend regionally.",
    },
    {
      id: "ugc-engine",
      angle:
        "Propose a UGC 'Mark the Moment' engine — parents film kids against the ruler, IKEA curates the best stories into always-on content.",
      linkedStakeholderId: "rina",
      rationale:
        "Content engine the brief asks for, but powered by real families — high engagement, measurable social proof.",
    },
    {
      id: "retail-ritual",
      angle:
        "Design an in-store 'Growth Day' annual event — families visit IKEA to mark heights, driving footfall through emotional ritual not discount.",
      rationale:
        "Connects platform to store visits without relying on price promotions — answers Rina's ROI need creatively.",
    },
  ];

  const bold: PitchBriefOption = {
    id: "bold",
    lens: "Bold",
    descriptor:
      "Ambitious platform play with beyond-brief tactics — higher upside, needs budget flexibility the client hinted at.",
    fitScore: 58,
    briefEssence: "Sediakan Ruang Untuk Bertumbuh — Sepenuhnya",
    projectType: "Multi-Year Growth Platform + Cultural Launch",
    businessBrief: boldSections,
    stakeholders: boldStakeholders,
    winningAngles: boldAngles,
  };

  return [safe, balanced, bold];
})();

export function getBriefOptions(caseId: string | undefined): PitchBriefOption[] {
  const id = caseId ?? DEFAULT_CASE_ID;
  if (id === "ikea") return IKEA_BRIEF_OPTIONS;
  const decode =
    PITCH_CASES[id]?.decode ?? PITCH_CASES[DEFAULT_CASE_ID].decode;
  return [wrapDecodeAsOption(decode)];
}

export function getBriefOptionById(
  caseId: string | undefined,
  optionId: BriefOptionId
): PitchBriefOption {
  const options = getBriefOptions(caseId);
  return options.find((option) => option.id === optionId) ?? options[0];
}

export { IKEA_BRIEF_OPTIONS };
