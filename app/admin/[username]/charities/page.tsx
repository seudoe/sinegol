import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminCharityManager } from "@/components/domain/admin-charity-manager";

export default async function AdminCharitiesPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);

  const admin = createAdminClient();
  const { data: charities } = await admin.from("charities").select("*").order("featured", { ascending: false }).order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Manage Charities</h1>
      <AdminCharityManager charities={charities || []} username={username} />
    </div>
  );
}
