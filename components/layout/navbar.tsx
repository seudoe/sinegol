import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Sinegol
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/charities">Charities</Link>
          <Link href="/how-it-works">How it works</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/login" />} nativeButton={false} variant="ghost">
            Log in
          </Button>
          <Button render={<Link href="/signup" />} nativeButton={false}>
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
