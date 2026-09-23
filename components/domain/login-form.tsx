"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/domain/password-input";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  function triggerDemoLogin(email: string) {
    setValue("email", email);
    setValue("password", "Password");
    handleSubmit(onSubmit)();
  }

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    const res = await loginAction(data);

    if (res.error || !res.profile) {
      setFormError(res.error || "Unable to sign in.");
      return;
    }

    router.push(
      res.profile.role === "admin" ? `/admin/${res.profile.username}` : `/user/${res.profile.username}`
    );
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@club.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        Sign in
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          type="button" 
          variant="outline" 
          disabled={isSubmitting} 
          onClick={() => triggerDemoLogin("alex@gmail.com")}
        >
          Demo Login as User (alex@gmail.com)
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          disabled={isSubmitting} 
          onClick={() => triggerDemoLogin("admin2@gmail.com")}
        >
          Demo Login as Admin (admin2@gmail.com)
        </Button>
      </div>
    </form>
  );
}
