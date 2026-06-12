/** PROTOTYPE Export Presentation canvas — slide preview, filmstrip and PDF export via print */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CaretLeft,
  CaretRight,
  FilePdf,
  Lock,
  Printer,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  buildPitchSlides,
  type SlideBullet,
  type SlideDef,
} from "@/lib/pitchSlides";

/** Fixed slide design size; scaled via CSS transform for preview, thumbs and print */
const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

export function PitchExportCanvas({ pitchId }: { pitchId: string }) {
  const {
    getPitch,
    getStepsForPitch,
    isStepApproved,
    getApprovedSteps,
    getTrackSubProgress,
  } = usePitch();
  const pitch = getPitch(pitchId);
  const approvedStepIds = getApprovedSteps(pitchId);

  const trackSteps = useMemo(
    () => getStepsForPitch(pitchId).filter((step) => step.kind === "track"),
    [getStepsForPitch, pitchId]
  );

  const approvedTrackCount = trackSteps.filter((track) =>
    isStepApproved(pitchId, track.id)
  ).length;
  const unlocked =
    trackSteps.length > 0 && approvedTrackCount === trackSteps.length;

  const slides = useMemo(
    () =>
      pitch && unlocked
        ? buildPitchSlides(pitch, approvedStepIds, trackSteps)
        : [],
    [pitch, unlocked, approvedStepIds, trackSteps]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => Math.max(0, index - 1));
      } else if (event.key === "ArrowRight") {
        setActiveIndex((index) => Math.min(slides.length - 1, index + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  if (!pitch) return null;

  if (!unlocked) {
    const pendingTracks = trackSteps.filter(
      (track) => !isStepApproved(pitchId, track.id)
    );
    return (
      <div className="flex flex-col items-center gap-5 rounded-md border border-line bg-white/[0.02] px-8 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.05] text-text-inverse-subtle">
          <Lock size={22} />
        </span>
        <div>
          <h3 className="text-base font-medium text-text-inverse">
            Export unlocks when all work tracks are approved
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-inverse-subtle">
            frndOS assembles the final presentation from every approved output.
            Finish the remaining tracks to preview and download the deck.
          </p>
        </div>
        <span className="rounded-full border border-line px-3 py-1.5 text-[11px] text-text-inverse-subtle">
          {approvedTrackCount} of {trackSteps.length} work tracks approved
        </span>
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          {pendingTracks.map((track) => {
            const progress = getTrackSubProgress(pitchId, track.id);
            return (
              <div
                key={track.id}
                className="flex items-center justify-between gap-3 rounded-md border border-line bg-white/[0.02] px-3.5 py-2 text-left"
              >
                <span className="truncate text-xs text-text-inverse-subtle">
                  {track.label}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-text-inverse-subtlest">
                  {progress.approved}/{progress.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const active = Math.min(activeIndex, slides.length - 1);
  const accent = pitch.logoColor;
  const footerLeft = `${pitch.brand} · ${pitch.project}`;
  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
            Export presentation
          </p>
          <p className="mt-1 text-sm text-text-inverse-subtle">
            {slides.length} slides assembled from every approved output.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-3.5 py-2 text-sm text-text-inverse transition hover:bg-white/[0.05]"
          >
            <Printer size={15} />
            Print preview
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3.5 py-2 text-sm font-medium text-[#111111] transition hover:bg-white/90"
          >
            <FilePdf size={15} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-line bg-white/[0.02]">
        <ScaledSlide>
          <SlideView
            slide={slides[active]}
            accent={accent}
            pageNumber={active + 1}
            total={slides.length}
            footerLeft={footerLeft}
          />
        </ScaledSlide>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous slide"
          className="flex size-8 items-center justify-center rounded-md border border-line bg-white/[0.02] text-text-inverse-subtle transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CaretLeft size={14} />
        </button>
        <span className="min-w-28 text-center font-mono text-xs text-text-inverse-subtle">
          Slide {active + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() =>
            setActiveIndex(Math.min(slides.length - 1, active + 1))
          }
          disabled={active === slides.length - 1}
          aria-label="Next slide"
          className="flex size-8 items-center justify-center rounded-md border border-line bg-white/[0.02] text-text-inverse-subtle transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CaretRight size={14} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1.5">
        {slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-36 shrink-0 overflow-hidden rounded-sm border transition ${
              index === active
                ? "border-sky-400/70 ring-1 ring-sky-400/40"
                : "border-line opacity-60 hover:opacity-100"
            }`}
          >
            <ScaledSlide>
              <SlideView
                slide={slide}
                accent={accent}
                pageNumber={index + 1}
                total={slides.length}
                footerLeft={footerLeft}
              />
            </ScaledSlide>
          </button>
        ))}
      </div>

      {mounted &&
        createPortal(
          <div id="pitch-export-print-root" className="hidden print:block">
            {slides.map((slide, index) => (
              <div key={index} className="pitch-print-slide">
                <div className="pitch-print-slide-inner">
                  <SlideView
                    slide={slide}
                    accent={accent}
                    pageNumber={index + 1}
                    total={slides.length}
                    footerLeft={footerLeft}
                  />
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide scaling — fixed 960×540 design scaled to the container width  */
/* ------------------------------------------------------------------ */

function ScaledSlide({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setScale(width / SLIDE_WIDTH);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-white" ref={ref}>
      {scale > 0 && (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slide renderer — light "paper" style, shared by preview and print   */
/* ------------------------------------------------------------------ */

function SlideView({
  slide,
  accent,
  pageNumber,
  total,
  footerLeft,
}: {
  slide: SlideDef;
  accent: string;
  pageNumber: number;
  total: number;
  footerLeft: string;
}) {
  if (slide.kind === "cover") {
    return (
      <div className="flex h-full w-full flex-col bg-white px-12 py-10 text-[#111111]">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-md text-[13px] font-bold text-white"
            style={{ background: accent }}
          >
            {slide.initials}
          </span>
          <span className="text-sm font-semibold tracking-wide">
            {slide.brand}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#888888]">
            Pitch presentation
          </p>
          <h1 className="mt-3 max-w-[680px] text-[42px] font-semibold leading-[1.08] tracking-[-1px]">
            {slide.project}
          </h1>
          <p className="mt-5 text-[17px] italic text-[#5d5d5d]">
            “{slide.essence}”
          </p>
        </div>
        <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.16em] text-[#9a9a9a]">
          <span>{slide.preparedBy}</span>
          <span>Presentation · {slide.deadline}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-white px-12 py-10 text-[#111111]">
      <SlideBody slide={slide} accent={accent} />
      <div className="mt-auto flex items-center justify-between gap-4 pt-4 text-[9px] uppercase tracking-[0.16em] text-[#9a9a9a]">
        <span className="truncate">{footerLeft}</span>
        <span className="shrink-0 font-mono">
          {pageNumber} / {total}
        </span>
      </div>
    </div>
  );
}

function SlideBody({
  slide,
  accent,
}: {
  slide: Exclude<SlideDef, { kind: "cover" }>;
  accent: string;
}) {
  switch (slide.kind) {
    case "statement":
      return (
        <>
          <Eyebrow text={slide.eyebrow} accent={accent} />
          <div className="flex flex-1 flex-col justify-center">
            <p className="max-w-[780px] text-[38px] font-semibold leading-[1.12] tracking-[-0.8px]">
              {slide.statement}
            </p>
            {slide.support && (
              <p className="mt-5 max-w-[640px] text-[14px] leading-relaxed text-[#5d5d5d]">
                {slide.support}
              </p>
            )}
            {slide.meta && (
              <p
                className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em]"
                style={{ color: accent }}
              >
                {slide.meta}
              </p>
            )}
          </div>
        </>
      );

    case "list":
      return (
        <>
          <Eyebrow text={slide.eyebrow} accent={accent} />
          <h2 className="mt-2.5 text-[24px] font-semibold leading-tight tracking-[-0.4px]">
            {slide.title}
          </h2>
          {slide.intro && (
            <p className="mt-1.5 max-w-[760px] text-[11.5px] leading-snug text-[#888888]">
              {slide.intro}
            </p>
          )}
          <div
            className={`mt-5 grid flex-1 content-start gap-x-9 gap-y-3.5 ${
              slide.twoColumn ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {slide.items.map((item, index) => (
              <div key={index} className="border-t border-[#e7e7e7] pt-2.5">
                {item.label && (
                  <p className="text-[13px] font-semibold leading-snug">
                    {item.label}
                  </p>
                )}
                <p className="mt-1 text-[11.5px] leading-snug text-[#5d5d5d]">
                  {item.text}
                </p>
                {item.detail && (
                  <p
                    className="mt-1 text-[10.5px] font-medium leading-snug"
                    style={{ color: accent }}
                  >
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      );

    case "gwtb":
      return (
        <>
          <Eyebrow text={slide.eyebrow} accent={accent} />
          <h2 className="mt-2.5 text-[24px] font-semibold leading-tight tracking-[-0.4px]">
            {slide.title}
          </h2>
          <div className="mt-4 flex flex-1 flex-col gap-2">
            {slide.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-5 border-t border-[#e7e7e7] pt-2"
              >
                <span
                  className="w-12 text-[13px] font-bold uppercase tracking-wide"
                  style={{ color: accent }}
                >
                  {row.label}
                </span>
                <div className="flex-1">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#999999]">
                    {row.hint}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#333333]">
                    {row.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-3 rounded-md px-5 py-3.5"
            style={{ background: `${accent}14` }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#888888]">
              Locked proposition
            </p>
            <p className="mt-1 text-[19px] font-semibold tracking-[-0.3px]">
              {slide.proposition}
            </p>
          </div>
        </>
      );

    case "track-summary":
      return (
        <>
          <Eyebrow
            text={`Work track ${slide.trackIndex} of ${slide.trackTotal} · ${slide.eyebrow}`}
            accent={accent}
          />
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="max-w-[720px] text-[34px] font-semibold leading-[1.1] tracking-[-0.7px]">
              {slide.title}
            </h2>
            <p className="mt-3 max-w-[620px] text-[14px] leading-relaxed text-[#5d5d5d]">
              {slide.summary}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {slide.subStepLabels.map((label, index) => (
                <div
                  key={label}
                  className="rounded-md border border-[#e7e7e7] px-4 py-3"
                >
                  <span className="font-mono text-[10px] text-[#999999]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-[12.5px] font-medium leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      );

    case "blocks": {
      const single = slide.sections.length === 1;
      return (
        <>
          <Eyebrow text={slide.eyebrow} accent={accent} />
          <h2 className="mt-2.5 text-[24px] font-semibold leading-tight tracking-[-0.4px]">
            {slide.title}
          </h2>
          {slide.intro && (
            <p className="mt-1.5 max-w-[700px] text-[11.5px] leading-snug text-[#888888]">
              {slide.intro}
            </p>
          )}
          <div
            className={`mt-5 grid min-h-0 flex-1 content-start gap-x-9 gap-y-4 ${
              single ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {slide.sections.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: accent }}
                  >
                    {section.title}
                  </p>
                )}
                {section.body && (
                  <p className="mt-1.5 text-[12px] leading-snug text-[#333333]">
                    {section.body}
                  </p>
                )}
                {section.bullets && (
                  <div className="mt-2">
                    <BulletList
                      bullets={section.bullets}
                      wide={single && section.bullets.length > 3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );
    }

    case "closing":
      return (
        <>
          <Eyebrow text="Closing" accent={accent} />
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="text-[34px] font-semibold tracking-[-0.7px]">
              {slide.title}
            </h2>
            <ul className="mt-5 flex max-w-[620px] flex-col gap-2">
              {slide.nextSteps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[13.5px] leading-snug text-[#333333]"
                >
                  <span
                    className="mt-[7px] size-1.5 shrink-0 rounded-full"
                    style={{ background: accent }}
                  />
                  {step.text}
                </li>
              ))}
            </ul>
            <p
              className="mt-7 text-[13px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: accent }}
            >
              {slide.submission}
            </p>
            <p className="mt-2 text-[12px] italic text-[#888888]">
              “{slide.essence}” — {slide.preparedBy}
            </p>
          </div>
        </>
      );
  }
}

function Eyebrow({ text, accent }: { text: string; accent: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="h-3.5 w-1 rounded-full"
        style={{ background: accent }}
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888888]">
        {text}
      </span>
    </div>
  );
}

function BulletList({
  bullets,
  wide,
}: {
  bullets: readonly SlideBullet[];
  wide: boolean;
}) {
  return (
    <ul
      className={
        wide ? "grid grid-cols-2 gap-x-7 gap-y-2.5" : "flex flex-col gap-2"
      }
    >
      {bullets.map((bullet, index) => (
        <li key={index} className="border-l-2 border-[#e7e7e7] pl-3">
          {bullet.label && (
            <p className="text-[12px] font-semibold leading-snug">
              {bullet.label}
            </p>
          )}
          <p className="text-[11.5px] leading-snug text-[#5d5d5d]">
            {bullet.text}
          </p>
          {bullet.detail && (
            <p className="mt-0.5 text-[10px] italic leading-snug text-[#999999]">
              {bullet.detail}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
