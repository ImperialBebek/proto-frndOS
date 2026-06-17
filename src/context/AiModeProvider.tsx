"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAiStatus } from "@/lib/ai/pitchAiClient";

export type AiMode = "mock" | "real";

const STORAGE_KEY = "frnd.pitch.aiMode";

interface AiModeContextType {
  mode: AiMode;
  /** True once the server confirms a key is configured */
  configured: boolean;
  hasVision: boolean;
  /** Real AI usable right now (configured + mode === "real") */
  isReal: boolean;
  setMode: (mode: AiMode) => void;
  toggleMode: () => void;
}

const AiModeContext = createContext<AiModeContextType | null>(null);

export function AiModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AiMode>("mock");
  const [configured, setConfigured] = useState(false);
  const [hasVision, setHasVision] = useState(false);

  useEffect(() => {
    let active = true;
    fetchAiStatus().then((status) => {
      if (!active) return;
      setConfigured(status.configured);
      setHasVision(status.hasVision);
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      // Only honour a stored "real" preference when a key actually exists.
      if (stored === "real" && status.configured) {
        setModeState("real");
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback(
    (next: AiMode) => {
      // Guard: real mode requires a configured key.
      const resolved = next === "real" && !configured ? "mock" : next;
      setModeState(resolved);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, resolved);
      }
    },
    [configured]
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "real" ? "mock" : "real");
  }, [mode, setMode]);

  const value = useMemo<AiModeContextType>(
    () => ({
      mode,
      configured,
      hasVision,
      isReal: mode === "real" && configured,
      setMode,
      toggleMode,
    }),
    [mode, configured, hasVision, setMode, toggleMode]
  );

  return (
    <AiModeContext.Provider value={value}>{children}</AiModeContext.Provider>
  );
}

export function useAiMode() {
  const ctx = useContext(AiModeContext);
  if (!ctx) {
    throw new Error("useAiMode must be used within AiModeProvider");
  }
  return ctx;
}
