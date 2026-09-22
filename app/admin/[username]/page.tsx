import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  const admin = createAdminClient();
  const [{ count: totalUsers }, { count: activeSubs }, { data: winners }] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    admin.from("winners").select("prize_amount")
  ]);
  
  const totalWinnings = (winners || []).reduce((sum, w) => sum + Number(w.prize_amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Admin Console
      </h1>
      <p className="text-muted-foreground mt-[-1rem]">Welcome to the Sinegol administration area.</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalUsers || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{activeSubs || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Winnings Awarded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">${totalWinnings.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex gap-4 mt-4 flex-wrap">
        <Button nativeButton={false} render={<Link href={`/admin/${username}/analytics`} />}>
          Detailed Analytics
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href={`/admin/${username}/draws`} />}>
          Manage Draws
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href={`/admin/${username}/winners`} />}>
          Review Winners
        </Button>
      </div>
    </div>
  );
}
