import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/user";

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function demoProfile(username: string, role: UserRole): Profile {
  const name = username
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: "demo",
    username,
    name: name || "Guest Member",
    email: `${username}@example.com`,
    role,
    created_at: new Date().toISOString(),
  };
}

/**
 * Resolves the authenticated user's profile from the Supabase session —
 * never from the `[username]` URL segment. Redirects to /login if absent.
 *
 * Until Supabase credentials are configured, this returns a demo profile
 * built from `fallbackUsername` instead, so the dashboard UI can be
 * previewed end-to-end (see docs/assumptions.md). Real authorization only
 * takes effect once NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are set.
 */
export async function requireUser(fallbackUsername: string): Promise<Profile> {
  if (!SUPABASE_CONFIGURED) {
    return demoProfile(fallbackUsername, "user");
  }

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
export async function requireAdmin(fallbackUsername: string): Promise<Profile> {
  if (!SUPABASE_CONFIGURED) {
    return demoProfile(fallbackUsername, "admin");
  }

  const profile = await requireUser(fallbackUsername);

  if (profile.role !== "admin") {
    redirect("/");
  }

  return profile;
}
