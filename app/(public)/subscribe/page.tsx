import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { createDummySubscription } from "@/app/actions/subscription";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SubscribePage() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-center mb-10">
        Choose your plan
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>$10 / month</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async () => {
              "use server";
              await createDummySubscription("monthly", profile.username);
            }}>
              <Button type="submit" className="w-full">Subscribe Monthly</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Plan</CardTitle>
            <CardDescription>$100 / year (Save $20)</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async () => {
              "use server";
              await createDummySubscription("yearly", profile.username);
            }}>
              <Button type="submit" className="w-full">Subscribe Yearly</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
