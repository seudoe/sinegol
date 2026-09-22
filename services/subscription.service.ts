import "server-only";
import type { CheckoutInput } from "@/lib/validation/subscription";
import type { Subscription } from "@/types/subscription";

export async function getSubscription(
  _userId: string
): Promise<Subscription | null> {
  throw new Error("Not implemented");
}

export async function createCheckoutSession(
  _userId: string,
  _input: CheckoutInput
): Promise<{ url: string }> {
  throw new Error("Not implemented");
}
