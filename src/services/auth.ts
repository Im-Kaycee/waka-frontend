import { API_BASE_URL, STORAGE_KEYS } from '@/config/api';

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export function setUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthHeaders {
  'Content-Type': string;
  Authorization?: string;
}

export function getAuthHeaders(): AuthHeaders {
  const headers: AuthHeaders = {
    'Content-Type': 'application/json',
  };
  
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
      return data.access;
    } else {
      clearTokens();
      return null;
    }
  } catch {
    clearTokens();
    return null;
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, data.refresh);

      // Persist user if returned by the login endpoint, otherwise save a minimal user object
      if (data.user) {
        setUser(data.user);
      } else if (data.id || data.user_id || data.username) {
        setUser({
          id: data.id ?? data.user_id ?? 0,
          username: (data.username as string) ?? username,
          email: (data.email as string) ?? undefined,
          first_name: (data.first_name as string) ?? undefined,
          last_name: (data.last_name as string) ?? undefined,
        });
      } else {
        // Minimal fallback so UI can show the username/guest logic
        setUser({ id: 0, username });
      }

      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.detail || 'Login failed' };
    }
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.token) {
        // Auto login after registration
        setTokens(result.token, '');
      }
      if (result.id) {
        setUser({
          id: result.id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      }
      return { success: true };
    } else {
      const error = await response.json();
      const errorMessage = Object.values(error).flat().join(', ');
      return { success: false, error: errorMessage || 'Registration failed' };
    }
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function logout(): void {
  clearTokens();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
