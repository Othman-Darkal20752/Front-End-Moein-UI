/**
 * auth.js - Centralized authentication utilities
 * Handles token storage, sanitization, and validation
 */

const STORAGE_KEYS = {
  TOKEN: 'authToken',
  TOKEN_TYPE: 'authTokenType',
  USER_DATA: 'userData',
};

/**
 * Sanitize token by removing quotes and trimming whitespace
 */
export const sanitizeToken = (token) => {
  if (!token) return null;
  const raw = String(token).trim();
  const cleaned =
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
      ? raw.slice(1, -1)
      : raw;
  return cleaned;
};

/**
 * Infer authorization scheme from token format
 * JWT tokens contain dots, so use Bearer; otherwise use Token
 */
export const inferAuthScheme = (token) => {
  if (!token) return 'Bearer';
  return token.includes('.') ? 'Bearer' : 'Token';
};

/**
 * Get stored auth from localStorage
 */
export const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, tokenType: null };
  }

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const tokenType = localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE);

  if (!token) return { token: null, tokenType: null };

  const cleaned = sanitizeToken(token);
  const type = tokenType || inferAuthScheme(cleaned);

  return { token: cleaned, tokenType: type };
};

/**
 * Save token to localStorage
 */
export const saveToken = (token, tokenType = null) => {
  if (typeof window === 'undefined') return;

  if (!token) {
    clearToken();
    return;
  }

  const cleaned = sanitizeToken(token);
  const type = tokenType || inferAuthScheme(cleaned);

  localStorage.setItem(STORAGE_KEYS.TOKEN, cleaned);
  localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, type);
};

/**
 * Clear auth from localStorage
 */
export const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save user data to storage:', e);
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Failed to parse user data:', e);
    return null;
  }
};

/**
 * Clear all auth-related data
 */
export const clearAllAuthData = () => {
  if (typeof window === 'undefined') return;
  clearToken();
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};
