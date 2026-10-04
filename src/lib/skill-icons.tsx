import type { ReactNode } from "react";
import {
  SiGithub,
  SiGit,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVscodium,
} from "@icons-pack/react-simple-icons";
import { Bot, BrainCircuit, Network, SearchCode, Waypoints, Webhook, Wrench } from "lucide-react";

export type SkillIconId =
  | "nextjs"
  | "react"
  | "typescript"
  | "javascript"
  | "tailwindcss"
  | "nodejs"
  | "supabase"
  | "postgresql"
  | "git"
  | "github"
  | "vscode"
  | "api"
  | "ai"
  | "llm"
  | "rag"
  | "agents"
  | "tool-calling"
  | "mcp";

export type SkillIconOption = {
  id: SkillIconId;
  label: string;
  render: (className?: string) => ReactNode;
};

export const skillIconOptions: SkillIconOption[] = [
  { id: "nextjs", label: "Next.js", render: (className) => <SiNextdotjs className={className} aria-hidden="true" /> },
  { id: "react", label: "React", render: (className) => <SiReact className={className} aria-hidden="true" /> },
  { id: "typescript", label: "TypeScript", render: (className) => <SiTypescript className={className} aria-hidden="true" /> },
  { id: "javascript", label: "JavaScript", render: (className) => <SiJavascript className={className} aria-hidden="true" /> },
  { id: "tailwindcss", label: "Tailwind CSS", render: (className) => <SiTailwindcss className={className} aria-hidden="true" /> },
  { id: "nodejs", label: "Node.js", render: (className) => <SiNodedotjs className={className} aria-hidden="true" /> },
  { id: "supabase", label: "Supabase", render: (className) => <SiSupabase className={className} aria-hidden="true" /> },
  { id: "postgresql", label: "PostgreSQL", render: (className) => <SiPostgresql className={className} aria-hidden="true" /> },
  { id: "git", label: "Git", render: (className) => <SiGit className={className} aria-hidden="true" /> },
  { id: "github", label: "GitHub", render: (className) => <SiGithub className={className} aria-hidden="true" /> },
  { id: "vscode", label: "VS Code", render: (className) => <SiVscodium className={className} aria-hidden="true" /> },
  { id: "api", label: "APIs", render: (className) => <Webhook className={className} aria-hidden="true" /> },
  { id: "ai", label: "AI", render: (className) => <BrainCircuit className={className} aria-hidden="true" /> },
  { id: "llm", label: "LLMs", render: (className) => <Bot className={className} aria-hidden="true" /> },
  { id: "rag", label: "RAG", render: (className) => <SearchCode className={className} aria-hidden="true" /> },
  { id: "agents", label: "AI Agents", render: (className) => <Waypoints className={className} aria-hidden="true" /> },
  { id: "tool-calling", label: "Tool Calling", render: (className) => <Wrench className={className} aria-hidden="true" /> },
  { id: "mcp", label: "MCP", render: (className) => <Network className={className} aria-hidden="true" /> },
];

const skillIconById: ReadonlyMap<string, SkillIconOption> = new Map(
  skillIconOptions.map((option) => [option.id, option]),
);

export function findSkillIcon(value: string | null | undefined) {
  return value ? skillIconById.get(value) : undefined;
}

export function SkillIcon({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const option = findSkillIcon(value);
  if (!option) return null;

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center text-primary ${className ?? ""}`}
    >
      {option.render("size-4")}
    </span>
  );
}
