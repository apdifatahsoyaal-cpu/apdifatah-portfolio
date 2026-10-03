import { AdminContentPage } from "../content-page";

export default function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  return <AdminContentPage resource="services" searchParams={searchParams} />;
}
