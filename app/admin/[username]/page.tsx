import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Admin Console
      </h1>
      <p className="text-muted-foreground">Welcome to the Sinegol administration area.</p>
      
      <div className="flex gap-4 mt-4 flex-wrap">
        <Button nativeButton={false} render={<Link href={`/admin/${username}/analytics`} />}>
          View Analytics
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href={`/admin/${username}/draws`} />}>
          Manage Draws
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href={`/admin/${username}/winners`} />}>
          Review Winners
        </Button>
      </div>
    </div>
  );
}
