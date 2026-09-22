"use server";

import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function addScore(score: number, date: string, username: string) {
  if (score < 1 || score > 45) {
    return { error: "Score must be between 1 and 45" };
  }
  
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return { error: "Invalid date format" };
  }

  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  // Upsert the score for that date
  const { error: upsertError } = await admin.from("golf_scores").upsert({
    user_id: profile.id,
    score,
    played_date: date
  }, { onConflict: "user_id, played_date" });
  
  if (upsertError) {
    logger.error("action:score", "Failed to add score", { userId: profile.id, error: upsertError.message });
    return { error: upsertError.message };
  }
  
  // Enforce max 5 scores rule: get all scores ordered by played_date DESC
  const { data: allScores, error: fetchError } = await admin
    .from("golf_scores")
    .select("id")
    .eq("user_id", profile.id)
    .order("played_date", { ascending: false })
    .order("created_at", { ascending: false });
    
  if (!fetchError && allScores && allScores.length > 5) {
    const idsToDelete = allScores.slice(5).map(s => s.id);
    await admin.from("golf_scores").delete().in("id", idsToDelete);
    logger.info("action:score", "Deleted oldest scores to maintain max 5", { userId: profile.id, count: idsToDelete.length });
  }
  
  logger.info("action:score", "Successfully added score", { userId: profile.id, score, date });
  revalidatePath(`/user/${profile.username}/scores`);
  return { success: true };
}

export async function deleteScore(id: string, username: string) {
  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  // Make sure to delete only if it belongs to the user
  const { error } = await admin.from("golf_scores").delete().eq("id", id).eq("user_id", profile.id);
  
  if (error) {
    logger.error("action:score", "Failed to delete score", { userId: profile.id, id, error: error.message });
    return { error: error.message };
  }
  
  logger.info("action:score", "Successfully deleted score", { userId: profile.id, id });
  revalidatePath(`/user/${profile.username}/scores`);
  return { success: true };
}
