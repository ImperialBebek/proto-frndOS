"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CaretDown,
  ChatCircle,
  Check,
  CheckCircle,
  MagicWand,
} from "@phosphor-icons/react";
import { useAgents } from "@/context/AgentsProvider";
import {
  buildSpecialistSuggestion,
  getBrandAccessPresentation,
  getTeamSpecialistById,
  getTemplateById,
  personaColorOptions,
  personaIconOptions,
  toneOptions,
  workspaceBrands,
  type Agent,
  type BrandAccessMode,
  type PersonaIconId,
  type Surface,
  type TemplateSource,
  type ToneId,
  type WorkTypeId,
  workTypeOptions,
} from "@/data/agentsStatic";
import { AGENTS_HOME_PATH } from "@/lib/agentsRoutes";
import { PersonaAvatar } from "./PersonaAvatar";
import { SpecialistPreview } from "./SpecialistPreview";
import { WizardStepper, type WizardStep } from "./WizardStepper";

type AgentsBuilderPageProps = {
  onAskFrndOpen: (message?: string, agentId?: string) => void;
};

const categories = ["Strategy", "Research", "Content", "Analytics", "Other"] as const;

function TogglePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
        active
          ? "border-white/30 bg-white text-black"
          : "border-line bg-white/[0.03] text-text-inverse-subtle hover:border-white/20 hover:text-text-inverse"
      }`}
    >
      {label}
    </button>
  );
}

function RadioCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border p-4 text-left transition ${
        active
          ? "border-white/30 bg-white/10"
          : "border-line bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
            active ? "border-white bg-white" : "border-line"
          }`}
        >
          {active && <Check size={12} weight="bold" className="text-black" />}
        </div>
        <div>
          <p className="text-sm font-medium text-text-inverse">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-inverse-subtlest">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function inferWorkTypeId(role: string): WorkTypeId {
  const lowered = role.toLowerCase();

  if (lowered.includes("research")) return "research";
  if (lowered.includes("copy") || lowered.includes("content") || lowered.includes("narrative")) {
    return "content";
  }
  if (lowered.includes("report") || lowered.includes("analyst")) return "reporting";
  if (lowered.includes("orchestrator")) return "orchestration";
  if (lowered.includes("engineer")) return "engineering";
  return "strategy";
}

export function AgentsBuilderPage({ onAskFrndOpen }: AgentsBuilderPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    starterTemplates,
    workspaceTemplates,
    teamSpecialists,
    skills,
    addTeamSpecialist,
    updateTeamSpecialist,
  } = useAgents();

  const editId = searchParams.get("edit");
  const templateId = searchParams.get("template");
  const sourceParam = searchParams.get("source") as TemplateSource | null;

  const selectedTemplate = useMemo(() => {
    if (!templateId) return undefined;
    const sourceTemplates =
      sourceParam === "workspace" ? workspaceTemplates : starterTemplates;
    return getTemplateById(templateId, sourceTemplates);
  }, [templateId, sourceParam, starterTemplates, workspaceTemplates]);

  const editingSpecialist = useMemo(
    () => (editId ? getTeamSpecialistById(editId, teamSpecialists) : undefined),
    [editId, teamSpecialists]
  );

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [savedSpecialistId, setSavedSpecialistId] = useState<string | null>(null);

  const [workTypeId, setWorkTypeId] = useState<WorkTypeId>("strategy");
  const [toneId, setToneId] = useState<ToneId>("direct");
  const [brief, setBrief] = useState("");
  const [brandAccessMode, setBrandAccessMode] = useState<BrandAccessMode>("later");
  const [brandAccessIds, setBrandAccessIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [behaviorSummary, setBehaviorSummary] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<Surface[]>(["AskFrnd"]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [avatarIcon, setAvatarIcon] = useState<PersonaIconId>("Bot");
  const [accentColor, setAccentColor] = useState("#757D90");
  const [sourceTemplateId, setSourceTemplateId] = useState<string | undefined>();
  const [sourceTemplateSource, setSourceTemplateSource] =
    useState<TemplateSource>("custom");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (editingSpecialist) {
      setWorkTypeId(inferWorkTypeId(editingSpecialist.role));
      setToneId("direct");
      setBrief("");
      setBrandAccessMode(editingSpecialist.brandAccessMode);
      setBrandAccessIds(editingSpecialist.brandAccessIds);
      setName(editingSpecialist.name);
      setRole(editingSpecialist.role);
      setDescription(editingSpecialist.description);
      setBehaviorSummary(editingSpecialist.behaviorSummary);
      setSelectedSkillIds(editingSpecialist.skills);
      setSelectedSurfaces(editingSpecialist.surfaces);
      setSystemPrompt(editingSpecialist.systemPrompt);
      setAvatarIcon(editingSpecialist.avatarIcon ?? "Bot");
      setAccentColor(editingSpecialist.accentColor ?? editingSpecialist.brandColor);
      setSourceTemplateId(editingSpecialist.sourceTemplateId);
      setSourceTemplateSource(editingSpecialist.sourceTemplateSource ?? "custom");
      setHasGenerated(true);
      return;
    }

    if (selectedTemplate) {
      const inferredWorkType = inferWorkTypeId(selectedTemplate.role);
      const suggestion = buildSpecialistSuggestion({
        template: selectedTemplate,
        workTypeId: inferredWorkType,
        toneId: "direct",
        brief: "",
      });

      setWorkTypeId(inferredWorkType);
      setBrandAccessMode("later");
      setBrandAccessIds([]);
      setName(suggestion.name);
      setRole(suggestion.role);
      setDescription(suggestion.description);
      setBehaviorSummary(suggestion.behaviorSummary);
      setSelectedSkillIds(suggestion.selectedSkillIds);
      setSelectedSurfaces(suggestion.surfaces);
      setSystemPrompt(suggestion.systemPrompt);
      setAvatarIcon(selectedTemplate.avatarIcon);
      setAccentColor(selectedTemplate.accentColor);
      setSourceTemplateId(selectedTemplate.id);
      setSourceTemplateSource(selectedTemplate.source);
      setHasGenerated(true);
      return;
    }

    setWorkTypeId("strategy");
    setToneId("direct");
    setBrief("");
    setBrandAccessMode("later");
    setBrandAccessIds([]);
    setName("");
    setRole("");
    setDescription("");
    setBehaviorSummary("");
    setSelectedSkillIds([]);
    setSelectedSurfaces(["AskFrnd"]);
    setSystemPrompt("");
    setAvatarIcon("Bot");
    setAccentColor("#757D90");
    setSourceTemplateId(undefined);
    setSourceTemplateSource("custom");
    setHasGenerated(false);
  }, [editingSpecialist, selectedTemplate]);

  const pageTitle = editingSpecialist
    ? "Edit specialist"
    : selectedTemplate
      ? "Start with this specialist"
      : "New specialist";

  const pageDescription = editingSpecialist
    ? "Tune this specialist for your team, brand scope, and workflow."
    : selectedTemplate
      ? "Use this template as a starting point, then tune it before it joins your team."
      : "Start with the work this specialist should help with. frndOS will suggest the rest.";

  const canSave =
    name.trim().length > 0 &&
    role.trim().length > 0 &&
    description.trim().length > 0 &&
    behaviorSummary.trim().length > 0 &&
    systemPrompt.trim().length > 0 &&
    selectedSkillIds.length > 0 &&
    selectedSurfaces.length > 0 &&
    (brandAccessMode !== "selected" || brandAccessIds.length > 0);

  const applySuggestion = () => {
    const suggestion = buildSpecialistSuggestion({
      template: selectedTemplate,
      workTypeId,
      toneId,
      brief,
    });

    setName((current) => current || suggestion.name);
    setRole(suggestion.role);
    setDescription(suggestion.description);
    setBehaviorSummary(suggestion.behaviorSummary);
    setSelectedSkillIds(suggestion.selectedSkillIds);
    setSelectedSurfaces(suggestion.surfaces);
    setSystemPrompt(suggestion.systemPrompt);
    setSourceTemplateId(selectedTemplate?.id);
    setSourceTemplateSource(selectedTemplate?.source ?? "custom");
    if (selectedTemplate) {
      setAvatarIcon(selectedTemplate.avatarIcon);
      setAccentColor(selectedTemplate.accentColor);
    }
    setHasGenerated(true);
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((value) => value !== skillId)
        : [...current, skillId]
    );
  };

  const toggleSurface = (surface: Surface) => {
    setSelectedSurfaces((current) =>
      current.includes(surface)
        ? current.filter((value) => value !== surface)
        : [...current, surface]
    );
  };

  const toggleBrand = (brandId: string) => {
    setBrandAccessIds((current) =>
      current.includes(brandId)
        ? current.filter((value) => value !== brandId)
        : [...current, brandId]
    );
  };

  const handleSave = (nextStatus: Agent["status"]) => {
    const presentation = getBrandAccessPresentation(
      brandAccessMode,
      brandAccessIds,
      accentColor
    );
    const createdAt =
      editingSpecialist?.createdAt ?? new Date().toISOString().split("T")[0];
    const specialistId = editingSpecialist?.id ?? `specialist-${Date.now()}`;

    const specialist: Agent = {
      id: specialistId,
      name: name.trim(),
      description: description.trim(),
      role: role.trim(),
      type: "custom",
      brandName: presentation.brandName,
      brandColor: presentation.brandColor,
      avatarIcon,
      accentColor,
      skills: selectedSkillIds,
      status: nextStatus,
      lastInvokedAt: editingSpecialist?.lastInvokedAt ?? null,
      createdAt,
      systemPrompt: systemPrompt.trim(),
      sourceTemplateId,
      sourceTemplateSource,
      brandAccessMode,
      brandAccessIds,
      behaviorSummary: behaviorSummary.trim(),
      surfaces: selectedSurfaces,
    };

    if (editingSpecialist) {
      updateTeamSpecialist(specialist);
      router.push(AGENTS_HOME_PATH);
      return;
    }

    addTeamSpecialist(specialist);
    setSavedSpecialistId(specialistId);
    setCurrentStep(4);
  };

  const canContinueStep1 =
    workTypeId.length > 0 && toneId.length > 0;

  const handleContinue = () => {
    if (currentStep === 1) {
      applySuggestion();
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(4);
      setShowMobilePreview(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !savedSpecialistId) {
      setCurrentStep((step) => (step - 1) as WizardStep);
    }
  };

  const showPreviewPanel = currentStep >= 1 && !savedSpecialistId;

  const stepContent = () => {
    if (savedSpecialistId) {
      return (
        <div className="rounded-[28px] border border-[#252525] bg-[#121212] p-8 text-center">
          <CheckCircle
            size={48}
            weight="fill"
            className="mx-auto text-emerald-400"
          />
          <h2 className="mt-4 text-xl font-medium text-text-inverse">
            {name} joined your team
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-inverse-subtle">
            Your specialist is ready. Chat in Ask Frnd to try focused,
            role-based help right away.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                savedSpecialistId &&
                onAskFrndOpen(undefined, savedSpecialistId)
              }
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <ChatCircle size={16} />
              Chat in Ask Frnd
            </button>
            <Link
              href={AGENTS_HOME_PATH}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-text-inverse transition hover:bg-white/10"
            >
              Back to Agents
            </Link>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#686868]">
              Step 1
            </p>
            <h2 className="mt-2 text-lg font-medium text-white">Shape the persona</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7A7A7A]">
              Start with the work and tone. frndOS will suggest the role and
              behavior when you continue.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Work type</p>
            <div className="flex flex-wrap gap-2">
              {workTypeOptions.map((option) => (
                <TogglePill
                  key={option.id}
                  active={workTypeId === option.id}
                  label={option.label}
                  onClick={() => setWorkTypeId(option.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Tone</p>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((option) => (
                <TogglePill
                  key={option.id}
                  active={toneId === option.id}
                  label={option.label}
                  onClick={() => setToneId(option.id)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#D1D1D1]">
                Specialist name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Brand Strategist"
                className="w-full rounded-2xl border border-[#2B2B2B] bg-[#141414] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#4B4B4B]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#D1D1D1]">
                Role
              </label>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. Brand Strategist"
                className="w-full rounded-2xl border border-[#2B2B2B] bg-[#141414] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#4B4B4B]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#D1D1D1]">
              What this specialist helps with
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Describe the outcome this specialist should help your team achieve."
              className="w-full resize-none rounded-2xl border border-[#2B2B2B] bg-[#141414] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#4B4B4B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#D1D1D1]">
              Optional short brief
            </label>
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              rows={3}
              placeholder="e.g. Help me turn weekly media performance into short client-ready summaries."
              className="w-full resize-none rounded-2xl border border-[#2B2B2B] bg-[#141414] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#555] focus:border-[#4B4B4B]"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Icon</p>
            <div className="flex flex-wrap gap-2">
              {personaIconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setAvatarIcon(icon)}
                  className={`rounded-xl border p-2 transition ${
                    avatarIcon === icon
                      ? "border-white/30 bg-white/10"
                      : "border-[#2B2B2B] bg-[#141414] hover:border-[#444]"
                  }`}
                >
                  <PersonaAvatar icon={icon} accentColor={accentColor} size="sm" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Accent color</p>
            <div className="flex flex-wrap gap-2">
              {personaColorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    accentColor === color ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#686868]">
              Step 2
            </p>
            <h2 className="mt-2 text-lg font-medium text-white">Set scope</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7A7A7A]">
              Control which brands and frndOS surfaces this specialist can work
              with.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Brand access</p>
            <div className="grid gap-3 md:grid-cols-3">
              <RadioCard
                active={brandAccessMode === "all"}
                title="All brands"
                description="This specialist can work across every brand in this workspace."
                onClick={() => setBrandAccessMode("all")}
              />
              <RadioCard
                active={brandAccessMode === "selected"}
                title="Selected brands"
                description="Pick the brands this specialist should be able to work with."
                onClick={() => setBrandAccessMode("selected")}
              />
              <RadioCard
                active={brandAccessMode === "later"}
                title="Decide later"
                description="Keep momentum now and come back to brand scope when you need it."
                onClick={() => setBrandAccessMode("later")}
              />
            </div>

            {brandAccessMode === "selected" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {workspaceBrands.map((brand) => {
                  const active = brandAccessIds.includes(brand.id);
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleBrand(brand.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-[#2B2B2B] bg-[#161616] text-[#B5B5B5] hover:border-[#444] hover:text-white"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: brand.color }}
                      />
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Surfaces</p>
            <div className="flex flex-wrap gap-2">
              {["AskFrnd", "Research", "Reports", "KV"].map((surface) => {
                const selected = selectedSurfaces.includes(surface as Surface);
                return (
                  <TogglePill
                    key={surface}
                    active={selected}
                    label={surface}
                    onClick={() => toggleSurface(surface as Surface)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#686868]">
                Step 3
              </p>
              <h2 className="mt-2 text-lg font-medium text-white">
                Tune capabilities
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A7A]">
                Review the suggested skills and behavior before adding to your
                team.
              </p>
            </div>
            <button
              type="button"
              onClick={applySuggestion}
              className="inline-flex items-center gap-2 rounded-full border border-[#333] px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
            >
              <MagicWand size={14} />
              Refresh suggestion
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#D1D1D1]">
              Behavior summary
            </label>
            <textarea
              value={behaviorSummary}
              onChange={(event) => setBehaviorSummary(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-[#2B2B2B] bg-[#141414] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4B4B4B]"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[#D1D1D1]">Capabilities</p>
            <div className="space-y-4">
              {categories.map((category) => {
                const categorySkills = skills.filter(
                  (skill) => skill.category === category
                );

                if (categorySkills.length === 0) return null;

                return (
                  <div key={category}>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#656565]">
                      {category}
                    </p>
                    <div className="grid gap-2">
                      {categorySkills.map((skill) => {
                        const selected = selectedSkillIds.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                              selected
                                ? "border-white/30 bg-white/10"
                                : "border-[#262626] bg-[#141414] hover:border-[#3A3A3A]"
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                selected
                                  ? "border-white bg-white"
                                  : "border-[#444]"
                              }`}
                            >
                              {selected && (
                                <Check size={12} weight="bold" className="text-black" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white">
                                  {skill.name}
                                </span>
                                {skill.type === "custom" && (
                                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[#B8B8B8]">
                                    Custom
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[11px] text-[#6E6E6E]">
                                {skill.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#141414]">
            <button
              type="button"
              onClick={() => setShowAdvanced((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  Advanced instructions
                </p>
                <p className="mt-1 text-xs text-[#707070]">
                  Hidden by default. Open only if you want to inspect or refine
                  the generated instructions.
                </p>
              </div>
              <CaretDown
                size={16}
                className={`text-text-inverse-subtlest transition ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>
            {showAdvanced && (
              <div className="border-t border-[#262626] px-4 py-4">
                <textarea
                  value={systemPrompt}
                  onChange={(event) => setSystemPrompt(event.target.value)}
                  rows={8}
                  className="w-full resize-none rounded-2xl border border-[#2B2B2B] bg-[#101010] px-4 py-3 text-sm text-white outline-none transition focus:border-[#4B4B4B]"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#686868]">
            Step 4
          </p>
          <h2 className="mt-2 text-lg font-medium text-white">Preview and add</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7A7A7A]">
            Try a few sample prompts, then add this specialist to your team.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#262626] bg-[#141414] p-4">
          <PersonaAvatar icon={avatarIcon} accentColor={accentColor} />
          <div>
            <p className="text-sm font-medium text-white">
              {name || "Your specialist"}
            </p>
            <p className="mt-1 text-xs text-[#8A8A8A]">{role || "Role"}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#B0B0B0]">
              {description || "Description will appear here."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSurfaces.map((surface) => (
                <span
                  key={surface}
                  className="rounded-full border border-[#2B2B2B] bg-[#171717] px-2.5 py-1 text-[10px] font-medium text-[#B3B3B3]"
                >
                  {surface}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#6A6A6A] xl:hidden">
          Open the Preview tab below to test this specialist before adding it to
          your team.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
      <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <Link
          href={AGENTS_HOME_PATH}
          className="mb-3 inline-flex items-center gap-1 text-xs text-text-inverse-subtle transition hover:text-text-inverse"
        >
          <ArrowLeft size={12} />
          Back to agents
        </Link>
        <h1 className="text-3xl font-semibold text-text-inverse">{pageTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-inverse-subtlest">
          {pageDescription}
        </p>
      </div>

      {!savedSpecialistId && (
        <div className="mb-6">
          <WizardStepper
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) setCurrentStep(step);
            }}
          />
        </div>
      )}

      <div className="mb-4 flex gap-2 xl:hidden">
        <button
          type="button"
          onClick={() => setShowMobilePreview(false)}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
            !showMobilePreview
              ? "border-white/30 bg-white text-black"
              : "border-[#2B2B2B] bg-[#141414] text-[#B5B5B5]"
          }`}
        >
          Configure
        </button>
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
            showMobilePreview
              ? "border-white/30 bg-white text-black"
              : "border-[#2B2B2B] bg-[#141414] text-[#B5B5B5]"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section
          className={`rounded-[28px] border border-[#252525] bg-[#121212] p-6 ${
            showMobilePreview ? "hidden xl:block" : ""
          }`}
        >
          {stepContent()}
        </section>

        {showPreviewPanel && (
          <section
            className={`${showMobilePreview ? "block" : "hidden"} xl:block`}
          >
            <SpecialistPreview
              name={name}
              role={role}
              behaviorSummary={behaviorSummary}
              toneId={toneId}
              avatarIcon={avatarIcon}
              accentColor={accentColor}
              expanded
            />
          </section>
        )}
      </div>

      {!savedSpecialistId && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6A6A6A]">
            Workspace scope is implicit. Brand access only controls which brands
            this specialist can work with inside this workspace.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={AGENTS_HOME_PATH}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-text-inverse-subtle transition hover:bg-white/15"
            >
              Cancel
            </Link>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-[#333] px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Back
              </button>
            )}
            {currentStep < 4 && (
              <button
                type="button"
                onClick={handleContinue}
                disabled={currentStep === 1 && !canContinueStep1}
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            )}
            {currentStep === 4 && hasGenerated && (
              <>
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  disabled={!canSave}
                  className="rounded-full border border-[#333] px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("active")}
                  disabled={!canSave}
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {editingSpecialist ? "Update specialist" : "Add to team"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
