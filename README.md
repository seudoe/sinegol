<div align="center">
  <h1>🚀 Sinegol Rewards Engine</h1>
  <p><strong>The Next-Generation Philanthropic Draw & Rewards Platform</strong></p>
</div>

<br/>

**Sinegol** is an insanely powerful, high-performance web platform built to completely revolutionize how community rewards and charity contributions intertwine. Designed as a bleeding-edge hackathon masterpiece, it seamlessly blends gamified golf score tracking, dynamic subscription tiers, automated UPI payment flows, and a mathematically rigorous draw engine into one flawless Next.js application.

This isn't just a CRUD app; it's a full-fledged Fintech/Gamification hybrid architecture.

---

## 🔥 God-Tier Features

### 💎 Dynamic Subscription & UPI Payment Gateway
- **Dynamic Plan Architecture**: Hardcoded plans are a thing of the past. Admins can hot-swap, create, edit, and "soft-delete" subscription tiers on the fly without breaking historical user data.
- **Zero-Friction UPI Engine**: Integrated a custom, webhook-less UPI payment flow. Users hit checkout, a dynamic UPI QR Code (powered by `qrcode.react`) is instantly generated with the Admin's VPA, and the system securely logs the UTR transaction IDs in real-time. 

### 🎲 Algorithmic Draw Engine
- **The Core Engine**: A bespoke, mathematically sound draw system (`lib/draw/random.ts`) that maps users' real-life golf scores (1-45) directly to lottery-style tickets.
- **Simulation Mode**: Admins can safely sandbox and "Simulate" millions of outcomes for a month before publishing. It dynamically calculates prize pools, distributes match tiers (3, 4, or 5 matches), and perfectly projects the financial payout.
- **One-Click Publishing**: Finalizing a draw instantly locks the algorithmic state, generates the winners, allocates their exact monetary split, and queues them in the payout pipeline.

### 🏆 Winner Verification Pipeline
- **Automated CRM Flow**: When a user wins a draw, they enter a "Pending Proof" state. They submit cryptographic/URL proof of their scores.
- **Admin Adjudication**: Admins have a dedicated CRM dashboard to review submitted proofs, approve/reject them, and trigger the final "Paid" status. 

### 💖 Integrated Charity Engine
- **Mandatory Philanthropy**: Users *must* pledge a minimum of 10% of their potential winnings to a charity of their choice. 
- **Rich Media**: Charities are displayed with beautiful, dynamic image cards and pop-up modals across the entire user and admin experience.

### 👑 Hierarchical Admin RBAC (Role-Based Access Control)
- **Depth-Based Power Matrix**: Admins aren't just "admins". The system uses a strict hierarchical depth matrix where `Depth 0` is the ultimate root. New admins can apply via the public portal, but they remain completely locked out in a "Pending" state until an existing admin approves them.
- **Recursive Power Transfer**: When an admin approves an applicant, the new admin inherits a power level exactly one depth below their approver (`Depth + 1`). An admin can only manage or remove admins who are strictly below them in power.
- **Cascading Terminations**: Built directly into the Postgres schema via `ON DELETE CASCADE`: if a high-ranking admin is terminated, *every single admin they ever approved* (and all their recursive subordinates) are automatically wiped from the system instantly.

### 📊 Comprehensive CRM & Analytics Dashboards
- **Global Leaderboards**: A fully aggregated, sorted community leaderboard showing off the top 50 highest earners across the platform.
- **Omniscient Admin View**: A massive, interconnected Admin dashboard tracking active users, total platform MRR, total historical payouts, global charities, and an audit log of every UPI transaction ever made.
- **Sticky UX**: Flawless sticky sidebars, exact-path route matching, and hyper-responsive UI built with `shadcn/ui` and Tailwind.

---

## 🏗️ The Tech Stack

This project was engineered using the absolute best modern tools available:

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org) - Utilizing bleeding-edge React Server Components and Server Actions.
- **Database & Auth**: [Supabase](https://supabase.com) - Leveraging secure Server-Side RLS bypassing via an abstracted Admin Client to achieve insane read/write speeds for the hackathon MVP scope.
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + `lucide-react`.
- **Integrations**: `qrcode.react` for dynamic FinTech QR generation.

---

## 📂 Architecture Breakdown

```text
📦 digital-heroes
 ┣ 📂 app
 ┃ ┣ 📂 actions       # Server Actions (Auth, Charity, Draw, Payment, Plan, Winner)
 ┃ ┣ 📂 admin         # Omniscient Admin CRM routes
 ┃ ┣ 📂 user          # Authenticated User Dashboard
 ┃ ┗ 📂 auth          # JWT Auth routing
 ┣ 📂 components
 ┃ ┣ 📂 domain        # Massive feature-specific components (PlanSubscriber, CharityPicker)
 ┃ ┣ 📂 layout        # Sticky sidebars, Navbars
 ┃ ┗ 📂 ui            # Shadcn primitives
 ┣ 📂 lib
 ┃ ┣ 📂 draw          # Mathematical draw algorithms and simulators
 ┃ ┗ 📂 supabase      # Admin & client Supabase singletons
 ┗ 📂 supabase        # Raw SQL schemas, migrations, and mock data generators
```

## 🚀 Getting Started

Want to run this beast locally?

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and drop in your Supabase keys.
3. Run the SQL schema in `supabase/create-all.sql` in your Supabase SQL Editor.
4. Execute the dynamic schema updates for Plans, Settings, and Admin Hierarchy:
   ```sql
   CREATE TABLE platform_settings (id integer PRIMARY KEY DEFAULT 1, upi_id text, upi_name text);
   INSERT INTO platform_settings (id, upi_id, upi_name) VALUES (1, 'demo@upi', 'Sinegol Rewards');
   
   CREATE TABLE plans (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE, description text, price numeric(10, 2), billing_interval text DEFAULT 'monthly', deleted_at timestamptz, created_at timestamptz DEFAULT now());
   INSERT INTO plans (name, description, price, billing_interval) VALUES ('monthly', 'Standard monthly', 10.00, 'monthly'), ('yearly', 'Annual discount', 100.00, 'yearly');
   
   CREATE TABLE payment_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES profiles(id), plan_name text, amount numeric(10,2), utr text, created_at timestamptz DEFAULT now());
   ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

   -- Hierarchical Admin System
   ALTER TABLE profiles ADD COLUMN admin_depth integer;
   ALTER TABLE profiles ADD COLUMN approved_by uuid REFERENCES profiles(id) ON DELETE CASCADE;
   ALTER TABLE profiles ADD COLUMN admin_status text DEFAULT 'approved';
   UPDATE profiles SET admin_depth = 0, admin_status = 'approved' WHERE role = 'admin';
   ```
5. Fire up the engines:
   ```bash
   npm run dev
   ```

Welcome to the future of reward ecosystems. 🚀
