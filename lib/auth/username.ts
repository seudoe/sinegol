/**
 * Derives a URL-safe username from an email's local part (e.g. for the
 * `/user/[username]` route). Real usernames come from `profiles.username`
 * once Supabase Auth is wired up (see docs/assumptions.md).
 */
export function usernameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "member";
  const slug = local.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "member";
}
