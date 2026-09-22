-- ============================================================
-- SINEGOL — LARGE DEMO DATA SEED
--
-- IMPORTANT:
-- This script does NOT create/alter/drop tables.
-- It DOES NOT create Auth users.
--
-- Run seed-users.mjs FIRST.
-- Then run this SQL.
--
-- Existing users:
--   admin@gmail.com
--   alex@gmail.com
--   asif@gmail.com
--   mah@g.com
--
-- are intentionally NOT used.
-- ============================================================


-- ============================================================
-- 1. CREATE PROFILES FOR NEW AUTH USERS
-- ============================================================

INSERT INTO profiles (
    id,
    username,
    name,
    email,
    role
)
SELECT
    au.id,
    au.raw_user_meta_data->>'username',
    au.raw_user_meta_data->>'name',
    au.email,
    'user'
FROM auth.users au
WHERE au.email LIKE '%@sinegol.demo'
AND NOT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.id = au.id
);


-- ============================================================
-- 2. CHARITIES
-- ============================================================

INSERT INTO charities
(id, name, description, image_url, featured)
VALUES

(
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Fairway Futures',
    'Provides golf equipment, scholarships and coaching for young players from underserved communities.',
    NULL,
    TRUE
),

(
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Green Horizons',
    'Supports environmental restoration and biodiversity projects.',
    NULL,
    TRUE
),

(
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Caddie Relief Fund',
    'Emergency financial assistance for caddies and course staff.',
    NULL,
    FALSE
),

(
    'aaaaaaaa-0000-0000-0000-000000000004',
    'Veterans on the Green',
    'Provides accessible golf programs for military veterans.',
    NULL,
    TRUE
),

(
    'aaaaaaaa-0000-0000-0000-000000000005',
    'Golf for All',
    'Makes golf accessible to children from low-income communities.',
    NULL,
    FALSE
),

(
    'aaaaaaaa-0000-0000-0000-000000000006',
    'Healthy Fairways',
    'Supports community health and outdoor recreation programs.',
    NULL,
    FALSE
),

(
    'aaaaaaaa-0000-0000-0000-000000000007',
    'Course Conservation Alliance',
    'Protects natural habitats surrounding golf courses.',
    NULL,
    TRUE
),

(
    'aaaaaaaa-0000-0000-0000-000000000008',
    'Community Golf Foundation',
    'Supports local golf clubs and grassroots tournaments.',
    NULL,
    FALSE
),

(
    'aaaaaaaa-0000-0000-0000-000000000009',
    'Youth Sports Access',
    'Provides equipment and participation grants for young athletes.',
    NULL,
    FALSE
),

(
    'aaaaaaaa-0000-0000-0000-000000000010',
    'Clean Parks Initiative',
    'Supports public park cleanup and restoration.',
    NULL,
    TRUE
)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. ASSIGN ONE CHARITY TO EVERY NEW USER
-- ============================================================

INSERT INTO user_charities
(user_id, charity_id, contribution_percentage)

SELECT
    au.id,
    charities.id,
    5 + ((row_number() OVER (ORDER BY au.email) * 5) % 26)
FROM auth.users au
CROSS JOIN LATERAL (
    SELECT id
    FROM charities
    WHERE id >= 'aaaaaaaa-0000-0000-0000-000000000001'
      AND id <= 'aaaaaaaa-0000-0000-0000-000000000010'
    ORDER BY md5(au.id::text || id::text)
    LIMIT 1
) charities
WHERE au.email LIKE '%@sinegol.demo'

AND NOT EXISTS (
    SELECT 1
    FROM user_charities uc
    WHERE uc.user_id = au.id
);


-- ============================================================
-- 4. SUBSCRIPTIONS
--
-- Different users intentionally get different states.
-- ============================================================

INSERT INTO subscriptions
(
    user_id,
    plan,
    status,
    amount,
    renewal_date,
    stripe_subscription_id
)

SELECT
    au.id,

    CASE
        WHEN row_number() OVER (ORDER BY au.email) % 3 = 0
        THEN 'yearly'
        ELSE 'monthly'
    END,

    CASE
        WHEN row_number() OVER (ORDER BY au.email) % 11 = 0
        THEN 'past_due'

        WHEN row_number() OVER (ORDER BY au.email) % 9 = 0
        THEN 'cancelled'

        WHEN row_number() OVER (ORDER BY au.email) % 7 = 0
        THEN 'inactive'

        ELSE 'active'
    END,

    CASE
        WHEN row_number() OVER (ORDER BY au.email) % 3 = 0
        THEN 240.00
        ELSE 25.00
    END,

    current_date +
    (
        10 +
        (row_number() OVER (ORDER BY au.email) * 11)
    )::integer,

    'sub_demo_' ||
    replace(au.id::text, '-', '')

FROM auth.users au

WHERE au.email LIKE '%@sinegol.demo'

AND NOT EXISTS (
    SELECT 1
    FROM subscriptions s
    WHERE s.user_id = au.id
);


-- ============================================================
-- 5. GOLF SCORES
--
-- 10 rounds per user.
--
-- Scores intentionally range from 1–45 because that is your
-- actual DB constraint.
-- ============================================================

INSERT INTO golf_scores
(
    user_id,
    score,
    played_date
)

SELECT
    au.id,

    (
        3 +
        (
            (
                row_number() OVER (
                    PARTITION BY au.id
                    ORDER BY dates.n
                ) * 7
            )
            % 43
        )
    )::integer,

    current_date -
    (
        dates.n * 17 +
        (
            ascii(substr(md5(au.id::text),1,1))
            % 7
        )
    )::integer

FROM auth.users au

CROSS JOIN LATERAL (
    SELECT generate_series(1,10) AS n
) dates

WHERE au.email LIKE '%@sinegol.demo'

ON CONFLICT (user_id, played_date) DO NOTHING;


-- ============================================================
-- 6. DRAWS
--
-- 8 historical draws
-- 1 current published draw
-- 1 future draft draw
-- ============================================================

INSERT INTO draws
(
    month,
    method,
    numbers,
    status,
    created_at,
    published_at
)

VALUES

(
    to_char(current_date - interval '9 months','YYYY-MM'),
    'random',
    ARRAY[3,7,14,21,35],
    'published',
    now() - interval '9 months',
    now() - interval '9 months' + interval '2 days'
),

(
    to_char(current_date - interval '8 months','YYYY-MM'),
    'algorithmic',
    ARRAY[5,10,15,20,25],
    'published',
    now() - interval '8 months',
    now() - interval '8 months' + interval '2 days'
),

(
    to_char(current_date - interval '7 months','YYYY-MM'),
    'random',
    ARRAY[6,12,18,24,30],
    'published',
    now() - interval '7 months',
    now() - interval '7 months' + interval '2 days'
),

(
    to_char(current_date - interval '6 months','YYYY-MM'),
    'algorithmic',
    ARRAY[4,11,19,27,36],
    'published',
    now() - interval '6 months',
    now() - interval '6 months' + interval '2 days'
),

(
    to_char(current_date - interval '5 months','YYYY-MM'),
    'random',
    ARRAY[2,9,17,28,41],
    'published',
    now() - interval '5 months',
    now() - interval '5 months' + interval '2 days'
),

(
    to_char(current_date - interval '4 months','YYYY-MM'),
    'algorithmic',
    ARRAY[7,13,22,31,40],
    'published',
    now() - interval '4 months',
    now() - interval '4 months' + interval '2 days'
),

(
    to_char(current_date - interval '3 months','YYYY-MM'),
    'random',
    ARRAY[1,8,16,29,44],
    'published',
    now() - interval '3 months',
    now() - interval '3 months' + interval '2 days'
),

(
    to_char(current_date - interval '2 months','YYYY-MM'),
    'algorithmic',
    ARRAY[5,12,21,33,42],
    'published',
    now() - interval '2 months',
    now() - interval '2 months' + interval '2 days'
),

(
    to_char(current_date - interval '1 month','YYYY-MM'),
    'random',
    ARRAY[3,10,18,27,39],
    'published',
    now() - interval '1 month',
    now() - interval '1 month' + interval '2 days'
),

(
    to_char(current_date,'YYYY-MM'),
    'algorithmic',
    ARRAY[7,14,21,28,35],
    'published',
    now() - interval '2 days',
    now()
),

(
    to_char(current_date + interval '1 month','YYYY-MM'),
    'random',
    ARRAY[4,12,19,30,43],
    'draft',
    now(),
    NULL
)

ON CONFLICT (month) DO NOTHING;


-- ============================================================
-- 7. GENERATE WINNERS
--
-- IMPORTANT:
-- Winners are generated ONLY when a user's golf scores contain
-- at least 3 numbers from the draw.
--
-- This makes the demo data logically consistent with the
-- application's matching model.
-- ============================================================


WITH score_numbers AS (

    SELECT
        gs.user_id,
        array_agg(DISTINCT gs.score) AS numbers

    FROM golf_scores gs

    GROUP BY gs.user_id

),

matches AS (

    SELECT
        d.id AS draw_id,
        sn.user_id,

        ARRAY(
            SELECT x
            FROM unnest(d.numbers) x
            WHERE x = ANY(sn.numbers)
        ) AS matched

    FROM draws d

    CROSS JOIN score_numbers sn

    WHERE d.status = 'published'

)

INSERT INTO winners
(
    draw_id,
    user_id,
    match_tier,
    prize_amount,
    proof_url,
    verification_status,
    payout_status
)

SELECT

    m.draw_id,

    m.user_id,

    cardinality(m.matched)::smallint,

    CASE cardinality(m.matched)
        WHEN 5 THEN 5000.00
        WHEN 4 THEN 500.00
        WHEN 3 THEN 100.00
    END,

    CASE
        WHEN cardinality(m.matched) >= 4
        THEN 'https://example.com/demo-proof/' ||
             replace(m.user_id::text,'-','')
        ELSE NULL
    END,

    CASE
        WHEN cardinality(m.matched) >= 4
        THEN 'approved'
        WHEN cardinality(m.matched) = 3
        THEN 'approved'
    END,

    CASE
        WHEN cardinality(m.matched) >= 4
        THEN 'paid'
        ELSE 'pending'
    END

FROM matches m

WHERE cardinality(m.matched) BETWEEN 3 AND 5

AND NOT EXISTS (
    SELECT 1
    FROM winners w
    WHERE w.draw_id = m.draw_id
    AND w.user_id = m.user_id
);


-- ============================================================
-- 8. SUMMARY
-- ============================================================

SELECT
    'Auth users' AS entity,
    COUNT(*) AS count
FROM auth.users
WHERE email LIKE '%@sinegol.demo'

UNION ALL

SELECT
    'Profiles',
    COUNT(*)
FROM profiles
WHERE email LIKE '%@sinegol.demo'

UNION ALL

SELECT
    'Subscriptions',
    COUNT(*)
FROM subscriptions s
JOIN profiles p ON p.id = s.user_id
WHERE p.email LIKE '%@sinegol.demo'

UNION ALL

SELECT
    'Golf scores',
    COUNT(*)
FROM golf_scores gs
JOIN profiles p ON p.id = gs.user_id
WHERE p.email LIKE '%@sinegol.demo'

UNION ALL

SELECT
    'Charity selections',
    COUNT(*)
FROM user_charities uc
JOIN profiles p ON p.id = uc.user_id
WHERE p.email LIKE '%@sinegol.demo'

UNION ALL

SELECT
    'Draws',
    COUNT(*)
FROM draws

UNION ALL

SELECT
    'Winners',
    COUNT(*)
FROM winners w
JOIN profiles p ON p.id = w.user_id
WHERE p.email LIKE '%@sinegol.demo';