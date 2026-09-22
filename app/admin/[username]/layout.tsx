import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await requireAdmin(username);
  const base = `/admin/${username}`;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 border-x border-border/70">
        <Sidebar
          eyebrow="Admin Console"
          items={[
            { label: "Dashboard", href: base, icon: "dashboard" },
            { label: "Users", href: `${base}/users`, icon: "users" },
            { label: "Draws", href: `${base}/draws`, icon: "draws" },
            { label: "Charities", href: `${base}/charities`, icon: "charity" },
            { label: "Winners", href: `${base}/winners`, icon: "winners" },
            { label: "Analytics", href: `${base}/analytics`, icon: "analytics" },
          ]}
        />
        <main className="flex-1 px-10 py-10">
          <p className="mb-8 text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Signed in as {profile.name} &middot; Administrator
          </p>
          {children}
        </main>
      </div>
    </div>
  );
}
