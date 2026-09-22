"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function signOut() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.error("auth:signOut", "sign-out failed", {
      userId: user?.id,
      error: error.message,
    });
  } else {
    logger.info("auth:signOut", "signed out", { userId: user?.id });
  }

  redirect("/");
}
