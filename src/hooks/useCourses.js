// src/hooks/useCourses.js
import { useState, useCallback, useEffect } from 'react';
import { fetchCourses, createCourse } from '../api';

const CACHE_KEY = 'courses_cache_v1';

export const useCourses = (pendingRefresh, clearPendingRefresh) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Load cached data
  const loadCachedData = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setCourses(JSON.parse(cached));
        return JSON.parse(cached);
      } catch (e) {
        console.error('Cache parse error', e);
      }
    }
    return [];
  }, []);

  // Fetch courses from API
  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetchCourses();
      const raw = res?.data || res;
      
      // Parse response based on different API structures
      const items = (() => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw.courses)) return raw.courses;
        if (Array.isArray(raw.data)) return raw.data;
        if (Array.isArray(raw.results)) return raw.results;
        if (raw.course && typeof raw.course === 'object') return [raw.course];
        return [];
      })();

      setCourses(items);
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      
      return items;
    } catch (err) {
      console.error('fetchCourses error', err);
      setError('The courses cannot be loaded. Please check your internet connection.');
      return loadCachedData();
    } finally {
      setLoading(false);
      if (clearPendingRefresh) clearPendingRefresh();
    }
  }, [clearPendingRefresh, loadCachedData]);

  // Create new course
  const handleCreateCourse = useCallback(async (values) => {
    const tmpId = `tmp-${Date.now()}`;
    const tmpCourse = { id: tmpId, ...values, __optimistic: true };
    const prev = courses.slice();
    const optimistic = [tmpCourse, ...prev];
    
    setCourses(optimistic);
    localStorage.setItem(CACHE_KEY, JSON.stringify(optimistic));
    setMessage('Creating course...');

    try {
      const res = await createCourse(values);
      const newCourse = res?.data?.course ?? res?.data ?? res;

      if (newCourse && (newCourse.id || newCourse.pk)) {
        const canonical = newCourse.id ? newCourse : { id: newCourse.pk, ...newCourse };
        const replaced = optimistic.map((c) => (c.id === tmpId ? canonical : c));
        setCourses(replaced.filter(Boolean));
        localStorage.setItem(CACHE_KEY, JSON.stringify(replaced.filter(Boolean)));
        setMessage('Created course successfully ✓');
      } else {
        await loadCourses();
        setMessage('Created course successfully ✓');
      }
      
      return { success: true, course: newCourse };
    } catch (err) {
      console.error('createCourse error', err);
      setCourses(prev);
      localStorage.setItem(CACHE_KEY, JSON.stringify(prev));
      setError('failed to create course. Please try again.');
      return { success: false, error: err };
    } finally {
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  }, [courses, loadCourses]);

  // Load courses on mount or when pendingRefresh changes
  useEffect(() => {
    loadCachedData();
    
    if (pendingRefresh || courses.length === 0) {
      loadCourses();
    }
  }, [pendingRefresh, loadCachedData, loadCourses]);

  return {
    // State
    courses,
    loading,
    error,
    message,
    
    // Actions
    loadCourses,
    handleCreateCourse,
    
    // Setters
    setError,
    setMessage,
  };
};