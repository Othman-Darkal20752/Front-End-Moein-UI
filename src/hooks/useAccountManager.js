// src/hooks/useAccountManager.js
import { useState, useCallback, useEffect } from 'react';
import { updateAccount, deleteAccountWithPassword, getCurrentUser } from '../api';

export const useAccountManager = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // جلب بيانات المستخدم
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setMessage('Login required');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }

      const response = await getCurrentUser();
      
      if (response?.data) {
        setUserData(response.data);
        // حفظ في localStorage للاستخدام لاحقاً
        try {
          localStorage.setItem('userData', JSON.stringify(response.data));
        } catch (e) {
          console.warn('Data cannot be saved in local storage:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      
      // محاولة استخدام البيانات المحفوظة
      try {
        const cached = localStorage.getItem('userData');
        if (cached) {
          setUserData(JSON.parse(cached));
          setMessage('⚠️ Using cached data');
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage('❌ Unable to load data. Check your connection.');
        }
      } catch (cacheErr) {
        console.error('Error in stored data:', cacheErr);
        setMessage('❌ Error loading data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث الحساب
  const handleUpdateAccount = useCallback(async (values) => {
    setIsUpdating(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      
      if (values.password) {
        payload.password = values.password;
      }

      await updateAccount(payload);
      
      // تحديث البيانات المحلية
      if (userData) {
        setUserData({
          ...userData,
          user: {
            ...userData.user,
            username: values.name,
            email: values.email,
            phone: values.phone,
          }
        });
      }
      
      setMessage('update successful ✅');
      return true;
    } catch (err) {
      console.error('error account update', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'error update';
      setMessage(`❌ ${errorMsg}`);
      return false;
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }, [userData]);

  // حذف الحساب
  const handleDeleteAccount = useCallback(async (password) => {
    setIsDeleting(true);
    try {
      await deleteAccountWithPassword(password);
      
      setMessage('Account deleted successfully ✅');
      setTimeout(() => {
        // تنظيف localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenType');
        localStorage.removeItem('userData');
        
        // إعادة التوجيه للصفحة الرئيسية
        window.location.href = '/';
      }, 2000);
      
      return true;
    } catch (err) {
      console.error('Error deleting account:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to delete account';
      setMessage(`❌ ${errorMsg}`);
      return false;
    } finally {
      setIsDeleting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }, []);

  // القيم الابتدائية للفورم
  const getInitialValues = useCallback(() => {
    if (!userData) {
      return {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      };
    }

    const user = userData.user || {};
    return {
      name: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    };
  }, [userData]);

  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    // البيانات
    userData,
    loading,
    message,
    
    // الحالات
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    isUpdating,
    
    // الدوال
    fetchUserData,
    handleUpdateAccount,
    handleDeleteAccount,
    getInitialValues,
    
    // دالة لإعادة تعيين الفورم
    resetForm: () => {
      // يمكن إضافة منطق إعادة التعيين هنا
    },
    
    // دالة للرسائل
    setMessage,
  };
};