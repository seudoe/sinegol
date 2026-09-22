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
  const profile = await requireUser();
  const { username } = await params;
  const base = `/user/${username}`;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar
          items={[
            { label: "Dashboard", href: base },
            { label: "Scores", href: `${base}/scores` },
            { label: "Charity", href: `${base}/charity` },
            { label: "Draws", href: `${base}/draws` },
            { label: "Winnings", href: `${base}/winnings` },
            { label: "Profile", href: `${base}/profile` },
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
