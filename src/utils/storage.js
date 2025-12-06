/**
 * storage.js - localStorage utilities
 * Centralized caching and storage helpers
 */

const CACHE_KEYS = {
  COURSES: 'courses_cache_v1',
  LECTURES: (courseId) => `lectures_cache_${courseId}`,
  THEME: 'app_theme',
};

/**
 * Get cached data from localStorage
 */
export const getCache = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.warn(`Failed to parse cache for key '${key}':`, e);
    return null;
  }
};

/**
 * Set cached data in localStorage
 */
export const setCache = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to cache data for key '${key}':`, e);
  }
};

/**
 * Clear specific cache
 */
export const clearCache = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/**
 * Clear all caches
 */
export const clearAllCaches = () => {
  if (typeof window === 'undefined') return;
  Object.values(CACHE_KEYS).forEach((key) => {
    if (typeof key === 'string') {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Get courses from cache
 */
export const getCachedCourses = () => getCache(CACHE_KEYS.COURSES);

/**
 * Save courses to cache
 */
export const setCachedCourses = (courses) =>
  setCache(CACHE_KEYS.COURSES, courses);

/**
 * Get lectures for a course from cache
 */
export const getCachedLectures = (courseId) =>
  getCache(CACHE_KEYS.LECTURES(courseId));

/**
 * Save lectures for a course to cache
 */
export const setCachedLectures = (courseId, lectures) =>
  setCache(CACHE_KEYS.LECTURES(courseId), lectures);

/**
 * Clear all lecture caches
 */
export const clearAllLectureCaches = () => {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('lectures_cache_')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Get theme preference from storage
 */
export const getTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(CACHE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') return saved;
  // Respect system preference if not explicitly set
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Save theme preference to storage
 */
export const setTheme = (theme) => {
  if (typeof window === 'undefined') return;
  if (theme === 'dark' || theme === 'light') {
    localStorage.setItem(CACHE_KEYS.THEME, theme);
  }
};
