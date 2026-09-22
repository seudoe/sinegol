# Sinegol

Sinegol is a modern rewards and charity platform. Users subscribe, log their golf scores, and automatically enter a monthly draw to win prizes while contributing a portion of their subscription to their favorite charities.

## Features

- **User Subscriptions:** Users can subscribe (mocked flow) to gain access to the draw system.
- **Charity Engine:** Users select a charity and designate a contribution percentage (minimum 10%).
- **Score Tracking:** Users can log up to 5 of their latest golf scores (ranging from 1 to 45). These scores act as their "ticket" for the monthly draw.
- **Draw Engine:** A powerful monthly draw system. Admins can simulate algorithmic or random draws, view exact prize pools and winners, and then publish the draw.
- **Winner Flow & Verification:** Winners automatically appear in the system and can upload proof of their scores. Admins review the proof and mark the payout as completed.
- **Community Leaderboard:** Users can view an aggregated, sorted leaderboard showing how much other users have won across all time.
- **Full Admin CRM:** Manage users, subscriptions, charities, draws, winners, and view platform-wide analytics.

## Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org)
- **Database & Auth:** [Supabase](https://supabase.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) & [shadcn/ui](https://ui.shadcn.com)
- **Language:** TypeScript

## Architecture & Assumptions

- **Draw Mapping:** A user's "ticket" numbers are their raw golf scores (1-45). Draws produce 5 numbers in the 1-45 range.
- **Database Access:** Row-Level Security (RLS) is enabled but utilizes the Supabase Service Role (Admin Client) securely abstracted behind Server Actions to bypass standard client rate limits for the hackathon MVP scope.

## Getting Started

1. Copy `.env.example` to `.env.local` and add your Supabase credentials.
2. Run the SQL schema in `supabase/create-all.sql` in your Supabase SQL Editor.
3. (Optional) Run the seed file `supabase/fill-after-20.sql` to populate demo data.
4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `app/(public)` - Public landing pages and charity info
- `app/auth` - Login and signup routes
- `app/user/[username]` - The authenticated user dashboard
- `app/admin/[username]` - The admin CRM dashboard
- `components/domain` - Complex domain-specific React components
- `lib/draw` - Core math and algorithms for the Draw Engine
