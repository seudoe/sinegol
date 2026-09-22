import "server-only";
import { logger } from "@/lib/logger";
import type { CheckoutInput } from "@/lib/validation/subscription";
import type { Subscription } from "@/types/subscription";

export async function getSubscription(userId: string): Promise<Subscription | null> {
    try {
        logger.warn("service:subscription", "getSubscription not implemented", { userId });
        throw new Error("Not implemented");
        logger.info("service:subscription", "getSubscription executed successfully");
    } catch (error) {
        logger.error("service:subscription", "Error in getSubscription", { error });
        throw error;
    }
}

export async function createCheckoutSession(
  userId: string,
  input: CheckoutInput
): Promise<{ url: string }> {
    try {
        logger.warn("service:subscription", "createCheckoutSession not implemented", {
            userId,
            input,
          });
        throw new Error("Not implemented");
        logger.info("service:subscription", "createCheckoutSession executed successfully");
    } catch (error) {
        logger.error("service:subscription", "Error in createCheckoutSession", { error });
        throw error;
    }
}
