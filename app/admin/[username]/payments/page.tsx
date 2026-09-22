import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPaymentManager } from "@/components/domain/admin-payment-manager";

export default async function AdminPaymentsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);

  const admin = createAdminClient();
  
  const [
    { data: settings },
    { data: transactions }
  ] = await Promise.all([
    admin.from("platform_settings").select("*").eq("id", 1).single(),
    admin.from("payment_transactions").select("*, profiles(name, username)").order("created_at", { ascending: false })
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments & Billing</h1>
        <p className="text-muted-foreground mt-1">Configure your UPI settings and view user transactions.</p>
      </div>
      
      <AdminPaymentManager 
        transactions={transactions || []} 
        username={username}
        currentUpiId={settings?.upi_id}
        currentUpiName={settings?.upi_name}
      />
    </div>
  );
}
