/** PROTOTYPE v3 sidebar shell — Figma 2608:5779 / 2614:8356 / 2614:9352 */

"use client";

import {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { TabId } from "@/data/homeStatic";
import {
  V3_TAB_LABEL,
  getBrandContentTitle,
  type BrandModuleId,
  type BrandInsightsTabId,
} from "@/data/navV3Static";
import {
  brandModuleOrInsightsPath,
  brandInsightsPath,
  brandSettingsPath,
  isValidBrandId,
  normalizeSlug,
  parseBrandPathname,
} from "@/lib/brandRoutes";
import { createChatContext, type HistoryFilter } from "@/data/chatStatic";
import { DOCK_BRANDS } from "@/data/homeStatic";
import { useChat } from "@/context/ChatProvider";
import {
  AGENTS_HOME_PATH,
  getAgentsPageTitle,
  parseAgentsPathname,
} from "@/lib/agentsRoutes";
import {
  PITCH_HOME_PATH,
  PITCH_NEW_PATH,
  parsePitchPathname,
  pitchCanvasPath,
} from "@/lib/pitchRoutes";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_DECODE_SCRIPT,
  PITCH_WORK_HUB_ID,
  getPitchStepScript,
} from "@/data/pitchStatic";
import { AgentsHomePage } from "@/components/agents/AgentsHomePage";
import { AgentsBuilderWrapper } from "@/components/agents/AgentsBuilderWrapper";
import { PitchListPage } from "./pitch/PitchListPage";
import { PitchCanvas } from "./pitch/PitchCanvas";
import { NewPitchPage } from "./pitch/NewPitchPage";
import {
  V3_CARD_RADIUS,
  V3_SIDEBAR_DOCK_WIDTH,
  V3_SIDEBAR_WIDTH,
  getChatPanelWidth,
  getContentCardBackground,
  getShellPadding,
  prefersReducedMotion,
  v3LayoutMotion,
} from "@/lib/v3ShellMotion";
import { SidebarV3 } from "./SidebarV3";
import {
  FloatingSidebarV3,
  type AnchorRect,
} from "./FloatingSidebarV3";
import { CollapsedTopBarV3 } from "./CollapsedTopBarV3";
import { HomePageContentV3 } from "./HomePageContentV3";
import { BrandPageV3 } from "./BrandPageV3";
import { AskFrndChatPanel } from "./AskFrndChatPanel";
import { AskFrndFab } from "./AskFrndFab";
import { PlaceholderPage } from "./PlaceholderPage";
import {
  ChatMenuV3,
  NotificationPopoverV3,
  ProfileMenuV3,
} from "./ShellOverlaysV3";
import { ChatFullscreenView } from "./chat/ChatFullscreenView";
import { ChatHistoryModal } from "./chat/ChatHistoryModal";
import type { ChatDisplayMode, HistoryPopupSource } from "./chat/types";

export function AppShellV3() {
  const pathname = usePathname();
  const router = useRouter();

  const brandRoute = useMemo(
    () => parseBrandPathname(pathname),
    [pathname]
  );
  const agentsRoute = useMemo(
    () => parseAgentsPathname(pathname),
    [pathname]
  );
  const pitchRoute = useMemo(
    () => parsePitchPathname(pathname),
    [pathname]
  );

  const {
    getPitch,
    getActiveStepId,
    getSubStepStatus,
    getStepDef,
    getSubSteps,
  } = usePitch();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [chatDisplayMode, setChatDisplayMode] =
    useState<ChatDisplayMode>("closed");
  const [chatMode, setChatMode] = useState<"docked" | "floating">("floating");
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();
  const [pinnedAgentId, setPinnedAgentId] = useState<string | undefined>();
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [historyPopupOpen, setHistoryPopupOpen] = useState(false);
  const [historyPopupSource, setHistoryPopupSource] =
    useState<HistoryPopupSource>("panel");
  const [historyScopedFilter, setHistoryScopedFilter] = useState<
    HistoryFilter | undefined
  >(undefined);

  const {
    activeConversationId,
    setActiveConversationId,
    getQuickAccess,
    createConversation,
  } = useChat();

  const activeBrandId = brandRoute?.brandId ?? null;
  const brandModule = brandRoute?.brandModule ?? "insights";
  const brandInsightsTab =
    brandRoute?.brandInsightsTab ?? ("overview" as BrandInsightsTabId);

  const sidebarWrapRef = useRef<HTMLDivElement>(null);
  const shellFrameRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const fullscreenChatRef = useRef<HTMLDivElement>(null);
  const chatWrapRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);

  const isBrand = activeBrandId !== null && !agentsRoute && !pitchRoute;
  const isBrandSettings = Boolean(brandRoute?.isSettings);
  const agentsTitle = getAgentsPageTitle(agentsRoute);
  const showSidebarChat = !pitchRoute;

  const quickAccessChats = useMemo(
    () => (showSidebarChat ? getQuickAccess(activeBrandId) : []),
    [showSidebarChat, getQuickAccess, activeBrandId]
  );

  const activePitch =
    pitchRoute?.view === "canvas" ? getPitch(pitchRoute.pitchId) : undefined;

  /* Resolved step — the Work hub stands in when the default step would be a
     parallel work track */
  const activePitchStepId = useMemo(() => {
    if (pitchRoute?.view !== "canvas" || !activePitch) return null;
    if (pitchRoute.stepId) return pitchRoute.stepId;
    const fallback = getActiveStepId(pitchRoute.pitchId);
    const def = getStepDef(pitchRoute.pitchId, fallback);
    return def?.kind === "track" ? PITCH_WORK_HUB_ID : fallback;
  }, [pitchRoute, activePitch, getActiveStepId, getStepDef]);

  /* Track sub-step — URL-addressable; defaults to the first non-approved
     sub-step (or the last when the track is complete) */
  const activePitchSubStepId = useMemo(() => {
    if (pitchRoute?.view !== "canvas" || !activePitchStepId) return null;
    const stepDef = getStepDef(pitchRoute.pitchId, activePitchStepId);
    if (stepDef?.kind !== "track") return null;
    const subSteps = getSubSteps(pitchRoute.pitchId, activePitchStepId);
    if (
      pitchRoute.subStepId &&
      subSteps.some((sub) => sub.id === pitchRoute.subStepId)
    ) {
      return pitchRoute.subStepId;
    }
    const firstOpen = subSteps.find(
      (sub) =>
        getSubStepStatus(pitchRoute.pitchId, activePitchStepId, sub.id) !==
        "approved"
    );
    return (firstOpen ?? subSteps[subSteps.length - 1])?.id ?? null;
  }, [pitchRoute, activePitchStepId, getStepDef, getSubSteps, getSubStepStatus]);

  const handlePitchSubStepSelect = useCallback(
    (subStepId: string) => {
      if (pitchRoute?.view !== "canvas" || !activePitchStepId) return;
      router.push(
        pitchCanvasPath(pitchRoute.pitchId, activePitchStepId, subStepId)
      );
    },
    [router, pitchRoute, activePitchStepId]
  );

  const pitchTitle = pitchRoute
    ? pitchRoute.view === "list"
      ? "Pitch"
      : pitchRoute.view === "new"
        ? "New Pitch"
        : activePitch
          ? `${activePitch.brand} — ${activePitch.project}`
          : "Pitch"
    : null;

  const pageTitle = pitchTitle
    ? pitchTitle
    : agentsTitle
      ? agentsTitle
      : isBrandSettings && activeBrandId
        ? `Brand settings — ${
            DOCK_BRANDS.find((b) => b.id === activeBrandId)?.name ??
            activeBrandId
          }`
        : isBrand
          ? getBrandContentTitle(brandModule, brandInsightsTab)
          : V3_TAB_LABEL[activeTab];

  useEffect(() => {
    if (pitchRoute) {
      setActiveTab("pitch");
    } else if (agentsRoute) {
      setActiveTab("agents");
    } else if (!brandRoute && pathname === "/") {
      setActiveTab((current) =>
        current === "agents" || current === "pitch" ? "home" : current
      );
    }
  }, [agentsRoute, pitchRoute, brandRoute, pathname]);

  /* Pitch canvas session: immersive layout — sidebar auto-collapses, the
     agentic chat opens (floating by default) */
  const isPitchCanvas = pitchRoute?.view === "canvas";
  const isFullscreenChat =
    chatDisplayMode === "fullscreen" && !isPitchCanvas;
  const showAskFab = !isPitchCanvas && chatDisplayMode !== "fullscreen";
  const prevPitchCanvasRef = useRef(false);
  useEffect(() => {
    if (isPitchCanvas && !prevPitchCanvasRef.current) {
      setSidebarOpen(false);
      setChatDisplayMode("docked");
    } else if (!isPitchCanvas && prevPitchCanvasRef.current) {
      setChatDisplayMode("closed");
      setSidebarOpen(true);
    }
    prevPitchCanvasRef.current = isPitchCanvas;
  }, [isPitchCanvas]);

  /* Floating vs docked chat — persisted preference */
  useEffect(() => {
    const stored = window.localStorage.getItem("frnd.chatMode");
    if (stored === "docked" || stored === "floating") {
      setChatMode(stored);
    }
  }, []);

  const handleToggleChatMode = useCallback(() => {
    setChatMode((prev) => {
      const next = prev === "docked" ? "floating" : "docked";
      window.localStorage.setItem("frnd.chatMode", next);
      return next;
    });
  }, []);

  const chatFloating =
    isPitchCanvas && chatMode === "floating" && chatDisplayMode !== "closed";
  const dockedChatOpen =
    chatDisplayMode === "docked" && !chatFloating;

  const pitchChatContext = useMemo(() => {
    if (pitchRoute?.view !== "canvas" || !activePitch || !activePitchStepId) {
      return null;
    }
    const isHub = activePitchStepId === PITCH_WORK_HUB_ID;
    const stepDef = isHub
      ? undefined
      : getStepDef(pitchRoute.pitchId, activePitchStepId);
    const stepLabelBase = isHub ? "Work Tracks" : (stepDef?.label ?? "Pitch");
    const decoding = Boolean(
      activePitch.newlyCreated && activePitchStepId === "brief-decoder"
    );
    const subStepId =
      stepDef?.kind === "track" ? activePitchSubStepId : null;
    const subStepLabel = subStepId
      ? getSubSteps(pitchRoute.pitchId, activePitchStepId).find(
          (sub) => sub.id === subStepId
        )?.label
      : undefined;
    return {
      key: `${pitchRoute.pitchId}:${activePitchStepId}${
        subStepId ? `:${subStepId}` : ""
      }`,
      stepLabel: subStepLabel
        ? `${stepLabelBase} · ${subStepLabel}`
        : stepLabelBase,
      pills: [
        activePitch.brand,
        `${stepLabelBase} context`,
        decoding ? "Decoding brief…" : "Pipeline synced",
      ],
      script: decoding
        ? PITCH_DECODE_SCRIPT
        : getPitchStepScript(
            activePitchStepId,
            subStepId ?? undefined,
            stepDef
          ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pitchRoute?.view === "canvas" ? pitchRoute.pitchId : null, activePitchStepId, activePitchSubStepId, activePitch?.id]);

  const shellFloating = sidebarOpen || dockedChatOpen;

  /* GSAP owns shell layout props — set before paint to avoid flash */
  useLayoutEffect(() => {
    gsap.set(shellFrameRef.current, getShellPadding(sidebarOpen, dockedChatOpen));
    gsap.set(mainRef.current, {
      borderRadius: shellFloating ? V3_CARD_RADIUS : 0,
      backgroundColor: getContentCardBackground(shellFloating),
    });
    gsap.set(sidebarWrapRef.current, {
      width: sidebarOpen ? V3_SIDEBAR_DOCK_WIDTH : 0,
      autoAlpha: sidebarOpen ? 1 : 0,
    });
    gsap.set(chatWrapRef.current, {
      width: dockedChatOpen ? getChatPanelWidth() : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; matches useState defaults
  }, []);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const layoutMotion = v3LayoutMotion(reduce);

      gsap
        .timeline({ defaults: { overwrite: "auto" } })
        .to(
          shellFrameRef.current,
          {
            ...getShellPadding(sidebarOpen, dockedChatOpen),
            ...layoutMotion,
          },
          0
        )
        .to(
          mainRef.current,
          {
            borderRadius: shellFloating ? V3_CARD_RADIUS : 0,
            backgroundColor: getContentCardBackground(shellFloating),
            ...layoutMotion,
          },
          0
        )
        .to(
          sidebarWrapRef.current,
          {
            width: sidebarOpen ? V3_SIDEBAR_DOCK_WIDTH : 0,
            autoAlpha: sidebarOpen ? 1 : 0,
            ...layoutMotion,
          },
          0
        )
        .to(
          chatWrapRef.current,
          {
            width: dockedChatOpen ? getChatPanelWidth() : 0,
            ...layoutMotion,
          },
          0
        );

    },
    { dependencies: [sidebarOpen, dockedChatOpen, shellFloating] }
  );

  useGSAP(
    () => {
      const node = fullscreenChatRef.current;
      if (!node || !isFullscreenChat) return;

      if (prefersReducedMotion()) {
        gsap.set(node, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        node,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }
      );
    },
    { dependencies: [isFullscreenChat] }
  );

  useEffect(() => {
    if (!dockedChatOpen) return;
    const onResize = () => {
      const reduce = prefersReducedMotion();
      gsap.to(chatWrapRef.current, {
        width: getChatPanelWidth(),
        ...v3LayoutMotion(reduce),
        overwrite: "auto",
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dockedChatOpen]);

  const updateAnchor = useCallback(() => {
    const btn = hamburgerRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setAnchorRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      centerX: r.left + r.width / 2,
      centerY: r.top + r.height / 2,
    });
  }, []);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openFloating = () => {
    clearCloseTimer();
    updateAnchor();
    setFloatingOpen(true);
  };

  const scheduleCloseFloating = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setFloatingOpen(false), 120);
  };

  const closeChat = useCallback(() => {
    setChatDisplayMode("closed");
    setChatMenuOpen(false);
    setHistoryPopupOpen(false);
    setHistoryScopedFilter(undefined);
    setInitialChatMessage(undefined);
    setPinnedAgentId(undefined);
  }, []);

  const handleTabSelect = (tab: TabId) => {
    closeChat();
    setActiveTab(tab);
    if (tab === "agents") {
      router.push(AGENTS_HOME_PATH);
      return;
    }
    if (tab === "pitch") {
      router.push(PITCH_HOME_PATH);
      return;
    }
    if (brandRoute || agentsRoute || pitchRoute) {
      router.push("/");
    }
  };

  const handleOpenPitch = useCallback(
    (pitchId: string) => {
      router.push(pitchCanvasPath(pitchId));
    },
    [router]
  );

  const handlePitchStepSelect = useCallback(
    (stepId: string, subStepId?: string) => {
      if (pitchRoute?.view !== "canvas") return;
      router.push(pitchCanvasPath(pitchRoute.pitchId, stepId, subStepId));
    },
    [router, pitchRoute]
  );

  const handleBackToPitchList = useCallback(() => {
    router.push(PITCH_HOME_PATH);
  }, [router]);

  const handleStartNewPitch = useCallback(() => {
    router.push(PITCH_NEW_PATH);
  }, [router]);

  const handlePitchChatToggle = useCallback(() => {
    setChatDisplayMode((mode) => {
      if (mode === "closed") {
        setSidebarOpen(false);
        setFloatingOpen(false);
        clearCloseTimer();
        return "docked";
      }
      return "closed";
    });
  }, []);

  const handleBrandSelect = (brandId: string) => {
    closeChat();
    const normalized = normalizeSlug(brandId);
    if (!isValidBrandId(normalized)) return;
    router.push(brandInsightsPath(normalized, "overview"));
  };

  const handleBackToHome = () => {
    closeChat();
    setActiveTab("home");
    router.push("/");
  };

  const handleModuleSelect = (module: BrandModuleId) => {
    closeChat();
    if (!activeBrandId) return;
    if (module === "insights") {
      router.push(
        brandInsightsPath(activeBrandId, brandInsightsTab)
      );
      return;
    }
    router.push(brandModuleOrInsightsPath(activeBrandId, module));
  };

  const handleInsightsTabSelect = (tab: BrandInsightsTabId) => {
    closeChat();
    if (!activeBrandId) return;
    router.push(brandInsightsPath(activeBrandId, tab));
  };

  const openSidebarPanel = useCallback(() => {
    setNotificationOpen(false);
    setProfileMenuOpen(false);
    setChatMenuOpen(false);
    setChatDisplayMode("closed");
    setSidebarOpen(true);
    setFloatingOpen(false);
    clearCloseTimer();
  }, []);

  const openDockedChat = useCallback(() => {
    setNotificationOpen(false);
    setProfileMenuOpen(false);
    setChatMenuOpen(false);
    setSidebarOpen(false);
    setFloatingOpen(false);
    clearCloseTimer();
    setChatDisplayMode("docked");
  }, []);

  const openFullscreenChat = useCallback(() => {
    setNotificationOpen(false);
    setProfileMenuOpen(false);
    setChatMenuOpen(false);
    setFloatingOpen(false);
    clearCloseTimer();
    setChatDisplayMode("fullscreen");
  }, []);

  const handleNewChat = useCallback(
    (agentId?: string) => {
      const ctx = createChatContext(activeBrandId, brandModule);
      createConversation(ctx, { pinnedAgentId: agentId });
      setHistoryScopedFilter(undefined);
    },
    [activeBrandId, brandModule, createConversation]
  );

  const handleAskFrndOpen = useCallback(
    (message?: string, agentId?: string) => {
      if (!activeConversationId) {
        handleNewChat(agentId);
      } else if (agentId) {
        setPinnedAgentId(agentId);
      }
      if (message) setInitialChatMessage(message);
      setHistoryScopedFilter(undefined);
      openDockedChat();
    },
    [activeConversationId, handleNewChat, openDockedChat]
  );

  const handleChatSelect = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setHistoryScopedFilter(undefined);
      openFullscreenChat();
    },
    [setActiveConversationId, openFullscreenChat]
  );

  const handleChatSeeAll = useCallback(() => {
    setHistoryPopupSource("sidebar");
    setHistoryScopedFilter(
      activeBrandId
        ? { scope: "brand", brandId: activeBrandId }
        : { scope: "general" }
    );
    setHistoryPopupOpen(true);
  }, [activeBrandId]);

  const handleChatNew = useCallback(() => {
    handleNewChat(pinnedAgentId);
    openFullscreenChat();
  }, [handleNewChat, pinnedAgentId, openFullscreenChat]);

  const handleOpenHistory = useCallback(
    (source: HistoryPopupSource) => {
      setHistoryPopupSource(source);
      if (source === "panel") {
        setHistoryScopedFilter(
          activeBrandId
            ? { scope: "brand", brandId: activeBrandId }
            : { scope: "general" }
        );
      } else {
        setHistoryScopedFilter(
          activeBrandId
            ? { scope: "brand", brandId: activeBrandId }
            : { scope: "general" }
        );
      }
      setHistoryPopupOpen(true);
    },
    [activeBrandId]
  );

  const handleHistorySelect = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setHistoryPopupOpen(false);
      if (historyPopupSource === "sidebar") {
        openFullscreenChat();
      }
    },
    [historyPopupSource, setActiveConversationId, openFullscreenChat]
  );

  const handleHistoryNewChat = useCallback(() => {
    handleNewChat(pinnedAgentId);
    setHistoryPopupOpen(false);
    if (historyPopupSource === "sidebar") {
      openFullscreenChat();
    }
  }, [handleNewChat, pinnedAgentId, historyPopupSource, openFullscreenChat]);

  const handleFabClick = useCallback(() => {
    if (!activeConversationId) {
      handleNewChat();
    }
    setHistoryScopedFilter(undefined);
    openDockedChat();
  }, [activeConversationId, handleNewChat, openDockedChat]);

  const handleOpenFullscreenFromMenu = useCallback(() => {
    setSidebarOpen(false);
    openFullscreenChat();
  }, [openFullscreenChat]);

  const handleBrandSettings = useCallback(
    (brandId: string) => {
      const normalized = normalizeSlug(brandId);
      if (!isValidBrandId(normalized)) return;
      router.push(brandSettingsPath(normalized));
    },
    [router]
  );

  const handleFooterSelect = useCallback(
    (id: string) => {
      if (id === "brand-settings" && activeBrandId) {
        handleBrandSettings(activeBrandId);
      }
    },
    [activeBrandId, handleBrandSettings]
  );

  const handleChatClose = useCallback(() => {
    closeChat();
  }, [closeChat]);

  const handleClearPinnedAgent = useCallback(() => {
    setPinnedAgentId(undefined);
  }, []);

  const handleDockFromFloating = () => {
    openSidebarPanel();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNotificationOpen(false);
      setProfileMenuOpen(false);
      setChatMenuOpen(false);
      setFloatingOpen(false);
      setHistoryPopupOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebarProps = {
    activeTab,
    activeBrandId,
    brandModule,
    brandInsightsTab,
    onTabSelect: handleTabSelect,
    onBrandSelect: handleBrandSelect,
    onBrandSettings: handleBrandSettings,
    onModuleSelect: handleModuleSelect,
    onInsightsTabSelect: handleInsightsTabSelect,
    onBackToHome: handleBackToHome,
    onCollapse: () => setSidebarOpen(false),
    quickAccessChats: showSidebarChat ? quickAccessChats : [],
    activeConversationId,
    onChatSelect: showSidebarChat ? handleChatSelect : undefined,
    onChatSeeAll: showSidebarChat ? handleChatSeeAll : undefined,
    onChatNew: showSidebarChat ? handleChatNew : undefined,
    onFooterSelect: handleFooterSelect,
    activePitchId: isPitchCanvas && pitchRoute?.view === "canvas" ? pitchRoute.pitchId : null,
    activePitchStepId,
    onPitchStepSelect: handlePitchStepSelect,
    onBackToPitchList: handleBackToPitchList,
  };

  const chatPanelProps = {
    open: chatDisplayMode === "docked",
    initialMessage: initialChatMessage,
    pinnedAgentId,
    menuOpen: chatMenuOpen,
    onMenuOpenChange: setChatMenuOpen,
    onClearPinnedAgent: handleClearPinnedAgent,
    onClose: handleChatClose,
    pitchContext: pitchChatContext,
    chatMode: isPitchCanvas ? chatMode : undefined,
    onToggleChatMode: isPitchCanvas ? handleToggleChatMode : undefined,
    onNewChatRequest: () => handleNewChat(pinnedAgentId),
    onOpenHistory: () => handleOpenHistory("panel"),
    onSelectConversation: (id: string | null) => {
      if (id) setActiveConversationId(id);
    },
  } as const;

  return (
    <div className="flex h-dvh min-w-[1440px] items-stretch bg-app-bg p-2 font-sans">
      <div className="theme-v3 relative flex h-full min-w-0 flex-1 overflow-hidden rounded-[32px] bg-app-bg text-text-inverse">
        <div
          ref={sidebarWrapRef}
          className="h-full shrink-0 overflow-hidden"
        >
          <div className="h-full" style={{ width: V3_SIDEBAR_WIDTH }}>
            <SidebarV3 {...sidebarProps} />
          </div>
        </div>

      <div
        ref={shellFrameRef}
        className="flex h-full min-h-0 min-w-0 flex-1"
      >
        <div
          className={`flex h-full min-h-0 min-w-0 flex-1 ${dockedChatOpen ? "gap-x-4" : "gap-x-0"}`}
        >
          <main
            ref={mainRef}
            className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          >
            {/* Immersive pitch sessions own the top row via the canvas header */}
            {pitchRoute?.view !== "canvas" && !isFullscreenChat && (
              <CollapsedTopBarV3
                ref={hamburgerRef}
                sidebarOpen={sidebarOpen}
                pageTitle={pageTitle}
                onNotificationClick={() => {
                  setProfileMenuOpen(false);
                  setChatMenuOpen(false);
                  setNotificationOpen((open) => !open);
                }}
                onProfileClick={() => {
                  setNotificationOpen(false);
                  setChatMenuOpen(false);
                  setProfileMenuOpen((open) => !open);
                }}
                onHamburgerEnter={openFloating}
                onHamburgerLeave={scheduleCloseFloating}
              />
            )}

            {isFullscreenChat ? (
              <div ref={fullscreenChatRef} className="flex min-h-0 flex-1 flex-col">
              <ChatFullscreenView
                open
                initialMessage={initialChatMessage}
                pinnedAgentId={pinnedAgentId}
                onClearPinnedAgent={handleClearPinnedAgent}
                menuOpen={chatMenuOpen}
                onMenuOpenChange={setChatMenuOpen}
                onNewChatRequest={() => {
                  handleNewChat(pinnedAgentId);
                }}
                onOpenHistory={() => handleOpenHistory("panel")}
                onSelectConversation={(id) => {
                  if (id) setActiveConversationId(id);
                  else handleNewChat(pinnedAgentId);
                }}
              />
              </div>
            ) : pitchRoute?.view === "canvas" ? (
              <PitchCanvas
                pitchId={pitchRoute.pitchId}
                stepId={activePitchStepId}
                activeSubStepId={activePitchSubStepId}
                onSubStepSelect={handlePitchSubStepSelect}
                onNavigateStep={handlePitchStepSelect}
                onBackToPitchList={handleBackToPitchList}
                sidebarOpen={sidebarOpen}
                hamburgerRef={hamburgerRef}
                onHamburgerEnter={openFloating}
                onHamburgerLeave={scheduleCloseFloating}
                chatOpen={chatDisplayMode !== "closed"}
                onChatToggle={handlePitchChatToggle}
              />
            ) : pitchRoute?.view === "new" ? (
              <NewPitchPage
                onOpenPitch={handleOpenPitch}
                onBackToPitchList={handleBackToPitchList}
              />
            ) : pitchRoute?.view === "list" ? (
              <PitchListPage
                onOpenPitch={handleOpenPitch}
                onStartNewPitch={handleStartNewPitch}
              />
            ) : agentsRoute?.view === "new" ? (
              <AgentsBuilderWrapper onAskFrndOpen={handleAskFrndOpen} />
            ) : agentsRoute?.view === "home" ? (
              <AgentsHomePage onAskFrndOpen={handleAskFrndOpen} />
            ) : isBrandSettings && activeBrandId ? (
              <PlaceholderPage
                title={`Brand settings — ${
                  DOCK_BRANDS.find((b) => b.id === activeBrandId)?.name ??
                  activeBrandId
                }`}
                description="Brand settings will live here. This is a placeholder in the prototype."
              />
            ) : isBrand ? (
              <BrandPageV3
                brandId={activeBrandId}
                brandModule={brandModule}
                brandInsightsTab={brandInsightsTab}
                onAskFrndOpen={handleAskFrndOpen}
              />
            ) : (
              <HomePageContentV3
                activeTab={activeTab}
                onBrandSelect={handleBrandSelect}
              />
            )}

            {showAskFab && <AskFrndFab onClick={handleFabClick} />}
          </main>

          <div
            ref={chatWrapRef}
            className="h-full min-h-0 shrink-0 overflow-hidden"
          >
            {!chatFloating && <AskFrndChatPanel {...chatPanelProps} />}
          </div>
        </div>
      </div>

      {chatFloating && (
        <FloatingChatOverlay>
          <AskFrndChatPanel {...chatPanelProps} />
        </FloatingChatOverlay>
      )}

      {!sidebarOpen && (
        <FloatingSidebarV3
          open={floatingOpen}
          anchorRect={anchorRect}
          activeTab={activeTab}
          activeBrandId={activeBrandId}
          brandModule={brandModule}
          brandInsightsTab={brandInsightsTab}
          onTabSelect={handleTabSelect}
          onBrandSelect={handleBrandSelect}
          onModuleSelect={handleModuleSelect}
          onInsightsTabSelect={handleInsightsTabSelect}
          onBackToHome={handleBackToHome}
          onBrandSettings={handleBrandSettings}
          onDock={handleDockFromFloating}
          onPointerEnter={openFloating}
          onPointerLeave={scheduleCloseFloating}
          quickAccessChats={sidebarProps.quickAccessChats}
          activeConversationId={sidebarProps.activeConversationId}
          onChatSelect={sidebarProps.onChatSelect}
          onChatSeeAll={sidebarProps.onChatSeeAll}
          onChatNew={sidebarProps.onChatNew}
          onFooterSelect={sidebarProps.onFooterSelect}
          activePitchId={sidebarProps.activePitchId}
          activePitchStepId={activePitchStepId}
          onPitchStepSelect={handlePitchStepSelect}
          onBackToPitchList={handleBackToPitchList}
        />
      )}

      {(notificationOpen || profileMenuOpen) && (
        <button
          type="button"
          aria-label="Close shell menu"
          className="absolute inset-0 z-30 cursor-default bg-transparent"
          onClick={() => {
            setNotificationOpen(false);
            setProfileMenuOpen(false);
          }}
        />
      )}
      <NotificationPopoverV3
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
      <ProfileMenuV3
        open={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
      />
      <ChatMenuV3
        open={chatDisplayMode !== "closed" && chatMenuOpen}
        onClose={() => setChatMenuOpen(false)}
        chatDisplayMode={chatDisplayMode}
        onOpenFullscreen={handleOpenFullscreenFromMenu}
        anchor={isFullscreenChat ? "fullscreen" : "shell"}
      />

      <ChatHistoryModal
        open={historyPopupOpen}
        onClose={() => setHistoryPopupOpen(false)}
        scopedFilter={historyScopedFilter}
        activeBrandId={activeBrandId}
        activeConversationId={activeConversationId}
        menuOpen={chatMenuOpen}
        onMenuOpenChange={setChatMenuOpen}
        onNewChat={handleHistoryNewChat}
        onSelectConversation={handleHistorySelect}
        source={historyPopupSource}
      />
      </div>
    </div>
  );
}

/** Floating chat container — fixed overlay above the immersive pitch canvas */
function FloatingChatOverlay({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const node = overlayRef.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      gsap.set(node, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }
    gsap.fromTo(
      node,
      { autoAlpha: 0, y: 16, scale: 0.97, transformOrigin: "bottom right" },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed bottom-5 right-5 z-40 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-line bg-card-bg shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
      style={{ height: "min(620px, calc(100dvh - 96px))" }}
    >
      {children}
    </div>
  );
}
