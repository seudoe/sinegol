import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/domain/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
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
