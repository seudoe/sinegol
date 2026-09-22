import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const users = [
  ["aaron", "Aaron Mitchell"],
  ["bella", "Bella Carter"],
  ["caleb", "Caleb Turner"],
  ["diana", "Diana Morgan"],
  ["evan", "Evan Parker"],
  ["fiona", "Fiona Collins"],
  ["gabriel", "Gabriel Reed"],
  ["hannah", "Hannah Cooper"],
  ["ian", "Ian Richardson"],
  ["julia", "Julia Bennett"],
  ["kevin", "Kevin Foster"],
  ["lauren", "Lauren Hayes"],
  ["mason", "Mason Brooks"],
  ["natalie", "Natalie Ward"],
  ["owen", "Owen Peterson"],
  ["penelope", "Penelope Ross"],
  ["quinn", "Quinn Murphy"],
  ["riley", "Riley Adams"],
  ["samuel", "Samuel Cook"],
  ["victoria", "Victoria Bailey"],
];

for (const [username, name] of users) {
  const email = `${username}@g.c`;

  const { data, error } =
    await supabase.auth.admin.createUser({
      email,
      password: "Password",
      email_confirm: true,
      user_metadata: {
        name,
        username,
      },
    });

  if (error) {
    console.log(`❌ ${email}: ${error.message}`);
    continue;
  }

  console.log(`✅ ${name} → ${data.user.id}`);
}