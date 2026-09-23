import { getToken } from "@/lib/session";

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

/** Shared transport; query caching lives in the dashboard's QueryClient. */
export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.message || `Request failed (${response.status}). Please try again.`, response.status);
  return data as T;
}
