import type { ComponentType } from "react";
import {
  Robot,
  Target,
  MagnifyingGlass,
  PencilSimple,
  ChartBar,
  GitBranch,
  Wrench,
  Sparkle,
  Lightbulb,
  FileText,
  Users,
  Megaphone,
} from "@phosphor-icons/react";
import type { PersonaIconId } from "@/data/agentsStatic";

type IconType = ComponentType<{
  size?: number;
  weight?: "fill" | "regular" | "bold";
  className?: string;
  style?: React.CSSProperties;
}>;

const iconMap: Record<PersonaIconId, IconType> = {
  Bot: Robot,
  Target,
  Search: MagnifyingGlass,
  PenLine: PencilSimple,
  BarChart3: ChartBar,
  GitBranch,
  Wrench,
  Sparkles: Sparkle,
  Lightbulb,
  FileText,
  Users,
  Megaphone,
};

export function PersonaAvatar({
  icon,
  accentColor,
  size = "md",
  className = "",
}: {
  icon: PersonaIconId;
  accentColor: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Robot;
  const sizeClasses =
    size === "sm"
      ? "h-9 w-9 rounded-xl"
      : size === "lg"
        ? "h-12 w-12 rounded-2xl"
        : "h-11 w-11 rounded-2xl";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${sizeClasses} ${className}`}
      style={{ backgroundColor: `${accentColor}20` }}
    >
      <Icon size={iconSize} style={{ color: accentColor }} />
    </div>
  );
}
