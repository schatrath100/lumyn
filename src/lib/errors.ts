/** User-facing copy for recoverable failures — never expose raw errors to users. */
export const USER_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export function userFacingError(_err?: unknown): string {
  return USER_ERROR_MESSAGE;
}
