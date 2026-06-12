"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChatCircle,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Sparkle,
  Trash,
  UsersThree,
} from "@phosphor-icons/react";
import { useAgents } from "@/context/AgentsProvider";
import { PersonaAvatar } from "./PersonaAvatar";
import {
  getPersonaPresentation,
  getSkillsByIds,
  sortTeamSpecialists,
  type Agent,
  type SpecialistTemplate,
} from "@/data/agentsStatic";
import { agentsNewPath } from "@/lib/agentsRoutes";

type AgentsHomePageProps = {
  onAskFrndOpen: (message?: string, agentId?: string) => void;
};

function StatusBadge({ status }: { status: Agent["status"] }) {
  const color =
    status === "active"
      ? "bg-emerald-500/20 text-emerald-300"
      : status === "draft"
        ? "bg-amber-500/20 text-amber-300"
        : "bg-white/[0.06] text-text-inverse-subtle";

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${color}`}
    >
      {status}
    </span>
  );
}

function SurfacePill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-text-inverse-subtle">
      {label}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-text-inverse">{value}</p>
    </div>
  );
}

function TeamCard({
  specialist,
  skillNames,
  onDelete,
  onChat,
}: {
  specialist: Agent;
  skillNames: string[];
  onDelete: (id: string) => void;
  onChat: (id: string) => void;
}) {
  const persona = getPersonaPresentation(specialist);

  return (
    <article className="flex flex-col gap-4 rounded-md border border-line bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <PersonaAvatar
            icon={persona.avatarIcon}
            accentColor={persona.accentColor}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-medium text-text-inverse">
                {specialist.name}
              </h3>
              <StatusBadge status={specialist.status} />
            </div>
            <p className="mt-1 text-xs text-text-inverse-subtle">
              {specialist.role}
            </p>
            <p className="mt-1 text-[11px] text-text-inverse-subtlest">
              {specialist.brandName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(specialist.id)}
          className="rounded-lg p-2 text-text-inverse-subtlest transition hover:bg-white/5 hover:text-text-inverse"
          aria-label={`Delete ${specialist.name}`}
        >
          <Trash size={16} />
        </button>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-text-inverse-subtle">
        {specialist.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {specialist.surfaces.map((surface) => (
          <SurfacePill key={surface} label={surface} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-inverse-subtlest">
          <span>{skillNames.length} skills</span>
          {specialist.lastInvokedAt && (
            <>
              <span>•</span>
              <span>Used {specialist.lastInvokedAt}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={agentsNewPath({ edit: specialist.id })}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text-inverse transition hover:bg-white/10"
          >
            <PencilSimple size={14} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onChat(specialist.id)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-white/90"
          >
            <ChatCircle size={14} />
            Chat
          </button>
        </div>
      </div>
    </article>
  );
}

function TemplateCard({
  template,
  skillNames,
}: {
  template: SpecialistTemplate;
  skillNames: string[];
}) {
  const persona = getPersonaPresentation(template);

  return (
    <article className="flex h-full flex-col gap-4 rounded-md border border-line bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <PersonaAvatar
          icon={persona.avatarIcon}
          accentColor={persona.accentColor}
        />
        <span className="rounded-full border border-line px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
          {template.source === "frndos" ? "frndOS" : "Workspace"}
        </span>
      </div>

      <div>
        <p className="text-base font-medium leading-6 text-text-inverse">
          {template.jobStatement}
        </p>
        <p className="mt-1 text-xs text-text-inverse-subtle">{template.role}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-inverse-subtlest">
          {template.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {template.surfaces.map((surface) => (
          <SurfacePill key={surface} label={surface} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-inverse-subtlest">
        <span>{skillNames.length} skills</span>
        {template.publishedBy && (
          <>
            <span>•</span>
            <span>Published by {template.publishedBy}</span>
          </>
        )}
      </div>

      <div className="mt-auto pt-1">
        <Link
          href={agentsNewPath({
            template: template.id,
            source: template.source,
          })}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90"
        >
          Start with this specialist
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function SectionHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
          {eyebrow}
        </p>
      )}
      <h2 className="text-sm font-medium text-text-inverse">{title}</h2>
      <p className="mt-1 text-xs text-text-inverse-subtlest">{description}</p>
    </div>
  );
}

export function AgentsHomePage({ onAskFrndOpen }: AgentsHomePageProps) {
  const {
    teamSpecialists,
    starterTemplates,
    workspaceTemplates,
    skills,
    deleteTeamSpecialist,
  } = useAgents();
  const [search, setSearch] = useState("");

  const searchLower = search.trim().toLowerCase();
  const sortedTeam = useMemo(
    () => sortTeamSpecialists(teamSpecialists),
    [teamSpecialists]
  );

  const matchesAgent = (agent: Agent) => {
    if (!searchLower) return true;
    const skillNames = getSkillsByIds(agent.skills, skills)
      .map((skill) => skill.name)
      .join(" ");

    return [
      agent.name,
      agent.role,
      agent.description,
      agent.behaviorSummary,
      agent.brandName,
      skillNames,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchLower);
  };

  const matchesTemplate = (template: SpecialistTemplate) => {
    if (!searchLower) return true;
    const skillNames = getSkillsByIds(template.skills, skills)
      .map((skill) => skill.name)
      .join(" ");

    return [
      template.name,
      template.role,
      template.jobStatement,
      template.description,
      template.behaviorSummary,
      skillNames,
      template.publishedBy ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchLower);
  };

  const filteredTeam = sortedTeam.filter(matchesAgent);
  const filteredStarterTemplates = starterTemplates.filter(matchesTemplate);
  const filteredWorkspaceTemplates = workspaceTemplates.filter(matchesTemplate);
  const hasResults =
    filteredTeam.length > 0 ||
    filteredStarterTemplates.length > 0 ||
    filteredWorkspaceTemplates.length > 0;

  const teamSummary =
    teamSpecialists.length === 0
      ? "No specialists yet"
      : teamSpecialists.length === 1
        ? "1 specialist on your team"
        : `${teamSpecialists.length} specialists on your team`;

  const totalTemplates =
    filteredStarterTemplates.length + filteredWorkspaceTemplates.length;
  const recentTeam = sortedTeam.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_24%)] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-2xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
                frndOS Agents
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-text-inverse lg:text-4xl">
                Assemble your team
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-text-inverse-subtle">
                Assemble a team of specialists that can help across frndOS, then
                bring them into Ask Frnd when you want sharper, role-based help.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-inverse-subtlest">
                Start with proven templates, tune them to your brands, or create
                one with guided setup instead of writing prompts from scratch.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={agentsNewPath()}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  <Plus size={16} weight="bold" />
                  New specialist
                </Link>
                <button
                  type="button"
                  onClick={() => onAskFrndOpen()}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-text-inverse transition hover:bg-white/10"
                >
                  <ChatCircle size={16} />
                  Open Ask Frnd
                </button>
              </div>
            </div>

            <div className="rounded-md border border-line bg-white/[0.02] p-5">
              <div className="flex items-center gap-2">
                <UsersThree size={16} className="text-text-inverse-subtle" />
                <h2 className="text-sm font-medium text-text-inverse">
                  Team overview
                </h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-inverse-subtle">
                FRND stays separate. Specialists join your workspace team and
                show up in Ask Frnd when you need them.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniMetric label="Your team" value={teamSummary} />
                <MiniMetric
                  label="Available starters"
                  value={`${totalTemplates} templates`}
                />
              </div>

              {recentTeam.length > 0 ? (
                <div className="mt-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                    Recently added
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recentTeam.map((specialist) => {
                      const persona = getPersonaPresentation(specialist);
                      return (
                        <span
                          key={specialist.id}
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-2 text-xs text-text-inverse"
                        >
                          <PersonaAvatar
                            icon={persona.avatarIcon}
                            accentColor={persona.accentColor}
                            size="sm"
                            className="!h-5 !w-5 !rounded-full"
                          />
                          {specialist.name}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskFrndOpen()}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Try your team in Ask Frnd
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-5 rounded-md border border-dashed border-line p-4">
                  <p className="text-sm text-text-inverse">No specialists yet.</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-inverse-subtlest">
                    Pick a starter template below or use the guided wizard to
                    create your own — then try them in Ask Frnd.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-md border border-line bg-white/[0.02] px-4 py-3">
            <MagnifyingGlass size={16} className="text-text-inverse-subtlest" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your team, starter specialists, or workspace templates..."
              className="w-full bg-transparent text-sm text-text-inverse outline-none placeholder:text-text-inverse-subtlest"
            />
          </div>
        </section>

        <section className="rounded-md border border-line bg-white/[0.02] p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <UsersThree size={16} className="text-text-inverse-subtle" />
                <h2 className="text-base font-medium text-text-inverse">
                  Your team
                </h2>
              </div>
              <p className="mt-2 text-sm text-text-inverse-subtle">
                {teamSummary}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-inverse-subtlest">
                Build a roster of specialists, then bring them into Ask Frnd
                when you want focused help.
              </p>
            </div>
            {teamSpecialists.length > 0 && (
              <button
                type="button"
                onClick={() => onAskFrndOpen()}
                className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Try your team in Ask Frnd
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>

          {filteredTeam.length === 0 ? (
            searchLower ? (
              <div className="rounded-md border border-dashed border-line py-12 text-center">
                <UsersThree size={32} className="mx-auto text-text-inverse-subtlest" />
                <p className="mt-3 text-sm text-text-inverse-subtlest">
                  No team specialists match your search.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-line bg-white/[0.02] p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-sm font-medium text-text-inverse">
                      Start creating your team with these specialists.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-inverse-subtlest">
                      Pick a starter template below or make your own specialist
                      from scratch. FRND still works on its own, but your team
                      makes it much easier to route work with context.
                    </p>
                  </div>
                  <Link
                    href={agentsNewPath()}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-sm font-medium text-text-inverse transition hover:bg-white/10"
                  >
                    <Plus size={16} />
                    New specialist
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredTeam.map((specialist) => (
                <TeamCard
                  key={specialist.id}
                  specialist={specialist}
                  skillNames={getSkillsByIds(specialist.skills, skills).map(
                    (skill) => skill.name
                  )}
                  onDelete={deleteTeamSpecialist}
                  onChat={(id) => onAskFrndOpen(undefined, id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-md border border-line bg-white/[0.02] p-6">
          <SectionHeader
            eyebrow="Starter templates"
            title="Start with these specialists"
            description="Proven starting points you can tune before they join your team."
          />
          {filteredStarterTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredStarterTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  skillNames={getSkillsByIds(template.skills, skills).map(
                    (skill) => skill.name
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-line py-12 text-center">
              <Sparkle size={32} className="mx-auto text-text-inverse-subtlest" />
              <p className="mt-3 text-sm text-text-inverse-subtlest">
                No starter specialists match your search.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-md border border-line bg-white/[0.02] p-6">
          <SectionHeader
            eyebrow="Workspace"
            title="From your workspace"
            description="Shared specialist starting points created for this workspace."
          />
          {filteredWorkspaceTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkspaceTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  skillNames={getSkillsByIds(template.skills, skills).map(
                    (skill) => skill.name
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-line py-12 text-center">
              <UsersThree size={32} className="mx-auto text-text-inverse-subtlest" />
              <p className="mt-3 text-sm text-text-inverse-subtlest">
                No workspace templates match your search.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-md border border-line bg-white/[0.02] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                Custom specialist
              </p>
              <h2 className="mt-2 text-base font-medium text-text-inverse">
                Need something more specific?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-inverse-subtlest">
                Start with a few quick inputs. frndOS suggests the role,
                capabilities, and behavior, then you refine it before adding the
                specialist to your team.
              </p>
            </div>
            <Link
              href={agentsNewPath()}
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Plus size={16} weight="bold" />
              New specialist
            </Link>
          </div>
        </section>

        {!hasResults && searchLower && (
          <div className="rounded-md border border-dashed border-line py-16 text-center">
            <MagnifyingGlass size={40} className="mx-auto text-text-inverse-subtlest" />
            <p className="mt-3 text-sm text-text-inverse-subtlest">
              Nothing matched your search.
            </p>
            <p className="text-xs text-text-inverse-subtlest">
              Try a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
