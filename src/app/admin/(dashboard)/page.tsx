import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMessageCounts } from "@/lib/admin-messages";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Layers3,
  Link2,
  MessageSquare,
  Plus,
  Wrench,
} from "lucide-react";

const sections = [
  { key: "projects", label: "Projects", href: "/admin/projects", icon: Code2 },
  { key: "skills", label: "Skills", href: "/admin/skills", icon: Layers3 },
  { key: "services", label: "Services", href: "/admin/services", icon: Wrench },
  {
    key: "social_links",
    label: "Social Links",
    href: "/admin/social-links",
    icon: Link2,
  },
] as const;

export default async function AdminDashboardPage() {
  const { supabase, user } = await requireAdmin();
  const counts = await Promise.all(
    sections.map(({ key }) =>
      supabase.from(key).select("id", { count: "exact", head: true }),
    ),
  );
  const messageCounts = await getAdminMessageCounts();

  return (
    <div className="space-y-9">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Portfolio CMS
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      </div>

      <section aria-label="Content overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map(({ key, label, href, icon: Icon }, index) => {
          const result = counts[index];
          return (
            <Link
              key={key}
              href={href}
              className="rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">Total {label}</p>
              <p className="mt-1 text-3xl font-semibold">
                {result.error ? "—" : result.count ?? 0}
              </p>
              {result.error ? (
                <span className="mt-2 block text-xs text-destructive">
                  Count unavailable
                </span>
              ) : null}
            </Link>
          );
        })}
      </section>

      <section
        aria-label="Message overview"
        className="grid gap-4 sm:grid-cols-2"
      >
        <Link
          href="/admin/messages"
          className="rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-5 text-sm text-muted-foreground">Total Messages</p>
          <p className="mt-1 text-3xl font-semibold">
            {messageCounts.error ? "—" : messageCounts.total}
          </p>
        </Link>
        <Link
          href="/admin/messages?status=new"
          className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageSquare aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-5 text-sm text-muted-foreground">New Messages</p>
          <p className="mt-1 text-3xl font-semibold">
            {messageCounts.error ? "—" : messageCounts.newCount}
          </p>
          {messageCounts.newCount !== null && messageCounts.newCount > 0 ? (
            <span className="mt-2 inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              {messageCounts.newCount} need attention
            </span>
          ) : null}
        </Link>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump straight to a content collection.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map(({ key, label, href, icon: Icon }) => (
            <Link
              key={key}
              href={`${href}?new=1`}
              className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-4 py-4 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3">
                <Icon aria-hidden="true" className="size-4 text-primary" />
                <Plus aria-hidden="true" className="size-3.5 text-muted-foreground" />
                Add {label.replace(/s$/, "")}
              </span>
              <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
        <BriefcaseBusiness aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Your public site reads portfolio collections from Supabase. Contact
          messages are not managed here.
        </p>
      </div>
    </div>
  );
}
