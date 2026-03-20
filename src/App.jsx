import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/layout/AppLayout';
import useUserStore from './store/useUserStore';
import PagePlaceholder from './components/PagePlaceholder';

// --- Lazy loaded core views ---
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

// --- Lazy loaded functional views ---
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SecuritySettings = lazy(() => import('./components/SecuritySettings'));
const RBACDebug = lazy(() => import('./pages/settings/RBACDebug'));

// --- Lazy loaded Auth-Service Administration views ---
const Users = lazy(() => import('./pages/settings/Users').catch(() => ({ default: () => <PagePlaceholder title="User Management" /> })));
const Roles = lazy(() => import('./pages/settings/Roles'));
const RoleDetail = lazy(() => import('./pages/settings/RoleDetail'));
const Permissions = lazy(() => import('./pages/settings/Permissions'));
const Menus = lazy(() => import('./pages/settings/Menus'));
const AuditLogs = lazy(() => import('./pages/settings/AuditLogs'));
const ServiceAccounts = lazy(() => import('./pages/settings/ServiceAccounts').catch(() => ({ default: () => <PagePlaceholder title="Service Accounts" /> })));
const Guides = lazy(() => import('./pages/settings/Guides'));

const FallbackLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 block"></div>
  </div>
);

export default function App() {
  const theme = useUserStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#18181b',
            border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
          },
        }}
      />
      <BrowserRouter>
        <Suspense fallback={<FallbackLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              {/* Index redirects to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Unauthorized Route */}
              <Route path="unauthorized" element={<Unauthorized />} />

              {/* Dashboard Route */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Top-Level Parent Routes */}
              <Route path="settings" element={<PagePlaceholder title="Settings" />} />

              {/* Settings Sub-routes */}
              <Route path="settings/security" element={<SecuritySettings />} />
              <Route path="settings/rbac-debug" element={<RBACDebug />} />

              {/* Administration Routes (from Seed) */}
              <Route path="users" element={<Users />} />
              <Route path="roles" element={<Roles />} />
              <Route path="roles/:id" element={<RoleDetail />} />
              <Route path="permissions" element={<Permissions />} />
              <Route path="menus" element={<Menus />} />
              <Route path="service-accounts" element={<ServiceAccounts />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="guides" element={<Guides />} />

              {/* Sub-route unknown redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* Global catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
