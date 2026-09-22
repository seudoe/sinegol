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
import { LoginForm } from "@/components/domain/login-form";
import { dashboardPathFor, getCurrentProfile } from "@/lib/auth/session";

export default async function LoginPage() {
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Sinegol account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            New to Sinegol?{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Request membership
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
