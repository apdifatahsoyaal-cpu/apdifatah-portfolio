import { createClient } from "@/lib/supabase/server";
import type { Project, Service, Skill, SocialLink } from "@/types/database.types";

export { getSafeExternalUrl } from "@/lib/url";

export type PortfolioContentResult<T> =
  | { data: T[]; error: false }
  | { data: null; error: true };

async function loadContent<T>(
  label: string,
  query: (client: Awaited<ReturnType<typeof createClient>>) => Promise<{
    data: T[] | null;
    error: { code: string; message: string } | null;
  }>,
): Promise<PortfolioContentResult<T>> {
  try {
    const client = await createClient();
    const { data, error } = await query(client);
    if (error) {
      console.error(`Unable to load public ${label}.`, error.code);
      return { data: null, error: true };
    }
    return { data: data ?? [], error: false };
  } catch (error) {
    console.error(
      `Unable to initialize public ${label}.`,
      error instanceof Error ? error.message : "Unexpected error",
    );
    return { data: null, error: true };
  }
}

export function getFeaturedProjects() {
  return loadContent<Project>("projects", async (client) =>
    client
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false }),
  );
}

export function getSkills() {
  return loadContent<Skill>("skills", async (client) =>
    client.from("skills").select("*").order("display_order"),
  );
}

export function getServices() {
  return loadContent<Service>("services", async (client) =>
    client.from("services").select("*").order("display_order"),
  );
}

export function getSocialLinks() {
  return loadContent<SocialLink>("social links", async (client) =>
    client.from("social_links").select("*").order("display_order"),
  );
}
