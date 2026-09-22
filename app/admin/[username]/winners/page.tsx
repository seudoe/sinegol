import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminWinnerManager } from "@/components/domain/admin-winner-manager";

export default async function AdminWinnersPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);

  const admin = createAdminClient();
  const { data: winners } = await admin
    .from("winners")
    .select(`*, draws (month, method), profiles (name, email)`)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Winners & Payouts</h1>
      
      {winners?.length === 0 ? (
        <p className="text-sm text-muted-foreground">No winners to manage yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners?.map(w => (
            <Card key={w.id} className={w.payout_status === 'paid' ? 'opacity-80' : 'border-primary/50'}>
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{w.profiles?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{w.draws?.month} Draw</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">${Number(w.prize_amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{w.match_tier} Matches</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification:</span>
                  <Badge variant={w.verification_status === 'approved' ? 'default' : w.verification_status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize text-[10px] py-0">
                    {w.verification_status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payout:</span>
                  <Badge variant={w.payout_status === 'paid' ? 'default' : 'outline'} className="capitalize text-[10px] py-0">
                    {w.payout_status}
                  </Badge>
                </div>
                
                <AdminWinnerManager 
                  winnerId={w.id} 
                  username={username} 
                  proofUrl={w.proof_url} 
                  verificationStatus={w.verification_status} 
                  payoutStatus={w.payout_status} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
