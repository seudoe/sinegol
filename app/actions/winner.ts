"use server";

import { requireUser, requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function submitProof(winnerId: string, proofUrl: string, username: string) {
  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  // Verify ownership
  const { data: winner } = await admin.from("winners").select("*").eq("id", winnerId).single();
  if (!winner || winner.user_id !== profile.id) {
    throw new Error("Unauthorized");
  }
  
  const { error } = await admin.from("winners").update({
    proof_url: proofUrl,
    verification_status: "pending"
  }).eq("id", winnerId);
  
  if (error) {
    logger.error("action:winner", "Failed to submit proof", { error: error.message });
    throw new Error(error.message);
  }
  
  revalidatePath(`/user/${username}/winnings`);
  return { success: true };
}

export async function reviewProof(winnerId: string, status: "approved" | "rejected", username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("winners").update({
    verification_status: status
  }).eq("id", winnerId);
  
  if (error) {
    logger.error("action:winner", "Failed to review proof", { error: error.message });
    throw new Error(error.message);
  }
  
  revalidatePath(`/admin/${username}/winners`);
  return { success: true };
}

export async function markPaid(winnerId: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("winners").update({
    payout_status: "paid"
  }).eq("id", winnerId);
  
  if (error) {
    logger.error("action:winner", "Failed to mark paid", { error: error.message });
    throw new Error(error.message);
  }
  
  revalidatePath(`/admin/${username}/winners`);
  return { success: true };
}
