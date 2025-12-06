/**
 * apiHelpers.js - API response handling and normalization
 * Centralizes response parsing, error handling, and data transformation
 */

/**
 * Normalize API response to always return an array
 * Handles different backend response shapes:
 * - Direct array: [...]
 * - Wrapped: {courses: [...], data: [...], results: [...]}
 * - Single object: {course: {...}}
 */
export const normalizeResponse = (response, fallback = []) => {
  const data = response?.data || response;

  if (!data) return fallback;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.courses)) return data.courses;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  if (data.course && typeof data.course === 'object') return [data.course];
  if (data.lecture && typeof data.lecture === 'object') return [data.lecture];

  return fallback;
};

/**
 * Extract error message from various error response formats
 */
export const getErrorMessage = (error) => {
  // Axios error
  if (error.response) {
    const data = error.response.data || {};
    return (
      data.message ||
      data.detail ||
      data.error ||
      `Error ${error.response.status}: ${error.response.statusText}`
    );
  }

  // Network error
  if (error.message) {
    return error.message;
  }

  return 'An unknown error occurred';
};

/**
 * Check if response contains HTML instead of JSON (common ngrok error)
 */
export const isHTMLResponse = (response) => {
  const contentType = response?.headers?.['content-type'] || '';
  return contentType.includes('text/html');
};

/**
 * Extract token from login/signup response
 * Checks multiple common locations where backends store tokens
 */
export const extractToken = (response) => {
  const body = response?.data || response || {};

  // Check common token field names
  const token =
    body.token ||
    body.key ||
    body.access ||
    body.access_token ||
    body.auth_token ||
    body.authToken ||
    body.data?.token ||
    body.data?.access ||
    body.data?.access_token ||
    body.user?.token;

  if (token) return token;

  // Check response headers (some backends send token in Authorization header)
  const authHeader =
    response?.headers?.authorization ||
    response?.headers?.Authorization ||
    response?.headers?.['x-token'] ||
    response?.headers?.['x-auth-token'];

  if (authHeader) {
    const parts = authHeader.split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
  }

  return null;
};

/**
 * Create optimistic update by adding temporary ID
 */
export const createOptimisticItem = (item, tempIdPrefix = 'temp_') => {
  return {
    ...item,
    id: `${tempIdPrefix}${Date.now()}`,
    __optimistic: true,
  };
};

/**
 * Remove optimistic marker from item
 */
export const removeOptimisticMarker = (item) => {
  const { __optimistic, ...rest } = item;
  return rest;
};
