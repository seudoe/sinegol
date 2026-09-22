import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProofSubmitter } from "@/components/domain/proof-submitter";
import { LeaderboardDialog } from "@/components/domain/leaderboard-dialog";

export default async function UserWinningsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);

  const admin = createAdminClient();
  const { data: winnings } = await admin
    .from("winners")
    .select(`*, draws (month, method, numbers)`)
    .eq("user_id", profile.id)
    .order("id", { ascending: false });

  const totalWon = (winnings || []).reduce((sum, w) => sum + Number(w.prize_amount), 0);
  const totalPaid = (winnings || []).filter(w => w.payout_status === 'paid').reduce((sum, w) => sum + Number(w.prize_amount), 0);

  // Fetch leaderboard data
  const { data: allWinners } = await admin
    .from("winners")
    .select(`prize_amount, profiles(username)`);

  const leaderboardMap = new Map<string, number>();
  for (const win of (allWinners || [])) {
    // @ts-expect-error Supabase types for profile join
    const uname = win.profiles?.username || "Unknown";
    const amount = Number(win.prize_amount);
    leaderboardMap.set(uname, (leaderboardMap.get(uname) || 0) + amount);
  }

  const leaderboard = Array.from(leaderboardMap.entries())
    .map(([uname, total]) => ({ username: uname, totalWon: total }))
    .sort((a, b) => b.totalWon - a.totalWon)
    .slice(0, 50);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your Winnings</h1>
        <LeaderboardDialog leaderboard={leaderboard} />
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Won</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${totalWon.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Winning History</h2>
        {winnings?.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven&apos;t won any draws yet. Keep playing!</p>
        ) : (
          <div className="grid gap-4">
            {winnings?.map(w => (
              <Card key={w.id} className={w.payout_status === 'paid' ? 'opacity-80' : 'border-primary/50'}>
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{w.draws?.month} Draw</CardTitle>
                      <p className="text-sm text-muted-foreground">You matched {w.match_tier} numbers!</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">${Number(w.prize_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verification:</span>
                    <Badge variant={w.verification_status === 'approved' ? 'default' : w.verification_status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize">
                      {w.verification_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payout:</span>
                    <Badge variant={w.payout_status === 'paid' ? 'default' : 'outline'} className="capitalize">
                      {w.payout_status}
                    </Badge>
                  </div>
                  
                  {w.verification_status === 'rejected' && (
                    <p className="text-xs text-destructive mt-2">Your proof was rejected. Please submit a clearer image.</p>
                  )}
                  
                  {w.payout_status !== 'paid' && (!w.proof_url || w.verification_status === 'rejected') && (
                    <ProofSubmitter winnerId={w.id} username={username} />
                  )}
                  
                  {w.proof_url && w.verification_status !== 'rejected' && (
                    <p className="text-xs text-muted-foreground mt-2">Proof submitted. Awaiting admin review and payout.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
