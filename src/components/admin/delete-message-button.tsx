"use client";

import { deleteMessage } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const action = deleteMessage.bind(null, messageId);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Delete this message permanently? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive">
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
    </form>
  );
}
