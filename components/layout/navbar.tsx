import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dashboardPathFor, getCurrentProfile } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";

const LINKS = [
  { href: "/charities", label: "Charities" },
  { href: "/how-it-works", label: "How it works" },
];

export async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Sinegol
          </span>
          <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.25em] text-accent sm:inline">
            Golf &amp; Charity
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-1 transition-colors hover:border-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {profile ? (
          <div className="flex items-center gap-3">
            <Button
              render={<Link href={dashboardPathFor(profile)} />}
              nativeButton={false}
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              {profile.name}
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Log in
            </Button>
            <Button render={<Link href="/signup" />} nativeButton={false}>
              Become a member
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
