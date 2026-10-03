import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { BriefcaseBusiness, Code2, Link2 } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/contact";
import { getSafeExternalUrl } from "@/lib/url";
import type { SocialLink } from "@/types/database.types";

export function SocialIconLink({
  socialLink,
  className,
}: {
  socialLink: SocialLink;
  className: string;
}) {
  const href =
    socialLink.platform.trim().toLowerCase() === "whatsapp"
      ? getWhatsAppUrl(socialLink.url)
      : getSafeExternalUrl(socialLink.url);
  if (!href) return null;

  const platform = socialLink.platform.toLowerCase();
  const Icon =
    platform === "whatsapp"
      ? SiWhatsapp
      : platform === "github"
        ? Code2
        : platform === "linkedin"
          ? BriefcaseBusiness
          : Link2;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${socialLink.platform}`}
      title={socialLink.platform}
      className={className}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="sr-only">{socialLink.platform}</span>
    </a>
  );
}
