"use client";

import Image from "next/image";
import { uploadPortfolioMedia } from "@/app/admin/actions";
import type { AdminResource } from "@/lib/admin-config";
import { Button } from "@/components/ui/button";
import { getSafeExternalUrl } from "@/lib/url";
import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";

const acceptedTypes = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export function MediaField({
  name,
  label,
  id,
  resource,
  initialValue,
}: {
  name: string;
  label: string;
  id: string;
  resource: AdminResource;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputId = `${resource}-${name}-file`;
  const previewUrl = getSafeExternalUrl(value);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setMessage("");
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image files must be smaller than 5 MB.");
      event.currentTarget.value = "";
      return;
    }
    if (!acceptedTypes.split(",").includes(file.type)) {
      setMessage("Use a JPG, PNG, WebP, GIF, or AVIF image.");
      event.currentTarget.value = "";
      return;
    }

    const formData = new FormData();
    formData.set("resource", resource);
    formData.set("file", file);
    startTransition(async () => {
      try {
        const result = await uploadPortfolioMedia(formData);
        if (!result.ok || !("url" in result)) {
          setMessage(result.message);
          return;
        }
        setValue(result.url);
        setMessage("Image uploaded. Save changes to publish it.");
      } catch (error) {
        console.error("Portfolio image upload request failed.", error);
        setMessage("Image upload failed. Please try again.");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <div className="space-y-3">
      <input
        id={id}
        name={name}
        type={resource === "projects" ? "url" : "text"}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="https://..."
        className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
      />
      <div className="flex flex-wrap items-center gap-3">
        {previewUrl ? (
          <div className="relative size-20 overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={previewUrl}
              alt={`${label} preview`}
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="flex size-20 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground"
          >
            <ImagePlus className="size-6" />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            id={fileInputId}
            type="file"
            accept={acceptedTypes}
            className="sr-only"
            aria-label={`Upload ${label.toLowerCase()}`}
            disabled={isPending}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            {isPending ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : (
              <Upload aria-hidden="true" />
            )}
            {isPending ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => {
                setValue("");
                setMessage("Image removed. Save changes to confirm.");
              }}
            >
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WebP, GIF, or AVIF · maximum 5 MB
      </p>
      {message ? (
        <p
          role={message.includes("failed") || message.includes("Use a") || message.includes("smaller") ? "alert" : "status"}
          className={`text-xs ${message.includes("failed") || message.includes("Use a") || message.includes("smaller") ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
