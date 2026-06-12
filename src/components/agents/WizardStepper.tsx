import { Check } from "@phosphor-icons/react";

export type WizardStep = 1 | 2 | 3 | 4;

const steps: { id: WizardStep; label: string }[] = [
  { id: 1, label: "Persona" },
  { id: 2, label: "Scope" },
  { id: 3, label: "Capabilities" },
  { id: 4, label: "Preview & add" },
];

export function WizardStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick?.(step.id)}
            disabled={!onStepClick || step.id > currentStep}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition ${
              isActive
                ? "border-white/30 bg-white text-black"
                : isComplete
                  ? "border-line bg-white/[0.06] text-text-inverse hover:border-white/20"
                  : "border-line bg-white/[0.03] text-text-inverse-subtle"
            } disabled:cursor-default`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                isActive
                  ? "bg-black/10 text-black"
                  : isComplete
                    ? "bg-white/10 text-text-inverse"
                    : "bg-white/[0.06] text-text-inverse-subtlest"
              }`}
            >
              {isComplete ? <Check size={12} weight="bold" /> : step.id}
            </span>
            {step.label}
          </button>
        );
      })}
    </div>
  );
}
