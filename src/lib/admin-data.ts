import { createClient } from "@/lib/supabase/server";
import type { AdminManagedRecord, AdminResource } from "@/lib/admin-config";

function reportReadError(resource: AdminResource, code: string) {
  console.error(`Unable to load admin ${resource}.`, code);
}

export async function getAdminRecords(resource: AdminResource) {
  const supabase = await createClient();

  if (resource === "projects") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      reportReadError(resource, error.code);
      return { records: null, error: true };
    }
    return {
      error: false,
      records: data.map((row): AdminManagedRecord => ({
        id: row.id,
        title: row.title,
        summary: row.slug,
        metadata: `${row.featured ? "Featured" : "Not featured"} · ${row.technologies.join(", ") || "No technologies"} · ${new Date(row.created_at).toLocaleDateString()}`,
        values: {
          title: row.title,
          slug: row.slug,
          description: row.description ?? "",
          image_url: row.image_url ?? "",
          github_url: row.github_url ?? "",
          live_url: row.live_url ?? "",
          technologies: row.technologies.join("\n"),
          featured: row.featured,
        },
      })),
    };
  }

  if (resource === "skills") {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order");
    if (error) {
      reportReadError(resource, error.code);
      return { records: null, error: true };
    }
    return {
      error: false,
      records: data.map((row): AdminManagedRecord => ({
        id: row.id,
        title: row.name,
        summary: row.category,
        metadata: `Display order ${row.display_order}${row.icon ? ` · ${row.icon}` : ""}`,
        values: {
          name: row.name,
          category: row.category,
          icon: row.icon ?? "",
          display_order: String(row.display_order),
        },
      })),
    };
  }

  if (resource === "services") {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");
    if (error) {
      reportReadError(resource, error.code);
      return { records: null, error: true };
    }
    return {
      error: false,
      records: data.map((row): AdminManagedRecord => ({
        id: row.id,
        title: row.title,
        summary: row.description ?? "No description",
        metadata: `Display order ${row.display_order}${row.icon ? ` · ${row.icon}` : ""}`,
        values: {
          title: row.title,
          description: row.description ?? "",
          icon: row.icon ?? "",
          display_order: String(row.display_order),
        },
      })),
    };
  }

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order");
  if (error) {
    reportReadError(resource, error.code);
    return { records: null, error: true };
  }
  return {
    error: false,
    records: data.map((row): AdminManagedRecord => ({
      id: row.id,
      title: row.platform,
      summary: row.url,
      metadata: `Display order ${row.display_order}${row.icon ? ` · ${row.icon}` : ""}`,
      values: {
        platform: row.platform,
        url: row.url,
        icon: row.icon ?? "",
        display_order: String(row.display_order),
      },
    })),
  };
}
