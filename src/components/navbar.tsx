"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialIconLink } from "@/components/social-icon-link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SocialLink } from "@/types/database.types";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Bogga Hore", href: "#home" },
  { label: "Igu Saabsan", href: "#about" },
  { label: "Mashaariic", href: "#projects" },
  { label: "Xirfado", href: "#skills" },
  { label: "Adeegyo", href: "#services" },
  { label: "Xiriir", href: "#contact" },
];

export function Navbar({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#home"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="Apdifatah Moh'moud Moh'med, bogga hore"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Code2 aria-hidden="true" className="size-4" />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
            Apdifatah Moh&apos;moud Moh&apos;med
          </span>
        </a>

        <nav aria-label="Liiska bogga" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {socialLinks
            .filter((link) => link.platform.trim().toLowerCase() !== "whatsapp")
            .map((socialLink) => (
              <SocialIconLink
                key={socialLink.id}
                socialLink={socialLink}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 lg:hidden"
            aria-label={isMenuOpen ? "Xir liiska" : "Fur liiska"}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Liiska bogga"
        className={cn(
          "absolute left-0 right-0 top-full flex-col border-b border-border bg-background px-5 py-3 shadow-lg lg:hidden",
          isMenuOpen ? "flex" : "hidden",
        )}
      >
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.label}
          </a>
        ))}
        {socialLinks.some((link) => link.platform.trim().toLowerCase() !== "whatsapp") ? (
          <div className="flex gap-2 border-t border-border px-3 pt-3">
            {socialLinks
              .filter((link) => link.platform.trim().toLowerCase() !== "whatsapp")
              .map((socialLink) => (
                <SocialIconLink
                  key={socialLink.id}
                  socialLink={socialLink}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ))}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
