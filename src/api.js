import axios from 'axios';
import {
  getStoredAuth,
  saveToken,
  clearToken,
  sanitizeToken,
  inferAuthScheme,
} from './utils/auth';
import {
  normalizeResponse,
  extractToken,
  getErrorMessage,
} from './utils/apiHelpers';

// Constants
const IS_BROWSER = typeof window !== 'undefined';
const API_URLS = {
  LOCAL: 'http://localhost:8000/api',
  NGROK1: 'https://asteroidal-rikki-craniologically.ngrok-free.dev',
  NGROK2: 'https://lissom-plainly-cathi.ngrok-free.dev'
};

// Helper function to create auth headers
const getAuthHeaders = (additionalHeaders = {}) => {
  const { token, tokenType } = getStoredAuth();

  if (!token) {
    if (IS_BROWSER && process.env.NODE_ENV !== 'production') {
      console.warn('[API] Request called without auth token in localStorage');
    }
    return additionalHeaders;
  }

  return {
    Authorization: `${tokenType} ${token}`,
    ...additionalHeaders
  };
};

// Create and configure axios instance
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });
  const { token, tokenType } = getStoredAuth();

  if (token) {
    instance.defaults.headers.common['Authorization'] = `${tokenType} ${token}`;
  }

  return instance;
};

// API instances
const api = createAxiosInstance(API_URLS.LOCAL);
const ngrokApi = createAxiosInstance(API_URLS.NGROK1);
const ngrokApi2 = createAxiosInstance(API_URLS.NGROK2);

// Set global auth header
const { token: globalToken, tokenType: globalTokenType } = getStoredAuth();
if (globalToken) {
  axios.defaults.headers.common['Authorization'] = `${globalTokenType} ${globalToken}`;
}

// Development request logger
if (IS_BROWSER && process.env.NODE_ENV !== 'production') {
  const requestLogger = (config) => {
    try {
      const { method, url } = config;
      // Don't log full headers to avoid exposing tokens
      console.debug('[API]', method?.toUpperCase(), url);
    } catch (error) {
      // Ignore logging errors
    }
    return config;
  };

  // Apply logger to all instances
  [axios, api, ngrokApi, ngrokApi2].forEach(instance => {
    instance.interceptors.request.use(requestLogger);
  });
}

// Helper to update auth on all instances
const updateAllInstancesAuth = (authHeader) => {
  const instances = [axios, api, ngrokApi, ngrokApi2];

  if (authHeader) {
    instances.forEach(instance => {
      instance.defaults.headers.common['Authorization'] = authHeader;
    });
  } else {
    instances.forEach(instance => {
      delete instance.defaults.headers.common['Authorization'];
    });
  }
};

// Authentication endpoints
export const loginUser = (data) => ngrokApi.post('/api/login/', data);
export const signupUser = (data) => ngrokApi.post('/api/signup/', data);

// ==================== User Profile Endpoints ====================
// Get current user profile from /api/me/
export const getCurrentUser = () => ngrokApi.get('/api/me/', {
  headers: getAuthHeaders()
});



export const updateAccount = (data) => ngrokApi.put('/api/user/', data, {
  headers: getAuthHeaders({ 'Content-Type': 'application/json' })
});

export const getUserInfo = () => ngrokApi.get('/api/user/', {
  headers: getAuthHeaders()
});

// ==================== Courses Endpoints ====================
export const fetchCourses = () => ngrokApi2.get('/api/courses/', {
  withCredentials: true,
  headers: getAuthHeaders({ 'Content-Type': 'application/json' })
});

export const createCourse = (data) => ngrokApi2.post('/api/courses/create/', data, {
  headers: getAuthHeaders({ 'Content-Type': 'application/json' })
});

export const getCourseDetails = (courseId) => ngrokApi2.get(`/api/courses/${courseId}/`, {
  headers: getAuthHeaders()
});

// ==================== Lectures Endpoints ====================
export const fetchLectures = (courseId) => ngrokApi.get(`/api/courses/${courseId}/lectures/`, {
  headers: getAuthHeaders()
});

// في api.js
export const createLecture = async (courseId, data) => {
  try {
    // إذا كانت data FormData (تحتوي على file)
    if (data instanceof FormData) {
      const response = await ngrokApi2.post(`/api/courses/${courseId}/lectures/upload/`, data, {
        headers: {
          ...getAuthHeaders(),
          // لا تضف Content-Type هنا، المتصفح يضيفه تلقائياً لـ FormData
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      });
      return response;
    } else {
      // إذا كانت JSON (بدون file)
      const response = await ngrokApi2.post(`/api/courses/${courseId}/lectures/`, data, {
        headers: getAuthHeaders({ 'Content-Type': 'application/json' })
      });
      return response;
    }
  } catch (error) {
    console.error('Error in createLecture:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Create lecture without file
export const createLectureWithoutFile = async (courseId, lectureName) => {
  try {
    const response = await ngrokApi2.post(`/api/courses/${courseId}/lectures/`, {
      lecture_name: lectureName
    }, {
      headers: getAuthHeaders({ 'Content-Type': 'application/json' })
    });

    return response;
  } catch (error) {
    console.error('Error creating lecture without file:', error);
    throw error;
  }
};

// Upload file to existing lecture
export const uploadFileToLecture = async (courseId, lectureId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await ngrokApi2.post(`/api/courses/${courseId}/lectures/${lectureId}/upload/`, formData, {
      headers: getAuthHeaders()
    });

    return response;
  } catch (error) {
    console.error('Error uploading file to lecture:', error);
    throw error;
  }
};

// Download lecture file
export const downloadLectureFile = async (courseId, lectureId) => {
  try {
    const response = await ngrokApi2.get(`/api/courses/${courseId}/lectures/${lectureId}/download/`, {
      headers: getAuthHeaders(),
      responseType: 'blob'
    });

    return response;
  } catch (error) {
    console.error('Error downloading lecture file:', error);
    throw error;
  }
};

// Delete lecture
export const deleteLecture = async (courseId, lectureId) => {
  try {
    const response = await ngrokApi2.delete(`/api/courses/${courseId}/lectures/${lectureId}/`, {
      headers: getAuthHeaders()
    });

    return response;
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
};

// ==================== Auth Helpers ====================
/**
 * Set auth token and update all axios instances
 */
export const setAuthToken = (token) => {
  if (!IS_BROWSER) return;

  if (token) {
    const cleaned = sanitizeToken(token);
    const type = inferAuthScheme(cleaned);
    saveToken(cleaned, type);
    updateAllInstancesAuth(`${type} ${cleaned}`);
  } else {
    clearAllAuthData();
  }
};

/**
 * Clear all auth data
 */
export const clearAuthToken = () => {
  if (!IS_BROWSER) return;
  clearToken();
  updateAllInstancesAuth(null);
};

/**
 * Clear all cached user data from auth system
 */
const clearAllAuthData = () => {
  clearToken();
  updateAllInstancesAuth(null);
};

// ==================== Utility Functions ====================
export const isAuthenticated = () => {
  if (!IS_BROWSER) return false;
  const { token } = getStoredAuth();
  return !!token;
};

export const getCurrentAuth = () => getStoredAuth();

// Helper function to create FormData for lecture
export const createLectureFormData = (lectureName, file) => {
  const formData = new FormData();
  formData.append('lecture_name', lectureName);
  if (file) {
    formData.append('file', file);
  }
  return formData;
};

// Helper to download file
export const downloadFile = async (courseId, lectureId, fileName = 'lecture_file') => {
  try {
    const response = await downloadLectureFile(courseId, lectureId);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let downloadFileName = fileName;

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2) {
        downloadFileName = fileNameMatch[1];
      }
    }

    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => window.URL.revokeObjectURL(url), 100);

    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

// ==================== Account Management Endpoints ====================

// Delete account with password confirmation
export const deleteAccountWithPassword = (password) => ngrokApi.delete('/api/delete/', {
  data: { password: password },
  headers: getAuthHeaders({ 'Content-Type': 'application/json' })
});

// Old delete account function (keep for backward compatibility)
export const deleteAccount = () => ngrokApi.delete('/api/delete/', {
  headers: getAuthHeaders()
});

// في AccountManagement.jsx - استخدم fetch مع التوكن

const fetchUser = async () => {
  try {
    // جلب التوكن
    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('authTokenType') || 'Bearer';

    if (!token) {
      console.error("No token found in localStorage");
      setMessage("Please login first");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      setLoading(false);
      return;
    }

    // تنظيف التوكن
    const cleanedToken = token.replace(/^["']|["']$/g, '').trim();
    console.log("Token length:", cleanedToken.length);

    // OPTION 1: جرب مع fetch مع جميع الخيارات
    const response = await fetch('https://asteroidal-rikki-craniologically.ngrok-free.dev/api/me/', {
      method: 'GET',
      mode: 'cors', // مهم لـ CORS
      cache: 'no-cache',
      credentials: 'include', // إذا كان يستخدم cookies
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${cleanedToken}`,
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'any' // إذا كان في warning من ngrok
      }
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    // تحقق إذا كان الرد HTML (خطأ)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error("Got HTML instead of JSON:", htmlText.substring(0, 500));

      // احتمال يكون الـ ngrok يعرض صفحة error
      if (htmlText.includes('ngrok') || htmlText.includes('error')) {
        setMessage("❌ Ngrok connection error. Please try again later.");
        setLoading(false);
        return;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log("Success! User data:", data);

    if (!mounted) return;

    // ... باقي الكود ...

  } catch (err) {
    console.error("Fetch error details:", err);

    // OPTION 2: جرب مع axios إذا fetch فشل
    try {
      console.log("Trying with axios...");
      const axios = (await import('axios')).default;

      const response = await axios.get('https://asteroidal-rikki-craniologically.ngrok-free.dev/api/me/', {
        headers: {
          'Authorization': `${tokenType} ${cleanedToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'any'
        },
        withCredentials: true
      });

      console.log("Axios success:", response.data);

      if (!mounted) return;

      const user = response.data.user || {};
      setInitialValues({
        name: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });

    } catch (axiosErr) {
      console.error("Axios also failed:", axiosErr);

      // OPTION 3: جرب الرابط المحلي
      try {
        console.log("Trying localhost...");
        const localResponse = await fetch('http://localhost:8000/api/me/', {
          method: 'GET',
          headers: {
            'Authorization': `${tokenType} ${cleanedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (localResponse.ok) {
          const localData = await localResponse.json();
          console.log("Localhost success:", localData);

          if (!mounted) return;

          const user = localData.user || {};
          setInitialValues({
            name: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (localErr) {
        console.error("Localhost failed:", localErr);
        setMessage("❌ Cannot connect to server. Please check your connection.");
      }
    }
  } finally {
    if (mounted) setLoading(false);
  }
};