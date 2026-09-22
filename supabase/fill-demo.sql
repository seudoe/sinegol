-- Sinegol — demo/dev seed data
-- Run `node supabase/seed-demo-users.mjs` FIRST — it provisions the three
-- demo accounts in Supabase Auth via the Admin API. Do NOT hand-insert rows
-- into `auth.users` here: it skips the matching `auth.identities` row and
-- breaks sign-in with "Database error querying schema" (see
-- docs/assumptions.md). Once that script has run, this file is idempotent
-- (ON CONFLICT / NOT EXISTS guards), so re-running it is safe.

-- ---------------------------------------------------------------------------
-- Profiles (matching the auth users created by seed-demo-users.mjs)
-- ---------------------------------------------------------------------------

insert into profiles (id, username, name, email, role) values
  ('11111111-1111-1111-1111-111111111111', 'alexandra', 'Alexandra Hartley', 'alexandra@sinegol.com', 'user'),
  ('22222222-2222-2222-2222-222222222222', 'james', 'James Whitfield', 'james@sinegol.com', 'user'),
  ('33333333-3333-3333-3333-333333333333', 'olivia', 'Olivia Chen', 'olivia@sinegol.com', 'admin')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Subscriptions
-- ---------------------------------------------------------------------------

insert into subscriptions (user_id, plan, status, amount, renewal_date, stripe_subscription_id) values
  ('11111111-1111-1111-1111-111111111111', 'monthly', 'active', 25.00, current_date + interval '18 days', 'sub_demo_alexandra'),
  ('22222222-2222-2222-2222-222222222222', 'yearly', 'active', 240.00, current_date + interval '210 days', 'sub_demo_james')
on conflict (stripe_subscription_id) do nothing;

-- ---------------------------------------------------------------------------
-- Golf scores — 5 most recent each. Alexandra's distinct values
-- {7,14,21,28,35} are chosen to overlap the published draw below.
-- ---------------------------------------------------------------------------

insert into golf_scores (user_id, score, played_date) values
  ('11111111-1111-1111-1111-111111111111', 35, current_date - interval '3 days'),
  ('11111111-1111-1111-1111-111111111111', 28, current_date - interval '10 days'),
  ('11111111-1111-1111-1111-111111111111', 21, current_date - interval '17 days'),
  ('11111111-1111-1111-1111-111111111111', 14, current_date - interval '24 days'),
  ('11111111-1111-1111-1111-111111111111', 7, current_date - interval '31 days'),
  ('22222222-2222-2222-2222-222222222222', 25, current_date - interval '4 days'),
  ('22222222-2222-2222-2222-222222222222', 20, current_date - interval '11 days'),
  ('22222222-2222-2222-2222-222222222222', 15, current_date - interval '18 days'),
  ('22222222-2222-2222-2222-222222222222', 10, current_date - interval '25 days'),
  ('22222222-2222-2222-2222-222222222222', 5, current_date - interval '32 days')
on conflict (user_id, played_date) do nothing;

-- ---------------------------------------------------------------------------
-- Charities
-- ---------------------------------------------------------------------------

insert into charities (id, name, description, image_url, featured) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Fairway Futures', 'Funds junior golf scholarships and equipment for under-resourced youth.', null, true),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Green Horizons Trust', 'Environmental restoration of public parkland and courses.', null, false),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Caddie Relief Fund', 'Emergency financial support for caddies and course staff.', null, false),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Veterans on the Green', 'Free golf therapy programs for military veterans.', null, false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- User charity selections
-- ---------------------------------------------------------------------------

insert into user_charities (user_id, charity_id, contribution_percentage) values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', 10.00),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000004', 15.00)
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Draws — last month published, this month still a draft.
-- ---------------------------------------------------------------------------

insert into draws (id, month, method, numbers, status, published_at) values
  ('bbbbbbbb-0000-0000-0000-000000000001', to_char(current_date - interval '1 month', 'YYYY-MM'), 'random', array[3, 7, 9, 14, 21], 'published', now() - interval '1 month'),
  ('bbbbbbbb-0000-0000-0000-000000000002', to_char(current_date, 'YYYY-MM'), 'algorithmic', array[2, 11, 19, 26, 33], 'draft', null)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Winners — Alexandra's ticket {7,14,21,28,35} intersects the published
-- draw's {3,7,9,14,21} on {7,14,21}, a 3-number match.
-- ---------------------------------------------------------------------------

insert into winners (draw_id, user_id, match_tier, prize_amount, verification_status, payout_status)
select
  'bbbbbbbb-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  3,
  125.00,
  'pending',
  'pending'
where not exists (
  select 1 from winners
  where draw_id = 'bbbbbbbb-0000-0000-0000-000000000001'
    and user_id = '11111111-1111-1111-1111-111111111111'
);
