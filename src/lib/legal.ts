/** Canonical legal URLs — required for App Store review (Guideline 3.1.2 / subscriptions). */
export const LEGAL = {
  privacyPolicy: 'https://www.whyteboard.com/privacy',
  /** Apple standard EULA — link in Settings and any paywall. */
  termsOfUse: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  supportEmail: 'hello@whyteboard.com',
  productPage: 'https://www.whyteboard.com/lumyn',
} as const;

export function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
