"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkillIconOption } from "@/lib/skill-icons";
import { getSafeExternalUrl } from "@/lib/url";

export function SearchableIconPicker({
  id,
  name,
  label,
  options,
  initialValue,
}: {
  id: string;
  name: string;
  label: string;
  options: readonly SkillIconOption[];
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.id === value);
  const filteredOptions = options.filter((option) =>
    `${option.label} ${option.id}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const activeOption = filteredOptions[activeIndex];
  const legacyImage = !selectedOption ? getSafeExternalUrl(value) : null;

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "ArrowDown" && filteredOptions.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filteredOptions.length);
    } else if (event.key === "ArrowUp" && filteredOptions.length > 0) {
      event.preventDefault();
      setActiveIndex((current) =>
        (current - 1 + filteredOptions.length) % filteredOptions.length,
      );
    } else if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      setValue(activeOption.id);
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }

  function openPicker() {
    setQuery("");
    setActiveIndex(0);
    setIsOpen(true);
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          ref={triggerRef}
          id={id}
          type="button"
          variant="outline"
          aria-label={selectedOption ? `${label}: ${selectedOption.label}` : label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        >
          {selectedOption ? (
            <>
              {selectedOption.render("size-4")}
              {selectedOption.label}
            </>
          ) : legacyImage ? (
            <>
              <Image
                src={legacyImage}
                alt=""
                width={16}
                height={16}
                unoptimized
                className="size-4 rounded-sm object-contain"
              />
              Existing image
            </>
          ) : (
            "Choose Icon"
          )}
          <ChevronDown aria-hidden="true" className="ml-auto size-4" />
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Remove ${label.toLowerCase()}`}
            onClick={() => setValue("")}
          >
            <X aria-hidden="true" />
            Remove
          </Button>
        ) : null}
      </div>

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-64 max-w-md rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchRef}
              type="search"
              role="combobox"
              aria-label={`Search ${label.toLowerCase()}s`}
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-activedescendant={
                activeOption ? `${listboxId}-option-${activeIndex}` : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${label.toLowerCase()}s...`}
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>
          <div
            id={listboxId}
            role="listbox"
            aria-label={`Available ${label.toLowerCase()}s`}
            className="mt-2 max-h-64 overflow-y-auto"
          >
            {filteredOptions.map((option, index) => (
              <button
                key={option.id}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={value === option.id}
                className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent ${
                  activeIndex === index ? "bg-accent" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  setValue(option.id);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                {option.render("size-4 shrink-0")}
                <span className="flex-1">{option.label}</span>
                {value === option.id ? (
                  <Check aria-hidden="true" className="size-4 text-primary" />
                ) : null}
              </button>
            ))}
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-5 text-center text-sm text-muted-foreground">
                No matching icons.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {legacyImage ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Existing image URL will be kept unless you choose or remove an icon.
        </p>
      ) : null}
    </div>
  );
}
