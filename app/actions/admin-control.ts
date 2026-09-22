"use server";

import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function approveAdmin(adminId: string, username: string) {
  const profile = await requireAdmin(username);
  const admin = createAdminClient();
  
  const depth = (profile.admin_depth || 0) + 1;

  const { error } = await admin.from("profiles").update({
    admin_status: "approved",
    admin_depth: depth,
    approved_by: profile.id
  }).eq("id", adminId);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/admin-control`);
}

export async function deleteAdmin(adminId: string, username: string) {
  const profile = await requireAdmin(username);
  const admin = createAdminClient();
  
  // Verify target is lower power (higher depth)
  const { data: target } = await admin.from("profiles").select("admin_depth").eq("id", adminId).single();
  if (!target) throw new Error("Admin not found");
  
  const myDepth = profile.admin_depth || 0;
  const targetDepth = target.admin_depth || 0;
  
  if (targetDepth <= myDepth) {
    throw new Error("You do not have permission to remove an admin of equal or higher power.");
  }

  // ON DELETE CASCADE will handle the recursive deletion of all admins approved by this one
  const { error } = await admin.from("profiles").delete().eq("id", adminId);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${username}/admin-control`);
}
