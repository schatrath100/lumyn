import { userFacingError } from './errors';

/** Placeholder for StoreKit — never throw on userCancelled; always show friendly copy on failure. */
export type PurchaseResult =
  | { ok: true }
  | { ok: false; reason: 'cancelled' | 'failed'; message: string };

export function handlePurchaseOutcome(error: unknown): PurchaseResult {
  const code = (error as { code?: string })?.code;
  if (code === 'userCancelled' || code === 'E_USER_CANCELLED') {
    return { ok: false, reason: 'cancelled', message: '' };
  }
  return { ok: false, reason: 'failed', message: userFacingError(error) };
}
