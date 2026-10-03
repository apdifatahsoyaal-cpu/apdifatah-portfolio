"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { getSupabaseEnvironment } from "./env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnvironment();
  return createBrowserClient<Database>(url, anonKey);
}
