"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/types/database.types";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Fadlan geli magacaaga.").max(120, "Magacu aad buu u dheer yahay."),
  email: z
    .string()
    .trim()
    .max(254, "Iimaylku aad buu u dheer yahay.")
    .refine((value) => value === "" || z.email().safeParse(value).success, "Fadlan geli iimayl sax ah.")
    .transform((value) => value || null),
  phone: z
    .string()
    .trim()
    .max(30, "Lambarka telefoonku aad buu u dheer yahay.")
    .refine(
      (value) => value === "" || /^[+()\d.\s-]{6,30}$/.test(value),
      "Fadlan geli lambar telefoon oo sax ah.",
    )
    .transform((value) => value || null),
  subject: z
    .string()
    .trim()
    .max(160, "Mawduucu aad buu u dheer yahay.")
    .transform((value) => value || null),
  message: z
    .string()
    .trim()
    .min(10, "Fariintu ha ahaato ugu yaraan 10 xaraf.")
    .max(5000, "Fariintu aad bay u dheer tahay."),
});

function formValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formValue(formData, "company_website").trim()) {
    return {
      status: "success",
      message: "Waad mahadsan tahay! Fariintaada si guul leh ayaa loo diray.",
    };
  }

  const parsed = contactMessageSchema.safeParse({
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    phone: formValue(formData, "phone"),
    subject: formValue(formData, "subject"),
    message: formValue(formData, "message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Foomka hubi oo mar kale isku day.",
    };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error("Contact form could not initialize Supabase: missing configuration.");
    return {
      status: "error",
      message: "Foomka xiriirku hadda ma shaqaynayo. Fadlan mar kale isku day.",
    };
  }

  const supabase = createClient<Database>(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.from("contact_messages").insert(parsed.data);

  if (error) {
    console.error("Contact form submission failed.", error.code);
    return {
      status: "error",
      message: "Fariinta lama diri karin. Fadlan wax yar ka dib mar kale isku day.",
    };
  }

  return {
    status: "success",
    message: "Waad mahadsan tahay! Fariintaada si guul leh ayaa loo diray.",
  };
}
