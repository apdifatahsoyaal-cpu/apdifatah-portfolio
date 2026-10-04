export type AdminResource = "projects" | "skills" | "services" | "social_links";

export type AdminField = {
  name: string;
  label: string;
  type:
    | "text"
    | "url"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "skill-icon";
  media?: boolean;
  required?: boolean;
  options?: readonly string[];
  hint?: string;
};

export type AdminManagedRecord = {
  id: string;
  title: string;
  summary: string;
  metadata: string;
  values: Record<string, string | boolean>;
};

export const adminResources: Record<
  AdminResource,
  { title: string; description: string; fields: AdminField[] }
> = {
  projects: {
    title: "Projects",
    description: "Create and update projects displayed in the featured work section.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        hint: "Lowercase letters, numbers, and hyphens only.",
      },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "image_url",
        label: "Project image",
        type: "url",
        media: true,
        hint: "Upload a project image or paste an image URL.",
      },
      { name: "github_url", label: "GitHub URL", type: "url" },
      { name: "live_url", label: "Live URL", type: "url" },
      {
        name: "technologies",
        label: "Technologies",
        type: "textarea",
        hint: "Enter one technology per line or separate them with commas.",
      },
      { name: "featured", label: "Show as featured", type: "checkbox" },
    ],
  },
  skills: {
    title: "Skills",
    description: "Manage skill labels, categories, icons, and display order.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: ["Frontend", "Backend", "Database", "AI", "Tools"],
      },
      {
        name: "icon",
        label: "Skill Icon",
        type: "skill-icon",
      },
      { name: "display_order", label: "Display order", type: "number", required: true },
    ],
  },
  services: {
    title: "Services",
    description: "Manage service titles, descriptions, icons, and display order.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "icon",
        label: "Service icon or image",
        type: "text",
        media: true,
        hint: "Upload an image or paste its URL.",
      },
      { name: "display_order", label: "Display order", type: "number", required: true },
    ],
  },
  social_links: {
    title: "Social Links",
    description: "Manage public social and contact links shown on the portfolio.",
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "icon", label: "Icon identifier", type: "text" },
      { name: "display_order", label: "Display order", type: "number", required: true },
    ],
  },
};
