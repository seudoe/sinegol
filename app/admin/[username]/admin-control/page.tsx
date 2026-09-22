import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminControlManager } from "@/components/domain/admin-control-manager";

export default async function AdminControlPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireAdmin(username);

  const admin = createAdminClient();
  
  // Fetch all admins and join their approver's name
  const { data: rawAdmins } = await admin
    .from("profiles")
    .select("id, name, username, admin_status, admin_depth, approved_by, approver:profiles!approved_by(name)")
    .eq("role", "admin")
    .order("admin_depth", { ascending: true });

  const admins = rawAdmins?.map(a => ({
    ...a,
    approver: Array.isArray(a.approver) ? a.approver[0] : a.approver
  })) as { id: string; name: string; username: string; admin_status: "pending" | "approved"; admin_depth: number; approved_by: string | null; approver: { name: string } | null }[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Hierarchy Control</h1>
          <p className="text-muted-foreground mt-1">Manage admin access, approve new applications, and control power depth.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Your Clearance</p>
          <p className="text-lg font-bold text-primary">Depth {profile.admin_depth || 0}</p>
        </div>
      </div>
      
      <AdminControlManager 
        admins={admins || []} 
        currentUserId={profile.id}
        currentUserDepth={profile.admin_depth || 0}
        username={username}
      />
    </div>
  );
}
