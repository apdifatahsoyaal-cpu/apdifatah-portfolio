import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/types/database.types";

export type MessageFilter = "all" | ContactMessage["status"];

export function parseMessageFilter(value: string | undefined): MessageFilter {
  if (
    value === "new" ||
    value === "read" ||
    value === "replied" ||
    value === "archived"
  ) {
    return value;
  }
  return "all";
}

export async function getAdminMessages(filter: MessageFilter, search = "") {
  const supabase = await createClient();
  let query = supabase
    .from("contact_messages")
    .select("id,name,email,phone,subject,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filter !== "all") query = query.eq("status", filter);

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load admin contact messages.", error.code);
    return { messages: null, error: true };
  }

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const messages = (data ?? []).filter((message) => {
    if (!normalizedSearch) return true;
    return [message.name, message.email, message.subject].some((value) =>
      value?.toLocaleLowerCase().includes(normalizedSearch),
    );
  });

  return { messages, error: false };
}

export async function getAdminMessageCounts() {
  const supabase = await createClient();
  const [all, newMessages] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  if (all.error || newMessages.error) {
    console.error(
      "Unable to load admin contact message counts.",
      all.error?.code ?? newMessages.error?.code,
    );
    return { total: null, newCount: null, error: true };
  }
  return {
    total: all.count ?? 0,
    newCount: newMessages.count ?? 0,
    error: false,
  };
}

export async function getAdminMessage(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id,name,email,phone,subject,message,status,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("Unable to load admin contact message.", error.code);
    return { message: null, error: true };
  }
  return { message: data as ContactMessage | null, error: false };
}
