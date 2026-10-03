import { ContentManager } from "@/components/admin/content-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminRecords } from "@/lib/admin-data";
import { adminResources, type AdminResource } from "@/lib/admin-config";

export async function AdminContentPage({
  resource,
  searchParams,
}: {
  resource: AdminResource;
  searchParams?: Promise<{ new?: string }>;
}) {
  await requireAdmin();
  const result = await getAdminRecords(resource);
  const config = adminResources[resource];
  const params = searchParams ? await searchParams : undefined;

  if (result.error || !result.records) {
    return (
      <section className="rounded-2xl border border-destructive/20 bg-background p-6">
        <h1 className="text-2xl font-semibold">{config.title}</h1>
        <p role="alert" className="mt-3 text-sm text-destructive">
          Unable to load this content. Check that the admin policies migration
          has been applied and your account is authorized.
        </p>
      </section>
    );
  }

  return (
    <ContentManager
      resource={resource}
      title={config.title}
      description={config.description}
      fields={config.fields}
      records={result.records}
      initialCreate={params?.new === "1"}
    />
  );
}
