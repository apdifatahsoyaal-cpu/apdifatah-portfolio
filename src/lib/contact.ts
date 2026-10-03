export const whatsappMessage =
  "Hello Apdifatah, I found your portfolio and I'd like to discuss a project with you.";

export const whatsappUrl = `https://wa.me/252636948452?text=${encodeURIComponent(whatsappMessage)}`;

export function getWhatsAppUrl(value?: string) {
  if (!value) return whatsappUrl;

  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "wa.me",
      "api.whatsapp.com",
      "web.whatsapp.com",
    ]);
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
      return whatsappUrl;
    }
    if (!url.searchParams.has("text")) {
      url.searchParams.set("text", whatsappMessage);
    }
    return url.toString();
  } catch {
    return whatsappUrl;
  }
}
