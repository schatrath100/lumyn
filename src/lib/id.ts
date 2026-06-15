export function newId(): string {
  return crypto.randomUUID();
}

/** True if string is a UUID (Supabase row id). */
export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
