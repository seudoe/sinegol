export type SubscriptionPlan = "monthly" | "yearly";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "past_due";

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  renewal_date: string;
  stripe_subscription_id: string | null;
}
