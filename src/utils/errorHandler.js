/**
 * errorHandler.js - Centralized error handling
 * Provides consistent error logging and user-facing error messages
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Log error with context (development only)
 */
export const logError = (context, error, details = {}) => {
  if (!isDevelopment) return;

  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error?.message,
    status: error?.response?.status,
    ...details,
  };

  console.error(`[${context}]`, errorInfo);
};

/**
 * Get user-friendly error message
 */
export const getUserErrorMessage = (error, defaultMessage = 'Something went wrong') => {
  // Network errors
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection.';
    }
    return error.message || defaultMessage;
  }

  const status = error.response.status;
  const data = error.response.data || {};

  // Auth errors
  if (status === 401) {
    return 'Session expired. Please log in again.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Validation errors
  if (status === 400) {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.detail) return data.detail;
    if (data.error) return data.error;
    // Field errors
    const firstFieldError = Object.values(data)[0];
    if (Array.isArray(firstFieldError)) {
      return firstFieldError[0];
    }
    return 'Invalid data. Please check your input.';
  }

  // Server errors
  if (status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Generic fallback
  if (data.message) return data.message;
  if (data.detail) return data.detail;
  if (data.error) return data.error;

  return defaultMessage;
};

/**
 * Create error boundary error handler
 */
export const createErrorBoundary = (error, errorInfo) => {
  logError('ErrorBoundary', error, {
    componentStack: errorInfo.componentStack,
  });

  return {
    title: 'Something went wrong',
    message: 'Please try refreshing the page or contacting support.',
    isDevelopment,
    details: isDevelopment ? error.toString() : null,
  };
};

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
};
