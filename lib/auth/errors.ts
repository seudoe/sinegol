import type { AuthError } from "@supabase/supabase-js";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Confirm your email before signing in — check your inbox.",
  email_address_invalid: "That email address isn't accepted — try a different one.",
  email_exists: "An account with this email already exists. Try signing in instead.",
  user_already_exists: "An account with this email already exists. Try signing in instead.",
  over_email_send_rate_limit: "Too many attempts — wait a few minutes and try again.",
  weak_password: "Choose a stronger password.",
  over_request_rate_limit: "Too many attempts — wait a moment and try again.",
};

export function friendlyAuthError(error: Pick<AuthError, "code" | "message">): string {
  if (error.code && MESSAGES[error.code]) {
    return MESSAGES[error.code];
  }
  return error.message;
}
