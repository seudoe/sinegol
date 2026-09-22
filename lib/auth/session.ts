import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/user";

/**
 * Resolves the authenticated user's profile from the Supabase session —
 * never from the `[username]` URL segment. Redirects to /login if absent.
 */
export async function requireUser(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

/**
 * Same as requireUser, but also enforces the admin role.
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireUser();

  if (profile.role !== "admin") {
    redirect("/");
  }

  return profile;
}
