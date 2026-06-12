"use client";

export function ChatIconButton({
  children,
  label,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-8 items-center justify-center rounded-rounded text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${className}`.trim()}
    >
      {children}
    </button>
  );
}
