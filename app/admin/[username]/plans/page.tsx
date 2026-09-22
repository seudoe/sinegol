import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPlanManager } from "@/components/domain/admin-plan-manager";

export default async function AdminPlansPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);

  const admin = createAdminClient();
  const { data: plans } = await admin.from("plans").select("*").order("name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground mt-1">Manage the available subscription tiers.</p>
      </div>
      
      <AdminPlanManager plans={plans || []} username={username} />
    </div>
  );
}
