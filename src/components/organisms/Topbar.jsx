/**
 * Organism: Topbar
 * Sticky top header bar for the dashboard layout.
 */
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { Menu, HelpCircle } from 'lucide-react';

export default function Topbar({ title, profile, onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-[#24252a]/90 border-b border-zinc-200 dark:border-[#2e2f36] backdrop-blur-sm shrink-0">
      {/* Left: page title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 -ml-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
          {title || 'Dashboard'}
        </h1>
        {title && (
          <Badge variant="info" className="hidden sm:inline-flex">
            {title.toLowerCase().replace(/ /g, '_')}
          </Badge>
        )}
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Avatar name={profile?.username || ''} size="sm" />
          <div>
            <p className="text-xs font-medium text-zinc-900 dark:text-white leading-none">{profile?.username}</p>
            <p className="text-[10px] text-zinc-500 dark:text-[#64676f] leading-none mt-0.5">Online</p>
          </div>
        </div>

        <div className="w-px h-5 bg-zinc-200 dark:bg-[#3a3b42] hidden sm:block" />


        <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1.5 px-2 sm:px-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
