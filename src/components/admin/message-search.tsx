"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function MessageSearch({
  initialValue,
  status,
}: {
  initialValue: string;
  status: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <form action="/admin/messages" method="get" className="flex gap-2">
      {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
      <label htmlFor="message-search" className="sr-only">
        Search messages by sender, email, or subject
      </label>
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="message-search"
          name="q"
          type="search"
          maxLength={100}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="Search sender, email, or subject"
          className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
        />
      </div>
      <button
        type="submit"
        className="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
}
