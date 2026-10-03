import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    error === "not-authorized"
      ? "This account is not authorized to manage the portfolio."
      : error === "configuration"
        ? "Supabase is not configured. Add the required environment variables."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/35 px-5 py-12">
      <LoginForm initialError={message} />
    </main>
  );
}
