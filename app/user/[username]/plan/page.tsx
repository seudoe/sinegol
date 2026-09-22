import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanSubscriber } from "@/components/domain/plan-subscriber";

export default async function UserPlanPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);

  const admin = createAdminClient();
  
  const [
    { data: sub },
    { data: activePlans },
    { data: settings }
  ] = await Promise.all([
    admin.from("subscriptions").select("*").eq("user_id", profile.id).single(),
    admin.from("plans").select("*").is("deleted_at", null).order("price", { ascending: true }),
    admin.from("platform_settings").select("*").eq("id", 1).single()
  ]);

  const hasActivePlan = sub && sub.status === 'active' && new Date(sub.renewal_date) > new Date();

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Subscription Plan</h1>
        <p className="text-muted-foreground mt-1">Manage your active membership tier.</p>
      </div>

      <div className="bg-card border rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Status</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-bold">{sub ? sub.plan : "No Active Plan"}</p>
            {sub && <Badge variant={sub.status === 'active' ? 'default' : 'secondary'} className="capitalize">{sub.status}</Badge>}
          </div>
          {sub && <p className="text-sm text-muted-foreground mt-1">Renews on {new Date(sub.renewal_date).toLocaleDateString()}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Available Plans</h2>
        {activePlans?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plans are currently available for subscription.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlans?.map(p => (
              <Card key={p.id} className={sub?.plan === p.name ? 'border-primary ring-1 ring-primary' : ''}>
                <CardHeader>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="my-2">
                    <span className="text-3xl font-bold">₹{p.price}</span>
                    <span className="text-muted-foreground">/{p.billing_interval}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <PlanSubscriber 
                    planName={p.name} 
                    price={p.price}
                    currentPlan={sub?.plan} 
                    username={username}
                    upiId={settings?.upi_id}
                    upiName={settings?.upi_name}
                    hasActivePlan={hasActivePlan}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
