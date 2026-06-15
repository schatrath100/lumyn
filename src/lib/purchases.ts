import type { SubscriptionPlanId } from '../types';
import { getPlan } from '../data/subscription-plans';
import { userFacingError } from './errors';

/** Placeholder for StoreKit / Capacitor IAP — never throw on userCancelled. */
export type PurchaseResult =
  | { ok: true; planId: SubscriptionPlanId }
  | { ok: false; reason: 'cancelled' | 'failed' | 'pending'; message: string };

const RESTORE_KEY = 'lumyn-subscription-active';

export function handlePurchaseOutcome(error: unknown): PurchaseResult {
  const code = (error as { code?: string })?.code;
  if (code === 'userCancelled' || code === 'E_USER_CANCELLED') {
    return { ok: false, reason: 'cancelled', message: '' };
  }
  return { ok: false, reason: 'failed', message: userFacingError(error) };
}

/** Web / dev stub — replace with native StoreKit when wrapping iOS. */
export async function purchasePlan(planId: SubscriptionPlanId): Promise<PurchaseResult> {
  getPlan(planId);
  await new Promise((r) => setTimeout(r, 700));
  localStorage.setItem(RESTORE_KEY, planId);
  return { ok: true, planId };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  await new Promise((r) => setTimeout(r, 500));
  const saved = localStorage.getItem(RESTORE_KEY) as SubscriptionPlanId | null;
  if (saved === 'weekly' || saved === 'quarterly') {
    return { ok: true, planId: saved };
  }
  return {
    ok: false,
    reason: 'failed',
    message: 'No active subscription was found for this Apple ID.',
  };
}

export function clearSubscriptionCache(): void {
  localStorage.removeItem(RESTORE_KEY);
}
