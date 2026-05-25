/** PROTOTYPE v2 dock hover label — Figma 2553:15418 */

type DockHoverChipProps = {
  label: string;
};

export function DockHoverChip({ label }: DockHoverChipProps) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 h-6 -translate-x-1/2 whitespace-nowrap rounded-rounded bg-white px-3 text-xs font-medium leading-[1.4] text-text-default shadow-card"
    >
      {label}
    </span>
  );
}
