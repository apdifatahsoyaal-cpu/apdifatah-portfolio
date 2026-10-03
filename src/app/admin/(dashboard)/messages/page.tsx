import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMessages, parseMessageFilter } from "@/lib/admin-messages";
import { MessageSearch } from "@/components/admin/message-search";
import { MessageSquare, Search } from "lucide-react";

const filters = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
] as const;

const statusStyles = {
  new: "bg-primary/10 text-primary",
  read: "bg-secondary text-secondary-foreground",
  replied: "bg-blue-100 text-blue-800",
  archived: "bg-muted text-muted-foreground",
} as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const filter = parseMessageFilter(params.status);
  const search = (params.q ?? "").slice(0, 100);
  const result = await getAdminMessages(filter, search);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Private inbox
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact messages are only available to authorized portfolio admins.
        </p>
      </div>

      {params.deleted === "1" ? (
        <p role="status" className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
          Message deleted.
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          The requested action could not be completed.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:p-5">
        <div className="flex flex-wrap gap-2" aria-label="Filter messages">
          {filters.map(({ value, label }) => {
            const active = filter === value;
            const query = new URLSearchParams();
            if (value !== "all") query.set("status", value);
            if (search) query.set("q", search);
            const suffix = query.size ? `?${query.toString()}` : "";
            return (
              <Link
                key={value}
                href={`/admin/messages${suffix}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <MessageSearch initialValue={search} status={filter} />
      </div>

      {result.error || !result.messages ? (
        <div role="alert" className="rounded-2xl border border-destructive/20 bg-background p-6 text-sm text-destructive">
          Messages could not be loaded. Check the admin message policies in Supabase.
        </div>
      ) : result.messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
            {search ? <Search aria-hidden="true" /> : <MessageSquare aria-hidden="true" />}
          </span>
          <p className="mt-4 font-medium">
            {search || filter !== "all" ? "No matching messages." : "No messages yet."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {search ? "Try a different search." : "New contact form submissions will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {result.messages.map((message) => (
            <Link
              key={message.id}
              href={`/admin/messages/${message.id}`}
              className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{message.name}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[message.status]}`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {[message.email, message.phone].filter(Boolean).join(" · ") || "No contact details"}
                  </p>
                  {message.subject ? (
                    <p className="mt-3 text-sm font-medium">{message.subject}</p>
                  ) : null}
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {message.message}
                  </p>
                </div>
                <time
                  dateTime={message.created_at}
                  className="shrink-0 text-xs text-muted-foreground"
                >
                  {new Date(message.created_at).toLocaleString()}
                </time>
              </div>
            </Link>
          ))}
          {result.messages.length === 500 ? (
            <p className="text-center text-xs text-muted-foreground">
              Showing the 500 most recent messages. Use search and filters to narrow the list.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
