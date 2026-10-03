"use client";

import { useEffect, useState } from "react";
import { WhatsAppLink } from "@/components/whatsapp-link";

export function FloatingWhatsApp({ href }: { href: string }) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <WhatsAppLink
      ariaLabel="WhatsApp kala sheekayso Apdifatah"
      title="WhatsApp kala sheekayso Apdifatah"
      href={href}
      iconClassName="size-7"
      iconOnly
      className={`floating-whatsapp fixed bottom-5 right-4 z-40 size-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:scale-105 hover:bg-[#20BD5A] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-7 sm:right-7 ${
        footerVisible
          ? "pointer-events-none translate-y-3 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    />
  );
}
