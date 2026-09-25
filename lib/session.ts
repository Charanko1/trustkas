export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
<<<<<<< HEAD
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
=======
  walletAddress?: string;
}

/**
 * The auth token is kept in an HttpOnly cookie by the server. We retain the
 * user profile in localStorage for fast client-side rendering only.
 */
export function getToken(): string | null {
  return null;
>>>>>>> master
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
<<<<<<< HEAD

  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem("token", token);
=======
  const data = localStorage.getItem("user");
  if (!data) return null;
  try { return JSON.parse(data) as SessionUser; } catch { return null; }
}

export function saveSession(_token: string | undefined, user: SessionUser) {
>>>>>>> master
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
<<<<<<< HEAD
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
=======
  localStorage.removeItem("user");
}
>>>>>>> master
