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
  is_staff?: boolean;
}
export function isAdmin(): boolean {
  const user = getUser();
  return user?.is_staff === true;
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

      // store tokens first
      if (data.access && data.refresh) {
        setTokens(data.access, data.refresh);
      } else if (data.token) {
        // legacy single token field
        setTokens(data.token, '');
      }

      // Try to fetch full user profile from new endpoint
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/auth/user/`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUser(profile);
        } else if (data.user) {
          // fallback to user in login response if present
          setUser(data.user);
        } else {
          // minimal fallback so UI can show username
          setUser({
            id: data.id ?? data.user_id ?? 0,
            username: (data.username as string) ?? username,
            email: (data.email as string) ?? undefined,
            first_name: (data.first_name as string) ?? undefined,
            last_name: (data.last_name as string) ?? undefined,
            is_staff: (data.is_staff as boolean) ?? (data.is_admin as boolean) ?? undefined,
          });
        }
      } catch {
        // on any error while fetching profile, still persist minimal user
        setUser({
          id: data.id ?? data.user_id ?? 0,
          username: (data.username as string) ?? username,
          email: (data.email as string) ?? undefined,
          first_name: (data.first_name as string) ?? undefined,
          last_name: (data.last_name as string) ?? undefined,
          is_staff: (data.is_staff as boolean) ?? (data.is_admin as boolean) ?? undefined,
        });
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

      // handle tokens if registration returns them
      if (result.access && result.refresh) {
        setTokens(result.access, result.refresh);
      } else if (result.token) {
        setTokens(result.token, '');
      }

      // try to fetch profile using the stored access token
      if (getAccessToken()) {
        try {
          const profileRes = await fetch(`${API_BASE_URL}/api/auth/user/`, {
            method: 'GET',
            headers: getAuthHeaders(),
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setUser(profile);
          } else if (result.user || result.id) {
            setUser({
              id: result.id ?? 0,
              username: data.username,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
            });
          }
        } catch {
          setUser({
            id: result.id ?? 0,
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
          });
        }
      } else if (result.id) {
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
/**
 * Request a password reset email
 * @param email - User's email address
 * @returns Promise with success status and error message if any
 */
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.detail || 'Password reset email sent.',
      };
    } else {
      return {
        success: false,
        error: data.detail || data.email?.[0] || 'Failed to send reset email.',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};

/**
 * Confirm password reset with token
 * @param uid - Encoded user ID from email link
 * @param token - Reset token from email link
 * @param newPassword1 - New password
 * @param newPassword2 - Confirm new password
 * @returns Promise with success status and error message if any
 */
export const confirmPasswordReset = async (
  uid: string,
  token: string,
  newPassword1: string,
  newPassword2: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.detail || 'Password reset successfully.',
      };
    } else {
      // Handle various error formats
      let errorMessage = 'Failed to reset password.';
      
      if (data.token) {
        errorMessage = Array.isArray(data.token) 
          ? data.token[0] 
          : 'Invalid or expired reset link.';
      } else if (data.new_password2) {
        errorMessage = Array.isArray(data.new_password2)
          ? data.new_password2[0]
          : data.new_password2;
      } else if (data.detail) {
        errorMessage = data.detail;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};
