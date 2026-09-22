import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { matchNumbers } from "@/lib/draw/matcher";

export default async function UserDrawsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);

  const admin = createAdminClient();
  
  const { data: scores } = await admin.from("golf_scores").select("score").eq("user_id", profile.id).order("played_date", { ascending: false });
  const ticket = Array.from(new Set((scores || []).map(s => s.score))).slice(0, 5);

  const { data: draws } = await admin.from("draws").select("*").eq("status", "published").order("published_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Monthly Draws</h1>
        <p className="text-muted-foreground mt-1">See your active ticket and past results.</p>
      </div>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Your Active Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          {ticket.length === 0 ? (
            <p className="text-sm text-muted-foreground">You don&apos;t have any scores yet. Add some on the Scores tab!</p>
          ) : (
            <div className="flex gap-2">
              {ticket.map((n, i) => (
                <Badge key={i} variant="default" className="h-10 w-10 flex items-center justify-center text-lg rounded-full">
                  {n}
                </Badge>
              ))}
              {ticket.length < 5 && (
                <p className="text-sm text-muted-foreground ml-2 self-center italic">
                  (You need {5 - ticket.length} more score{5 - ticket.length > 1 ? 's' : ''} to complete your ticket)
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Past Draws</h2>
        {draws?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No past draws found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {draws?.map(d => {
              const { matched, tier } = matchNumbers(ticket, d.numbers);
              return (
                <Card key={d.id}>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{d.month} Draw</CardTitle>
                      <span className="text-xs text-muted-foreground capitalize">{d.method} Engine</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Winning Numbers:</p>
                      <div className="flex gap-2">
                        {d.numbers.map((n: number, i: number) => {
                          const isMatched = matched.includes(n);
                          return (
                            <Badge key={i} variant={isMatched ? "default" : "outline"} className={`h-8 w-8 flex items-center justify-center rounded-full ${isMatched ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                              {n}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {tier ? <span className="text-green-600 font-bold">{tier} Matches!</span> : <span className="text-muted-foreground">No Win</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Matched: {matched.length > 0 ? matched.join(", ") : "None"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
