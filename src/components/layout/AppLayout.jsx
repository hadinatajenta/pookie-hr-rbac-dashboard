import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from '../organisms/Topbar';
import useMenuStore from '../../store/useMenuStore';
import Spinner from '../atoms/Spinner';
import { useAuth } from '../../context/AuthContext';

const getValidPaths = (menus) => {
  let paths = [];
  const traverse = (menuList) => {
    menuList.forEach(m => {
      if (m.path) paths.push(m.path.startsWith('/') ? m.path : `/${m.path}`);
      if (m.children && m.children.length > 0) {
        traverse(m.children);
      }
    });
  };
  traverse(menus);
  return paths;
};

const ContentWrapper = () => {
  const { menus, isInitialized, isLoading } = useMenuStore();
  const location = useLocation();

  if (isLoading && !isInitialized) {
      return <div className="h-full flex flex-col items-center justify-center"><Spinner size="lg" /></div>;
  }

  let currentPath = location.pathname;
  if (currentPath.endsWith('/') && currentPath.length > 1) {
      currentPath = currentPath.slice(0, -1);
  }

  // Always allow unauthorized page
  if (currentPath === '/unauthorized') {
      return <Outlet />;
  }

  const validPaths = getValidPaths(menus);
  const hasAccess = validPaths.includes(currentPath);

  // If we are initialized, menus are fetched, and path is not allowed
  if (!hasAccess && isInitialized && currentPath !== '/') {
      return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const handleToggleSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleCloseSidebar = () => setIsMobileMenuOpen(false);

  // Derive title from current path for Topbar
  const location = useLocation();
  const getPageTitle = (path) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    return segments[0].replace(/-/g, ' ');
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased overflow-hidden selection:bg-zinc-200 dark:selection:bg-zinc-700">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <Topbar 
          title={getPageTitle(location.pathname)} 
          profile={user} 
          onLogout={logout} 
          onToggleSidebar={handleToggleSidebar}
        />
        
        <div className="flex-1 overflow-y-auto w-full">
            <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto h-full">
              <ContentWrapper />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
