import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ScoreManager } from "@/components/domain/score-manager";

export default async function UserScoresPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);
  const admin = createAdminClient();

  const { data: scores } = await admin
    .from("golf_scores")
    .select("id, score, played_date")
    .eq("user_id", profile.id)
    .order("played_date", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Scores</h1>
      <p className="text-muted-foreground -mt-4">
        Enter your golf scores. We use your latest 5 scores for the monthly draw.
      </p>
      <ScoreManager scores={scores || []} username={username} />
    </div>
  );
}
