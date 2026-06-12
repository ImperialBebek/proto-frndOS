export const PITCH_HOME_PATH = "/pitch";
export const PITCH_NEW_PATH = "/pitch/new";

export type PitchRoute =
  | { view: "list" }
  | { view: "new" }
  | {
      view: "canvas";
      pitchId: string;
      stepId: string | null;
      subStepId: string | null;
    };

export function parsePitchPathname(pathname: string): PitchRoute | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "pitch") return null;

  if (segments.length === 1) {
    return { view: "list" };
  }

  if (segments.length === 2 && segments[1] === "new") {
    return { view: "new" };
  }

  if (segments.length === 2) {
    return { view: "canvas", pitchId: segments[1], stepId: null, subStepId: null };
  }

  if (segments.length === 3) {
    return {
      view: "canvas",
      pitchId: segments[1],
      stepId: segments[2],
      subStepId: null,
    };
  }

  if (segments.length === 4) {
    return {
      view: "canvas",
      pitchId: segments[1],
      stepId: segments[2],
      subStepId: segments[3],
    };
  }

  return null;
}

export function pitchCanvasPath(
  pitchId: string,
  stepId?: string,
  subStepId?: string
): string {
  if (!stepId) return `${PITCH_HOME_PATH}/${pitchId}`;
  if (!subStepId) return `${PITCH_HOME_PATH}/${pitchId}/${stepId}`;
  return `${PITCH_HOME_PATH}/${pitchId}/${stepId}/${subStepId}`;
}
