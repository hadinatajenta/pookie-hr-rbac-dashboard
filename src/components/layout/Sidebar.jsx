import React, { useEffect, useState } from 'react';
import useMenuStore from '../../store/useMenuStore';
import useUserStore from '../../store/useUserStore';
import SidebarItem from './SidebarItem';
import { X, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { menus, isLoading: isMenuLoading, error, initializeMenus, isInitialized } = useMenuStore();
  const { profile, theme, toggleTheme } = useUserStore();
  const { logout } = useAuth();
  
  const [isExpanded, setExpanded] = useState(true); 
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isInitialized) initializeMenus();
  }, [initializeMenus, isInitialized]);

  const sidebarWidth = isExpanded ? 'w-64' : 'w-20';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden anim-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarWidth} flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/60
          shadow-xl lg:shadow-none shrink-0
      `}>
      
        <div className="h-16 flex items-center justify-between px-5 shrink-0 border-b border-transparent">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <div className={`flex flex-col whitespace-nowrap transition-all duration-300 origin-left 
                ${isExpanded ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-95 w-0'}`}>
              <span className="font-bold text-sm text-zinc-900 dark:text-white tracking-wide">POOKIE.</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium tracking-widest uppercase">Workspace</span>
            </div>
          </div>

          <button onClick={onClose} className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <nav className="flex flex-col gap-1.5 w-full">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Navigation</h3>
            </div>

            {error && (
              <div className="px-3 py-2 mt-2 text-xs text-red-400 bg-red-500/10 rounded-md border border-red-500/20">
                 {error}
                 <button onClick={() => initializeMenus(true)} className="mt-1 flex items-center gap-1 underline hover:text-red-300 transition-colors">
                    Retry
                 </button>
              </div>
            )}

            {isMenuLoading && !isInitialized ? (
              <div className="flex flex-col gap-3 px-3 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800/60 rounded-md animate-pulse"></div>
                    <div className="h-4 w-full max-w-[120px] bg-zinc-100 dark:bg-zinc-800/60 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              menus?.length > 0 ? (
                  menus.map((menu) => <SidebarItem key={menu.id} item={menu} />)
              ) : (
                  !isMenuLoading && !error && (
                      <div className="px-3 py-4 text-sm text-zinc-500 text-center">No accessible menus found.</div>
                  )
              )
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/40 mt-auto flex items-center justify-between gap-2">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex flex-1 items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white group overflow-hidden"
            title="View Profile"
          >
              <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase">
                  {profile?.first_name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate w-full">{profile?.first_name || 'Loading...'}</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider truncate w-full">@{profile?.username || 'user'}</span>
              </div>
          </button>

          <button onClick={toggleTheme} className="p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Toggle Theme">
             {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button onClick={() => setShowLogoutModal(true)} className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Logout">
             <LogOut size={16} />
          </button>
        </div>

      </aside>
      
      {/* Modals moved outside aside to avoid transform isolation */}
      {showProfileModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-8 w-full max-w-sm shadow-2xl anim-fade-up relative mx-4">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center text-3xl font-bold text-indigo-400 uppercase mb-4">
                {profile?.first_name?.charAt(0) || <User size={32} />}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{profile?.first_name} {profile?.last_name}</h3>
              <p className="text-sm text-zinc-500 dark:text-text-secondary font-mono">@{profile?.username}</p>
            </div>

            <div className="pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800/60">
               <div className="flex justify-between items-center text-sm mb-2">
                 <span className="text-zinc-500">Email</span>
                 <span className="text-zinc-800 dark:text-zinc-300">{profile?.email || 'N/A'}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-zinc-500">System Role</span>
                 <span className="text-indigo-600 dark:text-indigo-400 font-medium tracking-wide">
                    {profile?.roles?.[0] || 'Member'}
                 </span>
               </div>
            </div>

            <button 
              onClick={() => { setShowProfileModal(false); setShowLogoutModal(true); }} 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg transition-all font-medium"
            >
              <LogOut size={16} /> Exit / Logout
            </button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-sm anim-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-6 w-full max-w-[320px] shadow-2xl anim-fade-up mx-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Confirm Logout</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">Are you sure you want to securely log out? You will need to re-authenticate.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
              <button onClick={logout} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-sm">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
