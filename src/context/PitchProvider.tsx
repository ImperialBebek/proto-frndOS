"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  PITCH_STEPS,
  PITCHES,
  SEED_APPROVED_STEPS,
  buildPitchSteps,
  getTrackSubStepsForDef,
  type NewPitchTrackInput,
  type PitchListItem,
  type PitchStepDef,
  type PitchTrackSubStepDef,
} from "@/data/pitchStatic";

export type PitchStepStatus = "locked" | "available" | "approved";

export type NewPitchInput = {
  brand: string;
  project?: string;
  deadline?: string;
  pitchType?: string;
  /** Edited AI-suggested deliverable tracks — builds a per-pitch pipeline */
  tracks?: NewPitchTrackInput[];
};

interface PitchContextType {
  pitches: PitchListItem[];
  getPitch: (pitchId: string) => PitchListItem | undefined;
  createPitch: (input: NewPitchInput) => string;
  markDecoded: (pitchId: string) => void;
  /** Per-pitch pipeline — custom steps for created pitches, default otherwise */
  getStepsForPitch: (pitchId: string) => PitchStepDef[];
  getStepDef: (pitchId: string, stepId: string) => PitchStepDef | undefined;
  getSubSteps: (
    pitchId: string,
    trackStepId: string
  ) => readonly PitchTrackSubStepDef[];
  getApprovedSteps: (pitchId: string) => readonly string[];
  isStepApproved: (pitchId: string, stepId: string) => boolean;
  getStepStatus: (pitchId: string, stepId: string) => PitchStepStatus;
  approveStep: (pitchId: string, stepId: string) => void;
  reopenStep: (pitchId: string, stepId: string) => void;
  getSubStepStatus: (
    pitchId: string,
    trackStepId: string,
    subStepId: string
  ) => PitchStepStatus;
  approveSubStep: (
    pitchId: string,
    trackStepId: string,
    subStepId: string
  ) => void;
  getTrackSubProgress: (
    pitchId: string,
    trackStepId: string
  ) => { approved: number; total: number };
  getProgress: (pitchId: string) => {
    approved: number;
    total: number;
    percent: number;
  };
  getActiveStepId: (pitchId: string) => string;
}

const PitchContext = createContext<PitchContextType | null>(null);

const LOGO_PALETTE = [
  "#2563EB",
  "#D9572A",
  "#0F766E",
  "#7C3AED",
  "#BE185D",
  "#B45309",
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Step ids that (transitively) depend on the given step */
function transitiveDependents(
  steps: readonly PitchStepDef[],
  stepId: string
): Set<string> {
  const dependents = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const step of steps) {
      if (dependents.has(step.id)) continue;
      if (
        step.dependsOn.some((dep) => dep === stepId || dependents.has(dep))
      ) {
        dependents.add(step.id);
        changed = true;
      }
    }
  }
  return dependents;
}

export function PitchProvider({ children }: { children: React.ReactNode }) {
  const [pitches, setPitches] = useState<PitchListItem[]>(PITCHES);
  const [approvedSteps, setApprovedSteps] = useState<
    Record<string, readonly string[]>
  >(SEED_APPROVED_STEPS);
  /** pitchId -> trackStepId -> approved sub-step ids */
  const [approvedSubSteps, setApprovedSubSteps] = useState<
    Record<string, Record<string, readonly string[]>>
  >({});
  /** pitchId -> per-pitch pipeline built at creation time */
  const [customSteps, setCustomSteps] = useState<
    Record<string, PitchStepDef[]>
  >({});

  const getPitch = useCallback(
    (pitchId: string) => pitches.find((pitch) => pitch.id === pitchId),
    [pitches]
  );

  const getStepsForPitch = useCallback(
    (pitchId: string): PitchStepDef[] => customSteps[pitchId] ?? PITCH_STEPS,
    [customSteps]
  );

  const getStepDef = useCallback(
    (pitchId: string, stepId: string) =>
      getStepsForPitch(pitchId).find((step) => step.id === stepId),
    [getStepsForPitch]
  );

  const getSubSteps = useCallback(
    (pitchId: string, trackStepId: string) =>
      getTrackSubStepsForDef(getStepDef(pitchId, trackStepId)),
    [getStepDef]
  );

  const createPitch = useCallback((input: NewPitchInput) => {
    const id = `pitch-${Date.now()}`;
    const brand = input.brand.trim();
    const project = input.project?.trim() || "New Campaign Pitch";
    const logoColor =
      LOGO_PALETTE[
        Math.abs(
          brand.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
        ) % LOGO_PALETTE.length
      ];

    const pitch: PitchListItem = {
      id,
      brand,
      project,
      status: "ongoing",
      lastUpdated: "Just now",
      deadline: input.deadline || "Jul 10, 2026",
      daysLeft: 30,
      sc: "RN",
      scColor: "#60A5FA",
      ce: null,
      ceColor: null,
      logoColor,
      logoInitials: initials(brand) || "NP",
      pitchType: input.pitchType,
      newlyCreated: true,
    };

    setPitches((prev) => [pitch, ...prev]);
    setApprovedSteps((prev) => ({ ...prev, [id]: [] }));
    if (input.tracks && input.tracks.length > 0) {
      const steps = buildPitchSteps(input.tracks);
      setCustomSteps((prev) => ({ ...prev, [id]: steps }));
    }
    return id;
  }, []);

  const markDecoded = useCallback((pitchId: string) => {
    setPitches((prev) =>
      prev.map((pitch) =>
        pitch.id === pitchId ? { ...pitch, newlyCreated: false } : pitch
      )
    );
  }, []);

  const getApprovedSteps = useCallback(
    (pitchId: string) => approvedSteps[pitchId] ?? [],
    [approvedSteps]
  );

  const isStepApproved = useCallback(
    (pitchId: string, stepId: string) =>
      getApprovedSteps(pitchId).includes(stepId),
    [getApprovedSteps]
  );

  const getStepStatus = useCallback(
    (pitchId: string, stepId: string): PitchStepStatus => {
      const approved = getApprovedSteps(pitchId);
      if (approved.includes(stepId)) return "approved";
      const def = getStepDef(pitchId, stepId);
      if (!def) return "locked";
      const unlocked = def.dependsOn.every((dep) => approved.includes(dep));
      return unlocked ? "available" : "locked";
    },
    [getApprovedSteps, getStepDef]
  );

  const approveStep = useCallback((pitchId: string, stepId: string) => {
    setApprovedSteps((prev) => {
      const current = prev[pitchId] ?? [];
      if (current.includes(stepId)) return prev;
      return { ...prev, [pitchId]: [...current, stepId] };
    });
    setPitches((prev) =>
      prev.map((pitch) =>
        pitch.id === pitchId ? { ...pitch, lastUpdated: "Just now" } : pitch
      )
    );
  }, []);

  const reopenStep = useCallback(
    (pitchId: string, stepId: string) => {
      const steps = getStepsForPitch(pitchId);
      const invalidated = transitiveDependents(steps, stepId);
      invalidated.add(stepId);
      setApprovedSteps((prev) => {
        const current = prev[pitchId] ?? [];
        return {
          ...prev,
          [pitchId]: current.filter((id) => !invalidated.has(id)),
        };
      });
      setApprovedSubSteps((prev) => {
        const pitchMap = prev[pitchId];
        if (!pitchMap) return prev;
        let changed = false;
        const nextMap: Record<string, readonly string[]> = {};
        for (const [trackId, subs] of Object.entries(pitchMap)) {
          if (invalidated.has(trackId)) {
            changed = true;
            continue;
          }
          nextMap[trackId] = subs;
        }
        if (!changed) return prev;
        return { ...prev, [pitchId]: nextMap };
      });
    },
    [getStepsForPitch]
  );

  const getApprovedSubSteps = useCallback(
    (pitchId: string, trackStepId: string): readonly string[] =>
      approvedSubSteps[pitchId]?.[trackStepId] ?? [],
    [approvedSubSteps]
  );

  const getSubStepStatus = useCallback(
    (
      pitchId: string,
      trackStepId: string,
      subStepId: string
    ): PitchStepStatus => {
      const subSteps = getSubSteps(pitchId, trackStepId);
      const index = subSteps.findIndex((sub) => sub.id === subStepId);
      if (index === -1) return "locked";
      const trackStatus = getStepStatus(pitchId, trackStepId);
      if (trackStatus === "approved") return "approved";
      const approvedSubs = getApprovedSubSteps(pitchId, trackStepId);
      if (approvedSubs.includes(subStepId)) return "approved";
      if (trackStatus === "locked") return "locked";
      const priorApproved = subSteps
        .slice(0, index)
        .every((sub) => approvedSubs.includes(sub.id));
      return priorApproved ? "available" : "locked";
    },
    [getSubSteps, getStepStatus, getApprovedSubSteps]
  );

  const approveSubStep = useCallback(
    (pitchId: string, trackStepId: string, subStepId: string) => {
      const subSteps = getSubSteps(pitchId, trackStepId);
      if (!subSteps.some((sub) => sub.id === subStepId)) return;

      // Compute the would-be sub-step list from current state + the new
      // sub-step, so the "track complete" check never reads stale data.
      const current = getApprovedSubSteps(pitchId, trackStepId);
      const next = current.includes(subStepId)
        ? current
        : [...current, subStepId];
      const completesTrack = subSteps.every((sub) => next.includes(sub.id));

      setApprovedSubSteps((prev) => {
        const pitchMap = prev[pitchId] ?? {};
        const existing = pitchMap[trackStepId] ?? [];
        if (existing.includes(subStepId)) return prev;
        return {
          ...prev,
          [pitchId]: {
            ...pitchMap,
            [trackStepId]: [...existing, subStepId],
          },
        };
      });

      if (completesTrack) {
        approveStep(pitchId, trackStepId);
      } else {
        setPitches((prev) =>
          prev.map((pitch) =>
            pitch.id === pitchId ? { ...pitch, lastUpdated: "Just now" } : pitch
          )
        );
      }
    },
    [getSubSteps, getApprovedSubSteps, approveStep]
  );

  const getTrackSubProgress = useCallback(
    (pitchId: string, trackStepId: string) => {
      const subSteps = getSubSteps(pitchId, trackStepId);
      const total = subSteps.length;
      if (isStepApproved(pitchId, trackStepId)) {
        return { approved: total, total };
      }
      const approvedSubs = getApprovedSubSteps(pitchId, trackStepId);
      const approved = subSteps.filter((sub) =>
        approvedSubs.includes(sub.id)
      ).length;
      return { approved, total };
    },
    [getSubSteps, isStepApproved, getApprovedSubSteps]
  );

  const getProgress = useCallback(
    (pitchId: string) => {
      const approved = getApprovedSteps(pitchId).length;
      const total = getStepsForPitch(pitchId).length;
      return {
        approved,
        total,
        percent: Math.round((approved / total) * 100),
      };
    },
    [getApprovedSteps, getStepsForPitch]
  );

  const getActiveStepId = useCallback(
    (pitchId: string) => {
      const steps = getStepsForPitch(pitchId);
      const firstAvailable = steps.find(
        (step) => getStepStatus(pitchId, step.id) === "available"
      );
      if (firstAvailable) return firstAvailable.id;
      const approved = getApprovedSteps(pitchId);
      if (approved.length > 0) return approved[approved.length - 1];
      return steps[0].id;
    },
    [getStepsForPitch, getStepStatus, getApprovedSteps]
  );

  const value = useMemo(
    () => ({
      pitches,
      getPitch,
      createPitch,
      markDecoded,
      getStepsForPitch,
      getStepDef,
      getSubSteps,
      getApprovedSteps,
      isStepApproved,
      getStepStatus,
      approveStep,
      reopenStep,
      getSubStepStatus,
      approveSubStep,
      getTrackSubProgress,
      getProgress,
      getActiveStepId,
    }),
    [
      pitches,
      getPitch,
      createPitch,
      markDecoded,
      getStepsForPitch,
      getStepDef,
      getSubSteps,
      getApprovedSteps,
      isStepApproved,
      getStepStatus,
      approveStep,
      reopenStep,
      getSubStepStatus,
      approveSubStep,
      getTrackSubProgress,
      getProgress,
      getActiveStepId,
    ]
  );

  return <PitchContext.Provider value={value}>{children}</PitchContext.Provider>;
}

export function usePitch() {
  const ctx = useContext(PitchContext);
  if (!ctx) {
    throw new Error("usePitch must be used within PitchProvider");
  }
  return ctx;
}
