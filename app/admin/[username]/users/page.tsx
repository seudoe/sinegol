import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);

  const admin = createAdminClient();
  const { data: users } = await admin.from("profiles").select(`
    id, username, name, email, role,
    subscriptions (plan, status, amount),
    golf_scores (score, played_date)
  `).order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Users Database</h1>
      <div className="grid gap-6">
        {users?.map(u => {
          const sub = Array.isArray(u.subscriptions) ? u.subscriptions[0] : u.subscriptions;
          const scores = Array.isArray(u.golf_scores) ? u.golf_scores : [];
          
          return (
            <Card key={u.id}>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{u.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{u.email} &middot; @{u.username}</p>
                  </div>
                  {u.role === 'admin' && <Badge variant="default">Admin</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Subscription</h4>
                  {sub ? (
                    <div className="text-sm">
                      <p className="capitalize font-medium">{sub.plan} Plan</p>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        Status: 
                        <Badge variant={sub.status === 'active' ? 'secondary' : 'outline'} className="capitalize text-[10px] py-0">{sub.status}</Badge>
                      </p>
                      <p className="text-muted-foreground mt-1">${sub.amount}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No subscription</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Recent Scores ({scores.length}/5)</h4>
                  {scores.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scores.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {s.score} <span className="opacity-50 ml-1">({new Date(s.played_date).toLocaleDateString()})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No scores logged</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
