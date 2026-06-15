import type { SubscriptionPlanId } from '../types';

/** Lumyn premium plans — mirror SHYNE pricing & 3-day free trial (StoreKit intro offer). */
export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  productId: string;
  label: string;
  fallbackPrice: string;
  subtext: string;
  billingNote: string;
  isHero: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'quarterly',
    productId: 'com.whyteboard.lumyn.premium.quarterly',
    label: 'Quarterly',
    fallbackPrice: '$24.99 / quarter',
    subtext: 'Just $1.92/wk · Save 68%',
    billingNote: '3 days free, then billed quarterly',
    isHero: true,
  },
  {
    id: 'weekly',
    productId: 'com.whyteboard.lumyn.premium.weekly',
    label: 'Weekly',
    fallbackPrice: '$5.99 / week',
    subtext: 'Flexible, cancel anytime',
    billingNote: '3 days free, then billed weekly',
    isHero: false,
  },
];

export function getPlan(id: SubscriptionPlanId): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) ?? SUBSCRIPTION_PLANS[0];
}
