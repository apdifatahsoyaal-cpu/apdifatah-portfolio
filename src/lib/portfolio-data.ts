export type PortfolioProject = {
  name: string;
  category: string;
  description: string;
  technologies: string[];
  visual: "dashboard" | "assistant" | "workflow";
};

export const demoProjects: PortfolioProject[] = [
  {
    name: "Demo project 01",
    category: "SaaS product concept",
    description:
      "Placeholder for a SaaS project. Replace this copy with details about your real work.",
    technologies: ["Technology", "Technology"],
    visual: "dashboard",
  },
  {
    name: "Demo project 02",
    category: "AI product concept",
    description:
      "Placeholder for an AI project. Replace this copy with details about your real work.",
    technologies: ["Technology", "Technology"],
    visual: "assistant",
  },
  {
    name: "Demo project 03",
    category: "Business system concept",
    description:
      "Placeholder for a business system. Replace this copy with details about your real work.",
    technologies: ["Technology", "Technology"],
    visual: "workflow",
  },
];

export const skillGroups = [
  {
    name: "Frontend",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    note: "Technologies used to build this portfolio.",
  },
  {
    name: "Backend",
    items: ["Add your backend skills"],
    note: "Personal skills not yet provided.",
  },
  {
    name: "Database",
    items: ["Add your database skills"],
    note: "Personal skills not yet provided.",
  },
  {
    name: "AI",
    items: ["AI-powered systems"],
    note: "Based on your professional positioning.",
  },
  {
    name: "Tools",
    items: ["Lucide React"],
    note: "Tools used in this portfolio.",
  },
];
