import { buttonVariants } from "@/components/ui/button";
import { getSafeExternalUrl } from "@/lib/url";
import type { Project } from "@/types/database.types";
import Image from "next/image";
import {
  ArrowUpRight,
  Code2,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const imageUrl = getSafeExternalUrl(project.image_url);
  const githubUrl = getSafeExternalUrl(project.github_url);
  const liveUrl = getSafeExternalUrl(project.live_url);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/5">
      <div
        aria-label={imageUrl ? `${project.title} sawirka mashruuca` : `${project.title} meel sawir`}
        className="relative flex aspect-[1.65] items-center justify-center overflow-hidden border-b border-border bg-muted/45 p-6"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${project.title} sawirka horudhaca mashruuca`}
            fill
            unoptimized
            sizes="(max-width: 767px) 90vw, (max-width: 1279px) 45vw, 380px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.06)_1px,transparent_1px)] bg-[size:24px_24px]"
            />
            <div className="relative w-full max-w-[260px] rounded-xl border border-border/80 bg-background p-4 shadow-lg shadow-foreground/5 transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutDashboard aria-hidden="true" className="size-4" />
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-border" />
                </span>
              </div>
              <div className="space-y-2" aria-hidden="true">
                <span className="block h-2 w-2/5 rounded-full bg-foreground/15" />
                <span className="block h-2 w-4/5 rounded-full bg-foreground/10" />
                <span className="mt-4 block h-12 rounded-lg border border-border/70 bg-muted/55" />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Horudhaca mashruuca
              </p>
            </div>
          </>
        )}
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {project.featured ? "La xushay" : "Mashruuc"}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          {project.title}
        </h3>
        {project.description ? (
          <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((technology, index) => (
            <span
              key={`${project.id}-${technology}-${index}`}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
            >
              {technology}
            </span>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <Code2 aria-hidden="true" />
              GitHub
            </a>
          ) : null}
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              Daawo Toos
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
