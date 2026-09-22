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
  const profile = await requireAdmin();
  const { username } = await params;
  const base = `/admin/${username}`;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar
          items={[
            { label: "Dashboard", href: base },
            { label: "Users", href: `${base}/users` },
            { label: "Draws", href: `${base}/draws` },
            { label: "Charities", href: `${base}/charities` },
            { label: "Winners", href: `${base}/winners` },
            { label: "Analytics", href: `${base}/analytics` },
          ]}
        />
        <main className="flex-1 px-8 py-8">
          <p className="sr-only">Signed in as {profile.username}</p>
          {children}
        </main>
      </div>
    </div>
  );
}
