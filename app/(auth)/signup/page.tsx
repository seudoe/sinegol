import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/domain/signup-form";
import { dashboardPathFor, getCurrentProfile } from "@/lib/auth/session";

export default async function SignupPage() {
  const profile = await getCurrentProfile();

  if (profile) {
    redirect(dashboardPathFor(profile));
  }

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <Button variant="ghost" nativeButton={false} render={<Link href="/" />} className="mb-4 w-fit pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <Card className="ring-1 ring-border">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-2xl">Request membership</CardTitle>
          <CardDescription>
            Join Sinegol to play, win, and support your charity of choice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            Already a member?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
