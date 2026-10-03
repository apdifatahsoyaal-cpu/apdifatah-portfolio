import type { ReactNode } from "react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/contact";

type WhatsAppLinkProps = {
  ariaLabel: string;
  children?: ReactNode;
  className: string;
  href?: string;
  iconClassName?: string;
  iconOnly?: boolean;
  title: string;
};

export function WhatsAppLink({
  ariaLabel,
  children,
  className,
  href = whatsappUrl,
  iconClassName,
  iconOnly = false,
  title,
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={title}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <SiWhatsapp
        aria-hidden="true"
        className={cn("size-4 shrink-0", iconClassName)}
      />
      {iconOnly ? <span className="sr-only">{children ?? "WhatsApp"}</span> : children}
    </a>
  );
}
