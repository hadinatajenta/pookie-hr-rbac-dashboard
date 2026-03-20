import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from '../organisms/Topbar';
import useMenuStore from '../../store/useMenuStore';
import useUserStore from '../../store/useUserStore';
import Spinner from '../atoms/Spinner';
import { useAuth } from '../../context/AuthContext';

/**
 * Paths that are always accessible to any authenticated user,
 * regardless of what menus the backend returns.
 */
const ALWAYS_ALLOWED_PREFIXES = [
  '/dashboard',
  '/settings',
  '/unauthorized',
  '/guides',
];

const isAlwaysAllowed = (path) =>
  ALWAYS_ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));

const getValidPathsFromMenus = (menus) => {
  let paths = [];
  const traverse = (menuList) => {
    menuList.forEach((m) => {
      if (m.path) paths.push(m.path.startsWith('/') ? m.path : `/${m.path}`);
      if (m.children && m.children.length > 0) traverse(m.children);
    });
  };
  traverse(menus);
  return paths;
};

const ContentWrapper = () => {
  const { menus, isInitialized, isLoading } = useMenuStore();
  const location = useLocation();

  if (isLoading && !isInitialized) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  let currentPath = location.pathname;
  if (currentPath.endsWith('/') && currentPath.length > 1) {
    currentPath = currentPath.slice(0, -1);
  }

  // Always allow paths that exist in the static router regardless of menu
  if (isAlwaysAllowed(currentPath)) {
    return <Outlet />;
  }

  // For dynamic (menu-driven) paths, check against the allowed menus
  // Recursive check for menu access
  const checkPath = (items, targetPath) => {
    for (const item of items) {
      // Ensure item.path starts with '/' for consistent comparison
      const itemPath = item.path ? (item.path.startsWith('/') ? item.path : `/${item.path}`) : null;
      
      // Match exact path OR allow sub-routes (e.g. /roles/1 should be allowed if /roles is allowed)
      if (itemPath === targetPath || (itemPath && targetPath.startsWith(itemPath + '/'))) return true;
      
      if (item.children && item.children.length > 0) {
        if (checkPath(item.children, targetPath)) return true;
      }
    }
    return false;
  };

  const hasAccess = checkPath(menus, currentPath);

  if (!hasAccess && isInitialized && currentPath !== '/') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { profile } = useUserStore();

  const handleToggleSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleCloseSidebar = () => setIsMobileMenuOpen(false);

  const location = useLocation();
  const getPageTitle = (path) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    return segments[segments.length - 1].replace(/-/g, ' ');
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased overflow-hidden selection:bg-zinc-200 dark:selection:bg-zinc-700">
      <Sidebar isOpen={isMobileMenuOpen} onClose={handleCloseSidebar} />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <Topbar
          title={getPageTitle(location.pathname)}
          profile={profile}
          onLogout={logout}
          onToggleSidebar={handleToggleSidebar}
        />

        <div className="flex-1 overflow-y-auto w-full relative">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto h-full">
            <ContentWrapper />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
