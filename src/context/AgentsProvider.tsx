"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Agent, Skill, SpecialistTemplate } from "@/data/agentsStatic";
import {
  defaultCustomSkills,
  defaultSkills,
  getBrandAccessPresentation,
  starterTemplates,
  workspaceBrands,
  workspaceTemplates,
} from "@/data/agentsStatic";

interface AgentsContextType {
  teamSpecialists: Agent[];
  starterTemplates: SpecialistTemplate[];
  workspaceTemplates: SpecialistTemplate[];
  skills: Skill[];
  addTeamSpecialist: (agent: Agent) => void;
  updateTeamSpecialist: (agent: Agent) => void;
  deleteTeamSpecialist: (id: string) => void;
  addSkill: (skill: Skill) => void;
}

const TEAM_STORAGE_KEY = "frndos_team_specialists";
const SKILL_STORAGE_KEY = "frndos_custom_skills";
const LEGACY_AGENT_STORAGE_KEY = "frndos_custom_agents";

const AgentsContext = createContext<AgentsContextType | null>(null);

function normalizeTeamSpecialist(agent: Agent): Agent {
  const sourceTemplateSource = agent.sourceTemplateSource ?? "custom";
  const selectedBrand = workspaceBrands.find(
    (brand) => brand.name === agent.brandName
  );
  const brandAccessMode =
    agent.brandAccessMode ??
    (selectedBrand
      ? "selected"
      : agent.brandName === "Your Workspace"
        ? "later"
        : "later");
  const brandAccessIds =
    agent.brandAccessIds ?? (selectedBrand ? [selectedBrand.id] : []);
  const brandPresentation = getBrandAccessPresentation(
    brandAccessMode,
    brandAccessIds,
    agent.brandColor
  );

  return {
    ...agent,
    type: "custom",
    sourceTemplateSource,
    brandAccessMode,
    brandAccessIds,
    behaviorSummary:
      agent.behaviorSummary ??
      agent.description ??
      "Custom specialist for your workspace.",
    surfaces: agent.surfaces ?? ["AskFrnd"],
    brandName: brandPresentation.brandName,
    brandColor: brandPresentation.brandColor,
    avatarIcon: agent.avatarIcon ?? "Bot",
    accentColor: agent.accentColor ?? agent.brandColor ?? "#757D90",
  };
}

function persistTeamSpecialists(allSpecialists: Agent[]) {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(allSpecialists));
}

function persistCustomSkills(allSkills: Skill[]) {
  const customSkills = allSkills.filter((skill) => skill.type === "custom");
  localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify(customSkills));
}

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const [teamSpecialists, setTeamSpecialists] = useState<Agent[]>([]);
  const [skills, setSkills] = useState<Skill[]>([
    ...defaultSkills,
    ...defaultCustomSkills,
  ]);

  useEffect(() => {
    try {
      const savedTeamSpecialists = localStorage.getItem(TEAM_STORAGE_KEY);
      const legacySpecialists = localStorage.getItem(LEGACY_AGENT_STORAGE_KEY);
      const savedSkills = localStorage.getItem(SKILL_STORAGE_KEY);

      if (savedTeamSpecialists) {
        const parsed: Agent[] = JSON.parse(savedTeamSpecialists);
        setTeamSpecialists(parsed.map(normalizeTeamSpecialist));
      } else if (legacySpecialists) {
        const parsed: Agent[] = JSON.parse(legacySpecialists);
        const migrated = parsed.map(normalizeTeamSpecialist);
        setTeamSpecialists(migrated);
        persistTeamSpecialists(migrated);
      }

      if (savedSkills) {
        const parsed: Skill[] = JSON.parse(savedSkills);
        setSkills((prev) => {
          const defaults = prev.filter((skill) => skill.type === "default");
          return [...defaults, ...parsed];
        });
      }
    } catch {
      // ignore local storage migration issues in the prototype
    }
  }, []);

  const addTeamSpecialist = (agent: Agent) => {
    setTeamSpecialists((prev) => {
      const next = [...prev, normalizeTeamSpecialist(agent)];
      persistTeamSpecialists(next);
      return next;
    });
  };

  const updateTeamSpecialist = (agent: Agent) => {
    setTeamSpecialists((prev) => {
      const next = prev.map((specialist) =>
        specialist.id === agent.id ? normalizeTeamSpecialist(agent) : specialist
      );
      persistTeamSpecialists(next);
      return next;
    });
  };

  const deleteTeamSpecialist = (id: string) => {
    setTeamSpecialists((prev) => {
      const next = prev.filter((specialist) => specialist.id !== id);
      persistTeamSpecialists(next);
      return next;
    });
  };

  const addSkill = (skill: Skill) => {
    setSkills((prev) => {
      const next = [...prev, skill];
      persistCustomSkills(next);
      return next;
    });
  };

  return (
    <AgentsContext.Provider
      value={{
        teamSpecialists,
        starterTemplates,
        workspaceTemplates,
        skills,
        addTeamSpecialist,
        updateTeamSpecialist,
        deleteTeamSpecialist,
        addSkill,
      }}
    >
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const ctx = useContext(AgentsContext);
  if (!ctx) {
    throw new Error("useAgents must be used within AgentsProvider");
  }
  return ctx;
}
