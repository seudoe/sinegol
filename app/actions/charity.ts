"use server";

import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

export async function setUserCharity(charityId: string, percentage: number, username: string) {
  if (percentage <= 0 || percentage > 100) {
    return { error: "Percentage must be between 1 and 100" };
  }

  const profile = await requireUser(username);
  const supabase = await createClient();
  
  const { error } = await supabase.from("user_charities").upsert({
    user_id: profile.id,
    charity_id: charityId,
    contribution_percentage: percentage
  });
  
  if (error) {
    logger.error("action:charity", "Failed to set user charity", { userId: profile.id, error: error.message });
    return { error: "Failed to save charity selection" };
  }
  
  logger.info("action:charity", "Successfully updated user charity", { userId: profile.id, charityId, percentage });
  redirect(`/user/${profile.username}`);
}
