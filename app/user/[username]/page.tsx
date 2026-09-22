import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UserDashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);

  const admin = createAdminClient();
  
  const [
    { data: sub },
    { data: scores },
    { data: userCharity },
    { data: winnings }
  ] = await Promise.all([
    admin.from("subscriptions").select("*").eq("user_id", profile.id).single(),
    admin.from("golf_scores").select("score").eq("user_id", profile.id).order("played_date", { ascending: false }),
    admin.from("user_charities").select("*, charities(name)").eq("user_id", profile.id).single(),
    admin.from("winners").select("prize_amount, match_tier").eq("user_id", profile.id)
  ]);

  const ticket = Array.from(new Set((scores || []).map(s => s.score))).slice(0, 5);
  const totalWon = (winnings || []).reduce((sum, w) => sum + Number(w.prize_amount), 0);
  
  const highestWin = (winnings || []).reduce((max, w) => Math.max(max, Number(w.prize_amount)), 0);
  const bestMatch = (winnings || []).reduce((max, w) => Math.max(max, Number(w.match_tier)), 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membership Status</CardTitle>
          </CardHeader>
          <CardContent>
            {sub ? (
              <div>
                <p className="text-2xl font-bold capitalize">{sub.plan} Plan</p>
                <Badge variant={sub.status === 'active' ? 'secondary' : 'outline'} className="mt-1 capitalize">{sub.status}</Badge>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-muted-foreground">Inactive</p>
                <Button size="sm" variant="outline" className="mt-2" nativeButton={false} render={<Link href="/subscribe" />}>Subscribe Now</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Charity Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            {userCharity ? (
              <div>
                <p className="text-2xl font-bold">{userCharity.contribution_percentage}%</p>
                <p className="text-sm text-muted-foreground mt-1 truncate">to {userCharity.charities?.name}</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-muted-foreground">None Selected</p>
                <Button size="sm" variant="outline" className="mt-2" nativeButton={false} render={<Link href={`/user/${username}/charity`} />}>Choose Charity</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Draw Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center h-8">
              {ticket.length === 0 ? (
                 <span className="text-sm text-muted-foreground italic">No scores logged</span>
              ) : (
                ticket.map((n, i) => (
                  <Badge key={i} variant="default" className="h-7 w-7 flex items-center justify-center text-xs rounded-full">
                    {n}
                  </Badge>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{ticket.length}/5 scores logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Winnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${totalWon.toFixed(2)}</p>
            <Button size="sm" variant="link" className="px-0 h-auto mt-1" nativeButton={false} render={<Link href={`/user/${username}/winnings`} />}>View Winnings History</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Win</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${highestWin.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">All time maximum prize</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bestMatch > 0 ? `${bestMatch} Numbers` : "None yet"}</p>
            <p className="text-xs text-muted-foreground mt-2">Highest tier achieved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
