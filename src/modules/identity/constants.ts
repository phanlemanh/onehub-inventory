// The numbers of signing in with an emailed code (row 8, decision 0021). The owner kept the numbers of onehub-quy-hang
// (ADR-0005 there) at the scope gate, Hỏi-2. One place: the API, the database functions and the tests read them here.

/** Digits in a code. */
export const CODE_LENGTH = 6;
/** A code expires five minutes after it was sent. */
export const CODE_TTL_SEC = 5 * 60;
/** The third wrong code kills the code; a new one must be requested. */
export const CODE_MAX_ATTEMPTS = 3;
/** Each email may request a code this many times in the window — unknown emails count too. */
export const CODE_REQUEST_LIMIT = 5;
export const CODE_REQUEST_WINDOW_SEC = 15 * 60;
/** A session lives 30 days and slides: used again after more than a day, it is extended to now + 30 days. */
export const SESSION_TTL_SEC = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_AFTER_SEC = 24 * 60 * 60;

/**
 * The cookie outlives any session (400 days, the most browsers keep): the database expiry, which slides, is the only
 * clock. A cookie tied to the first 30 days would end a session that is still being used.
 */
export const SESSION_COOKIE_MAX_AGE_SEC = 400 * 24 * 60 * 60;
/** The session cookie. Only the server reads it (HttpOnly). */
export const SESSION_COOKIE = "ohi_session";
/** Where every sign-in write goes (`/api/v1` is the only write path). */
export const AUTH_BASE_PATH = "/api/v1/auth";
