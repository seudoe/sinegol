"use server";

import { requireAdmin, requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createPlan(name: string, description: string, price: number, billing_interval: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("plans").insert({
    name,
    description,
    price,
    billing_interval
  });
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/plans`);
}

export async function updatePlan(id: string, name: string, description: string, price: number, billing_interval: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("plans").update({
    name,
    description,
    price,
    billing_interval
  }).eq("id", id);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/plans`);
}

export async function deletePlan(id: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("plans").update({
    deleted_at: new Date().toISOString()
  }).eq("id", id);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/plans`);
}

export async function recoverPlan(id: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("plans").update({
    deleted_at: null
  }).eq("id", id);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/plans`);
}

export async function subscribeToPlan(planName: string, username: string) {
  const profile = await requireUser(username);
  const admin = createAdminClient();
  
  // Verify plan exists and is active
  const { data: plan } = await admin.from("plans").select("*").eq("name", planName).is("deleted_at", null).single();
  if (!plan) throw new Error("Plan not available");

  // Create or update subscription
  const { data: existing } = await admin.from("subscriptions").select("*").eq("user_id", profile.id).single();
  
  if (existing) {
    const { error } = await admin.from("subscriptions").update({
      plan: plan.name,
      amount: plan.price,
      status: "active"
    }).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("subscriptions").insert({
      user_id: profile.id,
      plan: plan.name,
      amount: plan.price,
      status: "active",
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (error) throw new Error(error.message);
  }
  
  revalidatePath(`/user/${username}/plan`);
  return { success: true };
}
