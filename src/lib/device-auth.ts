const EMAIL_KEY = 'lumyn-device-auth-email';
const PASSWORD_KEY = 'lumyn-device-auth-password';

/** Silent per-install credentials when Anonymous auth is unavailable (SHYNE pattern). */
export function getDeviceCredentials(): { email: string; password: string } {
  const email = localStorage.getItem(EMAIL_KEY);
  const password = localStorage.getItem(PASSWORD_KEY);
  if (email && password) return { email, password };

  const id = crypto.randomUUID().replace(/-/g, '').toLowerCase();
  const newEmail = `${id}@device.lumyn.local`;
  const newPassword = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  localStorage.setItem(EMAIL_KEY, newEmail);
  localStorage.setItem(PASSWORD_KEY, newPassword);
  return { email: newEmail, password: newPassword };
}

export function resetDeviceAuth(): void {
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}
