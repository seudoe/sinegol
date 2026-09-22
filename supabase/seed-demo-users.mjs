// Provisions the demo Supabase Auth users via the Admin API.
//
// Hand-inserting rows into `auth.users` with raw SQL (as an earlier version
// of fill-demo.sql did) is NOT supported: it skips the matching
// `auth.identities` row and other internal bookkeeping GoTrue expects, and
// produces users that error with "Database error querying schema" on sign-in
// (and can even break the Admin API's own user-listing/lookup endpoints —
// see docs/assumptions.md). The Admin API is the correct, version-stable way
// to create real, sign-in-able users.
//
// Run this FIRST, before supabase/fill-demo.sql (which seeds `profiles` and
// everything else using these same fixed UUIDs):
//
//   node supabase/seed-demo-users.mjs
//
// Requires SUPABASE_URL and SUPABASE_SECRET_KEY (or their NEXT_PUBLIC_ /
// SUPABASE_SERVICE_ROLE_KEY mirrors) in the environment — this project's
// .env already has them. Safe to re-run: existing users are skipped.

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing SUPABASE_URL/SUPABASE_SECRET_KEY (or NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY) in the environment."
  );
  process.exit(1);
}

const PASSWORD = "Password123!";

const DEMO_USERS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "alexandra@sinegol.com",
    name: "Alexandra Hartley",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "james@sinegol.com",
    name: "James Whitfield",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "olivia@sinegol.com",
    name: "Olivia Chen",
  },
];

for (const user of DEMO_USERS) {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: user.name },
    }),
  });

  const body = await res.json();

  if (res.ok) {
    console.log(`created  ${user.email}`);
  } else if (body.error_code === "email_exists") {
    console.log(`skipped  ${user.email} (already exists)`);
  } else {
    console.error(`failed   ${user.email}:`, body);
  }
}

console.log(`\nDone. Password for all demo accounts: ${PASSWORD}`);
console.log("Next: run supabase/fill-demo.sql in the Supabase SQL editor.");
