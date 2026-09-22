"use server";

import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function addCharity(data: { name: string; description: string; image_url?: string; featured?: boolean }, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("charities").insert(data);
  if (error) {
    logger.error("action:admin-charity", "Failed to add charity", { error: error.message });
    return { error: error.message };
  }
  
  revalidatePath(`/admin/${username}/charities`);
  return { success: true };
}

export async function updateCharity(id: string, data: { name: string; description: string; image_url?: string; featured?: boolean }, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("charities").update(data).eq("id", id);
  if (error) {
    logger.error("action:admin-charity", "Failed to update charity", { id, error: error.message });
    return { error: error.message };
  }
  
  revalidatePath(`/admin/${username}/charities`);
  return { success: true };
}

export async function deleteCharity(id: string, username: string) {
  await requireAdmin(username);
  const admin = createAdminClient();
  
  const { error } = await admin.from("charities").delete().eq("id", id);
  if (error) {
    logger.error("action:admin-charity", "Failed to delete charity", { id, error: error.message });
    return { error: error.message };
  }
  
  revalidatePath(`/admin/${username}/charities`);
  return { success: true };
}
