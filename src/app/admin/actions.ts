"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminResource } from "@/lib/admin-config";
import type { Database } from "@/types/database.types";

const resourceSchema = z.enum(["projects", "skills", "services", "social_links"]);
const mediaResourceSchema = z.enum(["projects", "skills", "services"]);
const mediaBuckets = {
  projects: "project-images",
  skills: "skill-icons",
  services: "service-icons",
} as const;
const maxMediaSize = 5 * 1024 * 1024;
const imageExtensions = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
const requiredText = z.string().trim().min(1, "This field is required.");
function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const optionalText = z.string().trim().transform((value) => value || null);
const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isHttpUrl(value),
    "Enter a valid http or https URL.",
  )
  .transform((value) => value || null);
const displayOrder = z
  .string()
  .trim()
  .regex(/^\d+$/, "Use a whole number 0 or higher.")
  .transform(Number)
  .pipe(z.number().int().min(0));
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function failure(message: string) {
  return { ok: false, message };
}

function success(message = "Changes saved.") {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/services");
  revalidatePath("/admin/social-links");
  return { ok: true, message };
}

function revalidateMessages() {
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

function hasImageSignature(contentType: keyof typeof imageExtensions, bytes: Uint8Array) {
  const matches = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);
  if (contentType === "image/jpeg") return matches([0xff, 0xd8, 0xff]);
  if (contentType === "image/png") {
    return matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (contentType === "image/gif") {
    return (
      matches([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
      matches([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
    );
  }
  if (contentType === "image/webp") {
    return matches([0x52, 0x49, 0x46, 0x46]) &&
      matches([0x57, 0x45, 0x42, 0x50], 8);
  }
  return (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70 &&
    (new TextDecoder().decode(bytes.slice(8, 12)) === "avif" ||
      new TextDecoder().decode(bytes.slice(8, 12)) === "avis")
  );
}

function managedMediaObject(value: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;
  try {
    const url = new URL(value);
    const base = new URL(baseUrl);
    if (url.origin !== base.origin) return null;
    for (const bucket of Object.values(mediaBuckets)) {
      const prefix = `/storage/v1/object/public/${bucket}/`;
      if (!url.pathname.startsWith(prefix)) continue;
      const path = decodeURIComponent(url.pathname.slice(prefix.length));
      return /^[0-9a-f-]+\.(jpg|png|webp|gif|avif)$/i.test(path)
        ? { bucket, path }
        : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function removeUnreferencedMedia(
  supabase: SupabaseClient<Database>,
  mediaUrl: string,
) {
  const object = managedMediaObject(mediaUrl);
  if (!object) return true;

  const [projects, skills, services] = await Promise.all([
    supabase.from("projects").select("id").eq("image_url", mediaUrl).limit(1),
    supabase.from("skills").select("id").eq("icon", mediaUrl).limit(1),
    supabase.from("services").select("id").eq("icon", mediaUrl).limit(1),
  ]);
  if (projects.error || skills.error || services.error) {
    console.error("Unable to check portfolio media references before removal.");
    return false;
  }
  if (projects.data.length || skills.data.length || services.data.length) {
    return true;
  }

  const { error } = await supabase.storage
    .from(object.bucket)
    .remove([object.path]);
  if (error) {
    console.error("Unable to remove portfolio media.", error.message);
    return false;
  }
  return true;
}

export async function uploadPortfolioMedia(formData: FormData) {
  const resource = mediaResourceSchema.safeParse(formData.get("resource"));
  const file = formData.get("file");
  if (!resource.success || !(file instanceof File)) {
    return failure("Choose a valid image to upload.");
  }
  if (file.size <= 0 || file.size > maxMediaSize) {
    return failure("Image files must be smaller than 5 MB.");
  }

  const contentType = file.type as keyof typeof imageExtensions;
  const extension = imageExtensions[contentType];
  if (!extension) {
    return failure("Use a JPG, PNG, WebP, GIF, or AVIF image.");
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!hasImageSignature(contentType, header)) {
    return failure("The selected file does not match its image type.");
  }

  const { supabase } = await requireAdmin();
  const bucket = mediaBuckets[resource.data];
  const path = `${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Unable to upload portfolio media.", error);
    const errorMessage = error.message.toLowerCase();
    if (
      errorMessage.includes("bucket not found") ||
      errorMessage.includes("not found")
    ) {
      return failure(
        `The ${bucket} bucket is missing or unavailable. Apply the resource media buckets migration in Supabase, then try again.`,
      );
    }
    if (
      errorMessage.includes("row-level security") ||
      errorMessage.includes("not authorized") ||
      errorMessage.includes("permission denied") ||
      error.statusCode === "403"
    ) {
      return failure(
        "Supabase denied this upload. Confirm your account has the portfolio admin claim and the Storage policies are applied.",
      );
    }
    console.error(
      "Portfolio media upload returned an unexpected Storage error.",
      { statusCode: error.statusCode, message: error.message },
    );
    return failure(
      `Upload to ${bucket} failed${error.statusCode ? ` (Storage ${error.statusCode})` : ""}. Check the Supabase Storage bucket and policies.`,
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, message: "Image uploaded.", url: data.publicUrl };
}

export async function saveContentRecord(
  requestedResource: AdminResource,
  recordId: string | null,
  formData: FormData,
) {
  const resourceResult = resourceSchema.safeParse(requestedResource);
  if (!resourceResult.success) return failure("Invalid content type.");
  const resource = resourceResult.data;
  const { supabase } = await requireAdmin();
  const id = recordId ? z.string().uuid().safeParse(recordId) : null;
  if (recordId && !id?.success) return failure("Invalid record.");

  let error: { code: string; message: string } | null = null;
  let previousMediaUrl: string | null = null;
  let nextMediaUrl: string | null = null;

  if (resource === "projects") {
    const parsed = z
      .object({
        title: requiredText,
        slug: slugSchema,
        description: optionalText,
        image_url: optionalUrl,
        github_url: optionalUrl,
        live_url: optionalUrl,
        technologies: z.array(z.string().trim().min(1)).max(30),
        featured: z.boolean(),
      })
      .safeParse({
        title: text(formData, "title"),
        slug: text(formData, "slug"),
        description: text(formData, "description"),
        image_url: text(formData, "image_url"),
        github_url: text(formData, "github_url"),
        live_url: text(formData, "live_url"),
        technologies: text(formData, "technologies")
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean),
        featured: formData.get("featured") === "on",
      });
    if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check the project fields.");
    if (recordId) {
      const previous = await supabase
        .from("projects")
        .select("image_url")
        .eq("id", recordId)
        .maybeSingle();
      if (previous.error) return failure("Unable to load the existing project image.");
      previousMediaUrl = previous.data?.image_url ?? null;
      ({ error } = await supabase.from("projects").update(parsed.data).eq("id", recordId));
    } else {
      ({ error } = await supabase.from("projects").insert(parsed.data));
    }
    nextMediaUrl = parsed.data.image_url;
  } else if (resource === "skills") {
    const parsed = z
      .object({
        name: requiredText,
        category: z.enum(["Frontend", "Backend", "Database", "AI", "Tools"]),
        icon: optionalText,
        display_order: displayOrder,
      })
      .safeParse({
        name: text(formData, "name"),
        category: text(formData, "category"),
        icon: text(formData, "icon"),
        display_order: text(formData, "display_order"),
      });
    if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check the skill fields.");
    if (recordId) {
      const previous = await supabase
        .from("skills")
        .select("icon")
        .eq("id", recordId)
        .maybeSingle();
      if (previous.error) return failure("Unable to load the existing skill image.");
      previousMediaUrl = previous.data?.icon ?? null;
      ({ error } = await supabase.from("skills").update(parsed.data).eq("id", recordId));
    } else {
      ({ error } = await supabase.from("skills").insert(parsed.data));
    }
    nextMediaUrl = parsed.data.icon;
  } else if (resource === "services") {
    const parsed = z
      .object({
        title: requiredText,
        description: optionalText,
        icon: optionalText,
        display_order: displayOrder,
      })
      .safeParse({
        title: text(formData, "title"),
        description: text(formData, "description"),
        icon: text(formData, "icon"),
        display_order: text(formData, "display_order"),
      });
    if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check the service fields.");
    if (recordId) {
      const previous = await supabase
        .from("services")
        .select("icon")
        .eq("id", recordId)
        .maybeSingle();
      if (previous.error) return failure("Unable to load the existing service image.");
      previousMediaUrl = previous.data?.icon ?? null;
      ({ error } = await supabase.from("services").update(parsed.data).eq("id", recordId));
    } else {
      ({ error } = await supabase.from("services").insert(parsed.data));
    }
    nextMediaUrl = parsed.data.icon;
  } else {
    const parsed = z
      .object({
        platform: requiredText,
        url: z.string().trim().url("Enter a valid URL.").refine((value) => /^https?:/i.test(value), "Use an http or https URL."),
        icon: optionalText,
        display_order: displayOrder,
      })
      .safeParse({
        platform: text(formData, "platform"),
        url: text(formData, "url"),
        icon: text(formData, "icon"),
        display_order: text(formData, "display_order"),
      });
    if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Check the social link fields.");
    if (recordId) {
      ({ error } = await supabase.from("social_links").update(parsed.data).eq("id", recordId));
    } else {
      ({ error } = await supabase.from("social_links").insert(parsed.data));
    }
  }

  if (error) {
    console.error(`Unable to save ${resource}.`, error.code);
    return failure(
      error.code === "23505"
        ? "A project with that slug already exists."
        : "Unable to save changes. Check your admin access and the submitted values.",
    );
  }
  if (
    previousMediaUrl &&
    previousMediaUrl !== nextMediaUrl &&
    !(await removeUnreferencedMedia(supabase, previousMediaUrl))
  ) {
    return success("Changes saved, but the previous image could not be removed from storage.");
  }
  return success();
}

export async function deleteContentRecord(
  requestedResource: AdminResource,
  recordId: string,
) {
  const resourceResult = resourceSchema.safeParse(requestedResource);
  if (!resourceResult.success) return failure("Invalid content type.");
  const resource = resourceResult.data;
  const { supabase } = await requireAdmin();
  if (!z.string().uuid().safeParse(recordId).success) {
    return failure("Invalid record.");
  }

  let previousMediaUrl: string | null = null;
  if (resource === "projects") {
    const previous = await supabase
      .from("projects")
      .select("image_url")
      .eq("id", recordId)
      .maybeSingle();
    if (previous.error) return failure("Unable to load the project image.");
    previousMediaUrl = previous.data?.image_url ?? null;
  } else if (resource === "skills" || resource === "services") {
    const previous =
      resource === "skills"
        ? await supabase.from("skills").select("icon").eq("id", recordId).maybeSingle()
        : await supabase.from("services").select("icon").eq("id", recordId).maybeSingle();
    if (previous.error) return failure("Unable to load the existing image.");
    previousMediaUrl = previous.data?.icon ?? null;
  }

  const result =
    resource === "projects"
      ? await supabase.from("projects").delete().eq("id", recordId)
      : resource === "skills"
        ? await supabase.from("skills").delete().eq("id", recordId)
        : resource === "services"
          ? await supabase.from("services").delete().eq("id", recordId)
          : await supabase.from("social_links").delete().eq("id", recordId);

  if (result.error) {
    console.error(`Unable to delete ${resource}.`, result.error.code);
    return failure("Unable to delete this record. Check your admin access.");
  }
  if (
    previousMediaUrl &&
    !(await removeUnreferencedMedia(supabase, previousMediaUrl))
  ) {
    return success("Record deleted, but its image could not be removed from storage.");
  }
  return success();
}

export async function logoutAction() {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Unable to end admin session.", error.message);
    throw new Error("Unable to log out. Please try again.");
  }
  redirect("/admin/login");
}

const messageStatusSchema = z.enum(["new", "read", "replied", "archived"]);

export async function updateMessageStatus(
  messageId: string,
  statusValue: string,
) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(messageId);
  const status = messageStatusSchema.safeParse(statusValue);
  if (!id.success || !status.success) {
    redirect("/admin/messages?error=invalid");
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({ status: status.data })
    .eq("id", id.data);

  if (error) {
    console.error("Unable to update contact message status.", error.code);
    redirect(`/admin/messages/${id.data}?error=update`);
  }
  revalidateMessages();
  redirect(`/admin/messages/${id.data}?updated=1`);
}

export async function deleteMessage(messageId: string) {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(messageId);
  if (!id.success) redirect("/admin/messages?error=invalid");

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id.data);
  if (error) {
    console.error("Unable to delete contact message.", error.code);
    redirect(`/admin/messages/${id.data}?error=delete`);
  }

  revalidateMessages();
  redirect("/admin/messages?deleted=1");
}
