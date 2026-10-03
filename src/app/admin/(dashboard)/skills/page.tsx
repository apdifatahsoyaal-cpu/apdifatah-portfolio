import { AdminContentPage } from "../content-page";

export default function SkillsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  return <AdminContentPage resource="skills" searchParams={searchParams} />;
}
