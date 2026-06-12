/** PROTOTYPE v3 dark home — Figma 12001:2208 */

"use client";

import Image from "next/image";
import {
  MagnifyingGlass,
  Command,
  ChatCircle,
  CaretRight,
  Play,
  ImagesSquare,
  NotePencil,
  ArrowsOutSimple,
  VideoCamera,
} from "@phosphor-icons/react";
import { getGreeting } from "@/lib/greeting";
import {
  SUGGESTIONS,
  BRAND_CARDS,
  RECENT_WORK,
  TOOL_CARDS,
  SCHEDULE_EVENTS,
  UPDATE_CARDS,
  type BrandCard,
  type WorkCard,
  type ToolCard,
  type ScheduleEvent,
  type UpdateCard,
  type TabId,
} from "@/data/homeStatic";
import { V3_TAB_LABEL, V3_USER } from "@/data/navV3Static";
import { PlaceholderPage } from "./PlaceholderPage";

type HomePageContentV3Props = {
  activeTab: TabId;
  onBrandSelect: (brandId: string) => void;
};

const badgeStyles = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-yellow-100 text-yellow-900",
  monitoring: "bg-yellow-100 text-yellow-900",
} as const;

const trendStyles = {
  positive: "bg-emerald-100 text-emerald-800",
  negative: "bg-red-50 text-red-800",
} as const;

const userFirstName = V3_USER.name.split(" ")[0] ?? V3_USER.name;

export function HomePageContentV3({
  activeTab,
  onBrandSelect,
}: HomePageContentV3Props) {
  if (activeTab === "inbox" || activeTab === "playground") {
    return (
      <PlaceholderPage
        title={V3_TAB_LABEL[activeTab]}
        description={`${V3_TAB_LABEL[activeTab]} will appear here. This section is a placeholder in the prototype.`}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-[64px] overflow-y-auto px-[64px] py-[80px]">
      <section className="flex w-full max-w-[800px] flex-col gap-[48px] py-[80px]">
        <div className="flex w-full flex-col gap-4">
          <p className="text-base tracking-[-0.16px] text-text-inverse">
            <span>{getGreeting()}, </span>
            <span className="font-medium">{userFirstName}</span>
          </p>
          <h1 className="bg-gradient-to-b from-primary-400 to-primary-50 bg-clip-text text-[32px] font-medium leading-[1.2] tracking-[-0.48px] text-transparent">
            What would you like to work on?
          </h1>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex h-12 w-full items-center gap-3 rounded-md bg-[var(--container-input)] px-4 py-3 backdrop-blur-shallow">
            <MagnifyingGlass
              size={20}
              weight="bold"
              className="shrink-0 text-text-inverse-subtlest"
              aria-hidden
            />
            <input
              type="text"
              readOnly
              placeholder="Ask FRnD or type a command..."
              aria-label="Ask FRnD or type a command"
              className="min-w-0 flex-1 bg-transparent text-sm tracking-[-0.14px] text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none"
            />
            <div
              className="flex shrink-0 items-center gap-2 text-text-inverse-subtlest"
              aria-hidden
            >
              <kbd className="flex size-6 items-center justify-center rounded-xs border border-line">
                <Command size={16} />
              </kbd>
              <kbd className="flex size-6 items-center justify-center rounded-xs border border-line text-xs font-medium">
                K
              </kbd>
            </div>
          </div>

          <ul className="flex w-full flex-col">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion.text}>
                <button
                  type="button"
                  className="group flex h-12 w-full items-center justify-between gap-4 rounded-md px-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <ChatCircle
                      size={20}
                      className="shrink-0 text-text-inverse-subtle"
                      aria-hidden
                    />
                    <span className="truncate text-sm tracking-[-0.14px] text-text-inverse">
                      {suggestion.text}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-xs bg-[var(--container-translucent)] px-1.5 py-0.5 text-xs font-medium text-text-inverse backdrop-blur-[8px]">
                    {suggestion.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex w-full max-w-[1280px] flex-col gap-8">
        <h2 className="text-xl font-medium tracking-[-0.4px] text-text-inverse">
          Your brands
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {BRAND_CARDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => onBrandSelect(brand.id)}
              className="rounded-md text-left transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <BrandMetricsCardV3 brand={brand} />
            </button>
          ))}
        </div>
      </section>

      <section className="flex w-full max-w-[1280px] flex-col gap-8">
        <SectionHeader title="Your recent work" />
        <div className="grid grid-cols-4 gap-4">
          {RECENT_WORK.map((work) => (
            <WorkCardV3 key={work.id} work={work} />
          ))}
        </div>
      </section>

      <section className="flex w-full max-w-[1280px] flex-col gap-8">
        <h2 className="text-xl font-medium tracking-[-0.4px] text-text-inverse">
          Your tools
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {TOOL_CARDS.map((tool) => (
            <ToolCardV3 key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid w-full max-w-[1280px] grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-medium tracking-[-0.4px] text-text-inverse">
            Your schedule
          </h2>
          <div className="flex flex-col gap-2">
            {SCHEDULE_EVENTS.map((event) => (
              <ScheduleRowV3 key={event.id} event={event} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeader title="Updates and announcements" />
          <div className="flex flex-col gap-6">
            {UPDATE_CARDS.map((update) => (
              <UpdateRowV3 key={update.id} update={update} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex h-10 items-center gap-8">
      <h2 className="flex-1 text-xl font-medium tracking-[-0.4px] text-text-inverse">
        {title}
      </h2>
      <button
        type="button"
        className="flex shrink-0 items-center gap-2 text-base font-medium tracking-[-0.32px] text-text-inverse-subtlest transition-colors hover:text-text-inverse-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        See All
        <CaretRight size={20} aria-hidden />
      </button>
    </div>
  );
}

function BrandMetricsCardV3({ brand }: { brand: BrandCard }) {
  const [impressions, spend, conversion, revenue] = brand.metrics;
  const cells = [impressions, spend, conversion, revenue];

  return (
    <article className="flex flex-col gap-6 border-t border-line pt-4 pb-2 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-4">
        <span className="relative size-10 shrink-0 overflow-hidden rounded-rounded">
          <Image
            src={brand.logoUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-[-0.14px] text-text-inverse">
            {brand.name}
          </p>
          <p className="text-xs text-text-inverse-subtle">{brand.industry}</p>
        </div>
        <span
          className={`shrink-0 rounded-xs px-1.5 py-0.5 text-xs font-medium ${badgeStyles[brand.badge.variant]}`}
        >
          {brand.badge.text}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cells.map((metric) => (
          <div
            key={metric.label}
            className="flex min-h-[48px] flex-col gap-2 border-t border-line pt-2"
          >
            <p className="text-xs text-text-inverse-subtlest">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-medium tracking-[-0.36px] text-text-inverse">
                {metric.value}
              </p>
              {metric.trend && (
                <span
                  className={`rounded px-1 py-0.5 text-xs font-medium ${trendStyles[metric.trend.variant]}`}
                >
                  {metric.trend.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function WorkCardV3({ work }: { work: WorkCard }) {
  return (
    <button
      type="button"
      className="group flex flex-col gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="relative aspect-[400/225] w-full overflow-hidden rounded-md">
        {work.placeholder ? (
          <div className="size-full bg-white/10" />
        ) : work.thumbnailUrl ? (
          <Image
            src={work.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
        {work.fileType && (
          <span className="absolute right-2 top-2 flex items-center rounded-sm bg-white p-2">
            <WorkFileTypeIcon type={work.fileType} />
          </span>
        )}
        {work.showPlay && (
          <span
            className={`absolute bottom-2 right-2 flex size-10 items-center justify-center rounded-xs backdrop-blur-shallow ${
              work.playVariant === "dark"
                ? "bg-black/20"
                : "bg-white/40"
            }`}
          >
            <Play size={20} weight="fill" className="text-white" aria-hidden />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium tracking-[-0.16px] text-text-inverse">
          {work.title}
        </p>
        <p className="text-xs text-text-inverse-subtle">
          <span>Edited </span>
          <span>{work.editedLabel} </span>
          <span>by </span>
          <span className="text-text-inverse">{work.editor}</span>
        </p>
      </div>
    </button>
  );
}

function WorkFileTypeIcon({
  type,
}: {
  type: NonNullable<WorkCard["fileType"]>;
}) {
  const iconClass = "size-6 text-neutral-900";
  if (type === "image") {
    return <ImagesSquare className={iconClass} aria-hidden />;
  }
  if (type === "video") {
    return <VideoCamera className={iconClass} aria-hidden />;
  }
  return <NotePencil className={iconClass} aria-hidden />;
}

function ToolCardV3({ tool }: { tool: ToolCard }) {
  return (
    <button
      type="button"
      className="group flex flex-col gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="relative aspect-[369/208] w-full overflow-hidden rounded-md">
        <Image
          src={tool.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
        {tool.badge && (
          <span className="absolute bottom-4 left-4 flex items-center rounded-sm bg-white p-2">
            <ToolBadgeIcon badge={tool.badge} />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium tracking-[-0.16px] text-text-inverse">
          {tool.title}
        </p>
        <p className="text-xs text-text-inverse-subtle">{tool.description}</p>
      </div>
    </button>
  );
}

function ToolBadgeIcon({ badge }: { badge: NonNullable<ToolCard["badge"]> }) {
  const iconClass = "size-6 text-neutral-900";
  if (badge === "image") return <ImagesSquare className={iconClass} aria-hidden />;
  if (badge === "kv") return <NotePencil className={iconClass} aria-hidden />;
  if (badge === "resizer") {
    return <ArrowsOutSimple className={iconClass} aria-hidden />;
  }
  return <NotePencil className={iconClass} aria-hidden />;
}

function ScheduleRowV3({ event }: { event: ScheduleEvent }) {
  return (
    <div className="flex items-baseline gap-4">
      <p className="w-12 shrink-0 text-sm font-medium tracking-[-0.14px] text-text-inverse-subtlest">
        {event.time}
      </p>
      <div className="flex min-w-0 flex-1 items-center gap-4 rounded-sm bg-white/[0.05] px-3 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium tracking-[-0.14px] text-text-inverse">
            {event.title}
          </p>
          {event.description && (
            <p className="mt-0.5 text-xs text-text-inverse-subtle">
              {event.description}
            </p>
          )}
          <p className="mt-2 text-xs text-text-inverse-subtle">
            {event.timeRange}
          </p>
        </div>
        {event.showJoin && (
          <button
            type="button"
            className="flex h-8 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-medium text-[#111] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <VideoCamera size={16} aria-hidden />
            Join
          </button>
        )}
      </div>
    </div>
  );
}

function UpdateRowV3({ update }: { update: UpdateCard }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div
        className="relative h-14 w-[100px] shrink-0 overflow-hidden rounded-xs"
        style={
          update.placeholderColor
            ? { backgroundColor: update.placeholderColor }
            : undefined
        }
      >
        {update.thumbnailUrl && (
          <Image
            src={update.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium tracking-[-0.16px] text-text-inverse">
          {update.title}
        </p>
        <p className="mt-2 text-xs text-text-inverse-subtle">
          {update.description}
        </p>
      </div>
    </button>
  );
}
