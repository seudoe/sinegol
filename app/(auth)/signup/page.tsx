import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "@/components/domain/signup-form";

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
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
