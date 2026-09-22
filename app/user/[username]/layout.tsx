import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { requireUser } from "@/lib/auth/session";

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await requireUser(username);
  const base = `/user/${username}`;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 border-x border-border/70">
        <Sidebar
          eyebrow="Member Portal"
          items={[
            { label: "Dashboard", href: base, icon: "dashboard" },
            { label: "Plan", href: `${base}/plan`, icon: "plan" },
            { label: "Scores", href: `${base}/scores`, icon: "scores" },
            { label: "Charity", href: `${base}/charity`, icon: "charity" },
            { label: "Draws", href: `${base}/draws`, icon: "draws" },
            { label: "Winnings", href: `${base}/winnings`, icon: "winnings" },
            { label: "Profile", href: `${base}/profile`, icon: "profile" },
          ]}
        />
        <main className="flex-1 px-10 py-10">
          <p className="mb-8 text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Welcome back, {profile.name}
          </p>
          {children}
        </main>
      </div>
    </div>
  );
}
