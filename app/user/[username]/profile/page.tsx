import { requireUser } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
      
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 border-b pb-2">
            <p className="text-muted-foreground text-sm font-medium">Name</p>
            <p className="col-span-2 font-medium">{profile.name}</p>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <p className="text-muted-foreground text-sm font-medium">Username</p>
            <p className="col-span-2 font-medium">@{profile.username}</p>
          </div>
          <div className="grid grid-cols-3 border-b pb-2">
            <p className="text-muted-foreground text-sm font-medium">Email</p>
            <p className="col-span-2 font-medium">{profile.email}</p>
          </div>
          <div className="grid grid-cols-3 pb-2">
            <p className="text-muted-foreground text-sm font-medium">Account Role</p>
            <p className="col-span-2 font-medium capitalize">{profile.role}</p>
          </div>
          
          <form action="/auth/logout" method="post" className="mt-6">
            <Button variant="destructive">Sign Out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
