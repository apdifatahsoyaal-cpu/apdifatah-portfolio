import { AdminContentPage } from "../content-page";

export default function SocialLinksAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  return <AdminContentPage resource="social_links" searchParams={searchParams} />;
}
