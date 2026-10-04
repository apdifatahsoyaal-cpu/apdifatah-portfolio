"use client";

import { deleteContentRecord, saveContentRecord } from "@/app/admin/actions";
import { MediaField } from "@/components/admin/media-field";
import { SkillIconPicker } from "@/components/admin/skill-icon-picker";
import type {
  AdminField,
  AdminManagedRecord,
  AdminResource,
} from "@/lib/admin-config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type ContentManagerProps = {
  resource: AdminResource;
  title: string;
  description: string;
  fields: AdminField[];
  records: AdminManagedRecord[];
  initialCreate?: boolean;
};

export function ContentManager({
  resource,
  title,
  description,
  fields,
  records,
  initialCreate = false,
}: ContentManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminManagedRecord | "new" | null>(
    initialCreate ? "new" : null,
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editing === null) return;
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const id = editing === "new" ? null : editing.id;

    startTransition(async () => {
      const result = await saveContentRecord(resource, id, formData);
      setMessage(result.message);
      if (result.ok) {
        setEditing(null);
        router.refresh();
      }
    });
  }

  function handleDelete(record: AdminManagedRecord) {
    if (!window.confirm(`Delete “${record.title}”? This cannot be undone.`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteContentRecord(resource, record.id);
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Content management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <Button type="button" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" />
          Add {title.replace(/s$/, "")}
        </Button>
      </div>

      {message ? (
        <p
          role="status"
          className="rounded-lg border border-border bg-background px-4 py-3 text-sm"
        >
          {message}
        </p>
      ) : null}

      {editing !== null ? (
        <form
          key={editing === "new" ? "new" : editing.id}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-primary/20 bg-background p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editing === "new" ? `Add ${title.replace(/s$/, "")}` : `Edit ${editing.title}`}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close editor"
              onClick={() => setEditing(null)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const value =
                editing === "new" ? undefined : editing.values[field.name];
              const fieldId = `${resource}-${field.name}`;
              return (
                <div
                  key={field.name}
                  className={
                    field.type === "textarea" ||
                    field.type === "skill-icon" ||
                    field.media
                      ? "space-y-2 sm:col-span-2"
                      : "space-y-2"
                  }
                >
                  {field.type === "checkbox" ? (
                    <label
                      htmlFor={fieldId}
                      className="flex min-h-11 items-center gap-3 text-sm font-medium"
                    >
                      <input
                        id={fieldId}
                        name={field.name}
                        type="checkbox"
                        defaultChecked={typeof value === "boolean" ? value : false}
                        className="size-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      {field.label}
                    </label>
                  ) : (
                    <>
                      <label htmlFor={fieldId} className="text-sm font-medium">
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>
                      {field.type === "skill-icon" ? (
                        <SkillIconPicker
                          key={`${fieldId}-${editing === "new" ? "new" : editing.id}`}
                          id={fieldId}
                          initialValue={typeof value === "string" ? value : ""}
                        />
                      ) : field.media ? (
                        <MediaField
                          key={`${fieldId}-${editing === "new" ? "new" : editing.id}`}
                          name={field.name}
                          label={field.label}
                          id={fieldId}
                          resource={resource}
                          initialValue={typeof value === "string" ? value : ""}
                        />
                      ) : field.type === "textarea" ? (
                        <textarea
                          id={fieldId}
                          name={field.name}
                          required={field.required}
                          rows={field.name === "technologies" ? 4 : 3}
                          defaultValue={typeof value === "string" ? value : ""}
                          placeholder={field.hint}
                          className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={fieldId}
                          name={field.name}
                          required={field.required}
                          defaultValue={typeof value === "string" ? value : ""}
                          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={fieldId}
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          min={field.type === "number" ? 0 : undefined}
                          step={field.type === "number" ? 1 : undefined}
                          defaultValue={typeof value === "string" ? value : ""}
                          placeholder={field.hint}
                          className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
                        />
                      )}
                      {field.hint && field.type !== "textarea" ? (
                        <p className="text-xs text-muted-foreground">{field.hint}</p>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {message && editing !== null ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {message}
            </p>
          ) : null}
          <div className="mt-5 flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
          <p className="font-medium">No {title.toLowerCase()} yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first item to start managing this section.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="divide-y divide-border">
            {records.map((record) => (
              <article
                key={record.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{record.title}</h2>
                  <p className="mt-1 break-all text-xs text-muted-foreground">
                    {record.summary}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {record.metadata}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setEditing(record)}
                  >
                    <Pencil aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(record)}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
