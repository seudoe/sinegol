"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { signupSchema, loginSchema, type SignupInput, type LoginInput } from "@/lib/validation/auth";
import { usernameFromEmail } from "@/lib/auth/username";
import { friendlyAuthError } from "@/lib/auth/errors";

export async function loginAction(data: LoginInput) {
  try {
    const parsed = loginSchema.parse(data);
    const supabase = await createClient();
    
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });
    
    if (error || !auth.user) {
      const msg = error ? friendlyAuthError(error) : "Unable to sign in.";
      logger.error("action:auth", "Login failed", { email: parsed.email, error: msg });
      return { error: msg };
    }
    
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("username, role")
      .eq("id", auth.user.id)
      .single<{ username: string; role: "user" | "admin" }>();
      
    if (!profile) {
      logger.error("action:auth", "Profile not found after signin", { userId: auth.user.id });
      return { error: "Signed in, but no profile was found for this account." };
    }
    
    logger.info("action:auth", "User logged in successfully", { username: profile.username });
    return { success: true, profile };
  } catch (err) {
    const error = err as Error;
    logger.error("action:auth", "Server error", { error: error?.message });
    return { error: "An unexpected error occurred." };
  }
}

export async function signupAction(data: SignupInput) {
  try {
    const parsed = signupSchema.parse(data);
    const supabase = await createClient();
    const username = usernameFromEmail(parsed.email);
    
    const admin = createAdminClient();
    
    const { data: adminAuth, error: createError } = await admin.auth.admin.createUser({
      email: parsed.email,
      password: parsed.password,
      email_confirm: true,
      user_metadata: { name: parsed.name }
    });
    
    if (createError) {
      const msg = friendlyAuthError(createError);
      logger.error("action:auth", "Admin Signup failed", { email: parsed.email, error: msg });
      return { error: msg };
    }
    
    if (!adminAuth.user) {
      logger.error("action:auth", "No user returned from admin signup", { email: parsed.email });
      return { error: "Something went wrong creating your account." };
    }
    
    const user = adminAuth.user;
    
    const { error: profileError } = await admin.from("profiles").insert({
      id: user.id,
      username,
      name: parsed.name,
      email: parsed.email,
      role: "user",
    });
    
    if (profileError) {
      logger.error("action:auth", "Profile creation failed", { userId: user.id, error: profileError.message });
      return { error: profileError.message };
    }
    
    // Auto-login to establish a session since admin creation bypasses session setting
    const { data: auth } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });
    
    logger.info("action:auth", "User signed up successfully", { username });
    return { success: true, hasSession: !!auth?.session, username };
  } catch (err) {
    const error = err as Error;
    logger.error("action:auth", "Server error", { error: error?.message });
    return { error: "An unexpected error occurred." };
  }
}
