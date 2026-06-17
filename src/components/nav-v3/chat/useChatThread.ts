"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAgents } from "@/context/AgentsProvider";
import { useChat } from "@/context/ChatProvider";
import type { ChatMessage } from "@/data/chatStatic";
import { getPitchChatReply } from "@/data/pitchStatic";
import {
  getPersonaPresentation,
  getTeamSpecialistById,
  sortTeamSpecialists,
} from "@/data/agentsStatic";
import type { PitchChatContext } from "../AskFrndChatPanel";
import { readFieldOverride } from "../pitch/EditableAIItem";

type Message = ChatMessage;

function buildBriefDecoderProposal(
  prompt: string,
  pitchContext?: PitchChatContext | null
): Pick<Message, "text" | "proposals"> | null {
  const brief = pitchContext?.briefDecoder;
  if (!brief) return null;

  const target = brief.focusedField ?? brief.defaultField;
  if (!target) {
    return {
      text: `I'm in the ${brief.variantLabel} view with the ${brief.lens} lens active. Pick a field in the Business Briefcase, Decision Makers, or Strategy to Win and I can propose a targeted edit.`,
    };
  }

  const wantsEdit =
    /improve|sharpen|rewrite|edit|make|stronger|clearer|pitch|win|this|field|objective|hook|strategy/i.test(
      prompt
    );

  if (!wantsEdit) {
    return {
      text: `I'm tracking ${target.sectionRef}: ${target.label} in the ${brief.lens} lens. I can explain the read or propose a sharper version when you ask for an edit.`,
    };
  }

  const currentValue = readFieldOverride(target.fieldKey) ?? target.value;
  const proposedValue = makeBriefProposalValue(
    currentValue,
    target.label,
    target.sectionRef,
    brief.lens
  );

  return {
    text: `I tightened ${target.label} for the ${brief.lens} lens. Review this proposed change before applying it.`,
    proposals: [
      {
        id: `proposal-${Date.now()}`,
        fieldKey: target.fieldKey,
        label: target.label,
        currentValue,
        proposedValue,
        sectionRef: target.sectionRef,
      },
    ],
  };
}

function makeBriefProposalValue(
  currentValue: string,
  label: string,
  sectionRef: string,
  lens: string
) {
  const trimmed = currentValue.replace(/\s+/g, " ").trim();
  const base = trimmed.replace(/[.。]$/, "");

  if (/hook/i.test(label) || /Decision Makers/i.test(sectionRef)) {
    return `${base} — framed as a direct reason to say yes in the room, with the ${lens} lens' risk level made explicit.`;
  }
  if (/angle|Strategy to Win/i.test(label) || /Strategy to Win/i.test(sectionRef)) {
    return `${base} — turned into a pitch-room move with a concrete proof point, so the strategy feels ownable instead of theoretical.`;
  }
  if (/objective/i.test(label)) {
    return `${base} — clarified as a business outcome, a brand shift, and a measurable reason the client should choose this route.`;
  }
  return `${base} — sharpened for the ${lens} lens with clearer client value, stronger pitch language, and less summary tone.`;
}

export function useChatThread({
  open,
  initialMessage,
  pinnedAgentId,
  onClearPinnedAgent,
  pitchContext,
}: {
  open: boolean;
  initialMessage?: string;
  pinnedAgentId?: string;
  onClearPinnedAgent?: () => void;
  pitchContext?: PitchChatContext | null;
}) {
  const { teamSpecialists, updateTeamSpecialist } = useAgents();
  const {
    activeConversationId,
    getConversation,
    appendMessage,
    updateConversation,
  } = useChat();

  const isPitchMode = Boolean(pitchContext);
  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : undefined;

  const sortedSpecialists = useMemo(
    () => sortTeamSpecialists(teamSpecialists),
    [teamSpecialists]
  );

  const [pitchMessages, setPitchMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [localPinnedId, setLocalPinnedId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [isResponding, setIsResponding] = useState(false);

  const messages = useMemo(
    () =>
      isPitchMode
        ? pitchMessages
        : (activeConversation?.messages ?? []),
    [isPitchMode, pitchMessages, activeConversation?.messages]
  );

  const effectivePinnedId =
    pinnedAgentId ??
    localPinnedId ??
    activeConversation?.pinnedAgentId ??
    null;
  const pinnedSpecialist = effectivePinnedId
    ? getTeamSpecialistById(effectivePinnedId, teamSpecialists)
    : undefined;
  const pinnedPersona = pinnedSpecialist
    ? getPersonaPresentation(pinnedSpecialist)
    : undefined;

  const headerTitle = pitchContext
    ? `frndOS AI · ${pitchContext.stepLabel}`
    : activeConversation && activeConversation.title !== "New Chat"
      ? activeConversation.title
      : pinnedSpecialist
        ? pinnedSpecialist.name
        : "New chat";

  const isNewChat =
    !isPitchMode &&
    (!activeConversation ||
      (activeConversation.title === "New Chat" &&
        activeConversation.messages.length === 0));

  useEffect(() => {
    if (open && initialMessage) {
      setDraft(initialMessage);
    }
    if (!open) {
      setDraft("");
      setShowPicker(false);
      setPickerQuery("");
    }
  }, [open, initialMessage]);

  useEffect(() => {
    if (pinnedAgentId && getTeamSpecialistById(pinnedAgentId, teamSpecialists)) {
      setLocalPinnedId(pinnedAgentId);
    }
  }, [pinnedAgentId, teamSpecialists]);

  const pitchKey = pitchContext?.key ?? null;
  const pitchScriptRef = useRef(pitchContext);
  pitchScriptRef.current = pitchContext;

  useEffect(() => {
    if (!open || !pitchKey) return;
    const context = pitchScriptRef.current;
    if (!context) return;

    setPitchMessages([]);
    setDraft("");

    if (context.script.length === 0) {
      setIsResponding(false);
      return;
    }

    setIsResponding(true);
    const timers: number[] = [];
    let elapsed = 0;
    context.script.forEach((scriptMessage, index) => {
      elapsed += scriptMessage.delay;
      const isLast = index === context.script.length - 1;
      timers.push(
        window.setTimeout(() => {
          setPitchMessages((prev) => [
            ...prev,
            {
              id: `${pitchKey}-${scriptMessage.id}`,
              role: "agent",
              text: scriptMessage.text,
              agentName: "FRND",
              agentColor: "#B8B8B8",
            },
          ]);
          if (isLast) setIsResponding(false);
        }, elapsed)
      );
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      setIsResponding(false);
    };
  }, [open, pitchKey]);

  const visibleSpecialists = sortedSpecialists.filter((specialist) => {
    const query = pickerQuery.toLowerCase();
    if (!query) return specialist.status !== "archived";

    return (
      specialist.status !== "archived" &&
      [specialist.name, specialist.role, specialist.description, specialist.brandName]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  });

  const clearPin = () => {
    setLocalPinnedId(null);
    onClearPinnedAgent?.();
    if (activeConversationId && !isPitchMode) {
      updateConversation(activeConversationId, { pinnedAgentId: undefined });
    }
  };

  const handleSend = (prefilledText?: string) => {
    const nextText = (prefilledText ?? draft).trim();
    if (!nextText || isResponding) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: nextText,
    };

    if (isPitchMode) {
      setPitchMessages((prev) => [...prev, userMessage]);
    } else if (activeConversationId) {
      appendMessage(activeConversationId, userMessage);
    }

    setDraft("");
    setIsResponding(true);
    setShowPicker(false);
    setPickerQuery("");

    window.setTimeout(() => {
      if (pinnedSpecialist) {
        updateTeamSpecialist({
          ...pinnedSpecialist,
          lastInvokedAt: "Just now",
        });
      }

      const pitchReply = pitchScriptRef.current;
      const briefDecoderReply = buildBriefDecoderProposal(
        nextText,
        pitchReply
      );
      const reply: Message = pitchReply
        ? {
            id: `frnd-${Date.now()}`,
            role: "agent",
            text:
              briefDecoderReply?.text ?? getPitchChatReply(pitchReply.stepLabel),
            proposals: briefDecoderReply?.proposals,
            agentName: "FRND",
            agentColor: "#B8B8B8",
          }
        : pinnedSpecialist
          ? {
              id: `agent-${Date.now()}`,
              role: "agent",
              text: `I can take that. I'll approach it as ${pinnedSpecialist.role.toLowerCase()} work and keep it grounded in ${pinnedSpecialist.brandName.toLowerCase()}. If you want, I can turn the next pass into something ready for ${pinnedSpecialist.surfaces.join(", ")}.`,
              agentName: pinnedSpecialist.name,
              agentColor:
                pinnedPersona?.accentColor ?? pinnedSpecialist.brandColor,
            }
          : {
              id: `frnd-${Date.now()}`,
              role: "agent",
              text: "I can help directly, or you can pull in one of your specialists for more focused work. If you tell me the goal, I can suggest who should handle it next.",
              agentName: "FRND",
              agentColor: "#B8B8B8",
            };

      if (isPitchMode) {
        setPitchMessages((prev) => [...prev, reply]);
      } else if (activeConversationId) {
        appendMessage(activeConversationId, reply);
      }
      setIsResponding(false);
    }, 800);
  };

  const pinSpecialist = (id: string) => {
    setLocalPinnedId(id);
    setShowPicker(false);
    setPickerQuery("");
    if (activeConversationId && !isPitchMode) {
      updateConversation(activeConversationId, { pinnedAgentId: id });
    }
  };

  const resetPitchThread = () => {
    setPitchMessages([]);
    setDraft("");
    setShowPicker(false);
    setPickerQuery("");
    clearPin();
  };

  return {
    isPitchMode,
    pitchContext,
    messages,
    draft,
    setDraft,
    showPicker,
    setShowPicker,
    pickerQuery,
    setPickerQuery,
    isResponding,
    pinnedSpecialist,
    pinnedPersona,
    sortedSpecialists,
    visibleSpecialists,
    headerTitle,
    isNewChat,
    activeConversationId,
    clearPin,
    handleSend,
    pinSpecialist,
    resetPitchThread,
  };
}
