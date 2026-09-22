"use server";

import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

export async function createDummySubscription(plan: "monthly" | "yearly", username: string) {
  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  const amount = plan === "monthly" ? 10 : 100;
  const renewal = new Date();
  renewal.setMonth(renewal.getMonth() + (plan === "monthly" ? 1 : 12));
  
  const { error } = await admin.from("subscriptions").insert({
    user_id: profile.id,
    plan,
    status: "active",
    amount,
    renewal_date: renewal.toISOString().split("T")[0]
  });
  
  if (error) {
    logger.error("action:subscription", "Failed to create dummy subscription", { userId: profile.id, error: error.message });
    throw new Error("Failed to subscribe");
  }
  
  logger.info("action:subscription", "Successfully created dummy subscription", { userId: profile.id, plan });
  redirect(`/user/${profile.username}/charity`);
}
