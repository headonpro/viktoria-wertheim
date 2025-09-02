export interface PostgresError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
}

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as PostgresError).code === 'string'
  );
}

export function getErrorMessage(error: unknown): string {
  if (isPostgresError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ein unbekannter Fehler ist aufgetreten';
}