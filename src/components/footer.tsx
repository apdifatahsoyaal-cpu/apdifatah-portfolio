import { SocialIconLink } from "@/components/social-icon-link";
import type { SocialLink } from "@/types/database.types";

export function Footer({
  socialLinks,
}: {
  socialLinks: SocialLink[];
}) {
  return (
    <footer id="site-footer" className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          © {new Date().getFullYear()} Apdifatah Moh&apos;moud Moh&apos;med. Xuquuqda oo dhan way dhowran tahay.
        </p>
        <div className="flex items-center gap-5">
          {socialLinks
            .filter((link) => link.platform.trim().toLowerCase() !== "whatsapp")
            .map((socialLink) => (
              <SocialIconLink
                key={socialLink.id}
                socialLink={socialLink}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ))}
          <a
            href="#home"
            className="w-fit transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ku noqo bilowga ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
