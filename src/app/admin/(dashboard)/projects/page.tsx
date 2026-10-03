import { AdminContentPage } from "../content-page";

export default function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  return <AdminContentPage resource="projects" searchParams={searchParams} />;
}
