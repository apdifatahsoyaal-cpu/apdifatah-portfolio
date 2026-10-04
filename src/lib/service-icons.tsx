import {
  Bot,
  Brain,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Database,
  Globe,
  LaptopMinimal,
  MessageCircle,
  Monitor,
  Rocket,
  Server,
  Settings,
  Shield,
  Smartphone,
  Webhook,
  Workflow,
  Wrench,
} from "lucide-react";
import type { SkillIconOption } from "@/lib/skill-icons";

export const serviceIconOptions: SkillIconOption[] = [
  { id: "web-development", label: "Web Development", render: (className) => <Code2 className={className} aria-hidden="true" /> },
  { id: "saas", label: "SaaS Development", render: (className) => <LaptopMinimal className={className} aria-hidden="true" /> },
  { id: "ai", label: "AI Solutions", render: (className) => <Brain className={className} aria-hidden="true" /> },
  { id: "ai-agents", label: "AI Agents", render: (className) => <Bot className={className} aria-hidden="true" /> },
  { id: "api", label: "API & System Integration", render: (className) => <Webhook className={className} aria-hidden="true" /> },
  { id: "consultation", label: "Technical Consultation", render: (className) => <BriefcaseBusiness className={className} aria-hidden="true" /> },
  { id: "code", label: "Code", render: (className) => <Code2 className={className} aria-hidden="true" /> },
  { id: "monitor", label: "Monitor", render: (className) => <Monitor className={className} aria-hidden="true" /> },
  { id: "globe", label: "Globe", render: (className) => <Globe className={className} aria-hidden="true" /> },
  { id: "smartphone", label: "Smartphone", render: (className) => <Smartphone className={className} aria-hidden="true" /> },
  { id: "database", label: "Database", render: (className) => <Database className={className} aria-hidden="true" /> },
  { id: "server", label: "Server", render: (className) => <Server className={className} aria-hidden="true" /> },
  { id: "cloud", label: "Cloud", render: (className) => <Cloud className={className} aria-hidden="true" /> },
  { id: "settings", label: "Settings", render: (className) => <Settings className={className} aria-hidden="true" /> },
  { id: "wrench", label: "Wrench", render: (className) => <Wrench className={className} aria-hidden="true" /> },
  { id: "rocket", label: "Rocket", render: (className) => <Rocket className={className} aria-hidden="true" /> },
  { id: "shield", label: "Shield", render: (className) => <Shield className={className} aria-hidden="true" /> },
  { id: "chart", label: "Chart", render: (className) => <ChartNoAxesCombined className={className} aria-hidden="true" /> },
  { id: "message", label: "Message", render: (className) => <MessageCircle className={className} aria-hidden="true" /> },
  { id: "brain", label: "Brain", render: (className) => <Brain className={className} aria-hidden="true" /> },
  { id: "bot", label: "Bot", render: (className) => <Bot className={className} aria-hidden="true" /> },
  { id: "workflow", label: "Workflow", render: (className) => <Workflow className={className} aria-hidden="true" /> },
  { id: "integration", label: "Integration", render: (className) => <Webhook className={className} aria-hidden="true" /> },
];

const serviceIconById: ReadonlyMap<string, SkillIconOption> = new Map(
  serviceIconOptions.map((option) => [option.id, option]),
);

export function findServiceIcon(value: string | null | undefined) {
  return value ? serviceIconById.get(value) : undefined;
}

export function ServiceIcon({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const option = findServiceIcon(value);
  if (!option) return null;

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
    >
      {option.render("size-5")}
    </span>
  );
}
