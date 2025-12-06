// src/router.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// lazy load pages (يحسن الـ bundle)
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const AccountManagement = lazy(() => import("./pages/AccountManagement"));

const Loading = () => <div style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Loading…</div>;

// بسيط: حماية مسار (يمكن تحسين لاحقًا باستخدام context أو hooks)
const RequireAuth = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/courses" element={<RequireAuth><Courses /></RequireAuth>} />
        <Route path="/account" element={<RequireAuth><AccountManagement /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
