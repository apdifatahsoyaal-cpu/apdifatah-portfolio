"use client";

import { SearchableIconPicker } from "@/components/admin/searchable-icon-picker";
import { serviceIconOptions } from "@/lib/service-icons";

export function ServiceIconPicker({
  id,
  initialValue,
}: {
  id: string;
  initialValue: string;
}) {
  return (
    <SearchableIconPicker
      id={id}
      name="icon"
      label="Service icon"
      options={serviceIconOptions}
      initialValue={initialValue}
    />
  );
}
