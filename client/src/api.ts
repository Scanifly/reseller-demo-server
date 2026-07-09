/**
 * Thin fetch wrappers for the backend. Both throw an `Error` carrying the
 * server's `message` (or a status fallback) on a non-2xx response, matching the
 * error handling the forms rely on.
 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message ?? `Server responded with ${response.status}`,
    );
  }
  return (await response.json()) as T;
}

/** GET `url` and parse the JSON response as `T`. */
export function getJson<T>(url: string): Promise<T> {
  return request<T>(url);
}

/** POST `body` as JSON to `url` and parse the JSON response as `T`. */
export function postJson<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Extract a user-facing message from a caught value. */
export function toErrorMessage(err: unknown, fallback = "An error occurred") {
  return err instanceof Error ? err.message : fallback;
}
