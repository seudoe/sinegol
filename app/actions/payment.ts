"use server";

import { requireAdmin, requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { subscribeToPlan } from "./plan";

export async function updateUpiSettings(upiId: string, upiName: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("platform_settings").upsert({
    id: 1,
    upi_id: upiId,
    upi_name: upiName
  });
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/payments`);
}

export async function submitPayment(planName: string, amount: number, utr: string, username: string) {
  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  // Log the transaction
  const { error: txError } = await admin.from("payment_transactions").insert({
    user_id: profile.id,
    plan_name: planName,
    amount: amount,
    utr: utr
  });
  
  if (txError) throw new Error("Failed to log transaction: " + txError.message);
  
  // Automatically activate the subscription
  await subscribeToPlan(planName, username);
  
  return { success: true };
}
