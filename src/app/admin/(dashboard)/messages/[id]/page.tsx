import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMessageStatus } from "@/app/admin/actions";
import { DeleteMessageButton } from "@/components/admin/delete-message-button";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMessage } from "@/lib/admin-messages";
import type { ContactMessage } from "@/types/database.types";
import { ArrowLeft, Archive, Mail, RotateCcw } from "lucide-react";

const statusActions: Record<
  ContactMessage["status"],
  { label: string; next: ContactMessage["status"]; icon: typeof Mail }[]
> = {
  new: [
    { label: "Mark as read", next: "read", icon: Mail },
    { label: "Mark as replied", next: "replied", icon: Mail },
    { label: "Archive", next: "archived", icon: Archive },
  ],
  read: [
    { label: "Mark as replied", next: "replied", icon: Mail },
    { label: "Archive", next: "archived", icon: Archive },
  ],
  replied: [
    { label: "Mark as read", next: "read", icon: Mail },
    { label: "Archive", next: "archived", icon: Archive },
  ],
  archived: [
    { label: "Restore as new", next: "new", icon: RotateCcw },
    { label: "Restore as read", next: "read", icon: RotateCcw },
  ],
};

export default async function AdminMessageDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const result = await getAdminMessage(id);
  if (result.error) {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/20 bg-background p-6 text-sm text-destructive">
        This message could not be loaded. Check the admin message policies.
      </div>
    );
  }
  if (!result.message) notFound();

  const message = result.message;
  const actions = statusActions[message.status];

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to messages
      </Link>

      {query.updated === "1" ? (
        <p role="status" className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
          Message status updated.
        </p>
      ) : null}
      {query.error ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          The requested action could not be completed.
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize text-secondary-foreground">
              {message.status}
            </span>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              {message.subject || "No subject"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Received{" "}
              <time dateTime={message.created_at}>
                {new Date(message.created_at).toLocaleString()}
              </time>
            </p>
          </div>
        </div>

        <dl className="grid gap-4 border-b border-border py-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Name
            </dt>
            <dd className="mt-1 font-medium">{message.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1 break-all">
              {message.email ? (
                <a
                  href={`mailto:${message.email}`}
                  className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {message.email}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Phone
            </dt>
            <dd className="mt-1">
              {message.phone ? (
                <a href={`tel:${message.phone}`} className="text-primary hover:underline">
                  {message.phone}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="py-6">
          <h2 className="text-sm font-semibold">Message</h2>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">
            {message.message}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
          {actions.map(({ label, next, icon: Icon }) => (
            <form
              key={next}
              action={updateMessageStatus.bind(null, message.id, next)}
            >
              <Button type="submit" variant={next === "archived" ? "outline" : "default"}>
                <Icon aria-hidden="true" />
                {label}
              </Button>
            </form>
          ))}
          <DeleteMessageButton messageId={message.id} />
        </div>
      </div>
    </article>
  );
}
