/** Shared floating pill tab switcher for prototype layout variants */

"use client";

export function FloatingTabSwitcher<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly { id: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
      role="tablist"
      aria-label={ariaLabel}
    >
      <div className="inline-flex items-center gap-0.5 rounded-full border border-line bg-card-bg/95 p-1 shadow-lg backdrop-blur-md">
        {options.map((option) => {
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(option.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                active
                  ? "bg-white text-black shadow-sm"
                  : "text-text-inverse-subtle hover:text-text-inverse"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
