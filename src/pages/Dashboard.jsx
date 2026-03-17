import { useMemo } from 'react';
import useMenuStore from '../store/useMenuStore';
import useUserStore from '../store/useUserStore';
import StatCard from '../components/molecules/StatCard';
import Badge from '../components/atoms/Badge';
import Spinner from '../components/atoms/Spinner';

const ICON_MAP = {
  dashboard: '⊞', users: '◎', clock: '◷', wallet: '◈',
  briefcase: '◉', chart: '⊿', folder: '▣', 'bar-chart': '⊟',
  settings: '◈', list: '≡', shield: '◬', layers: '⊕',
  'log-in': '→', calendar: '▦', dollar: '$', file: '▤',
  'credit-card': '▨', target: '◎', 'check-square': '☑',
  'file-text': '▤', user: '◉', lock: '◈', menu: '≡',
};

function WelcomeScreen({ profile, menus }) {
  const topLevel = useMemo(() => menus.filter((m) => m.parent_id === 0), [menus]);

  const stats = [
    { label: 'Total Menus',   value: menus.length,           icon: '≡' },
    { label: 'Parent Menus',  value: topLevel.length,        icon: '▣' },
    { label: 'Sub-menus',     value: menus.length - topLevel.length, icon: '⊕' },
    { label: 'Account',       value: profile?.username || '—', icon: '◉', trend: 'Authenticated' },
  ];

  return (
    <div className="anim-fade-up">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
          Good day, <span className="text-indigo-600 dark:text-indigo-400">{profile?.first_name || 'User'}</span> 👋
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Here's a quick overview of your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Quick Access</h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-600">{topLevel.length} modules</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {topLevel.map((m) => (
          <div
            key={m.id}
            className="group flex flex-col items-start gap-3 p-4 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700/80 rounded-xl transition-all duration-150 text-left shadow-sm dark:shadow-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-mono group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
              {ICON_MAP[m.icon] || '·'}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white capitalize leading-tight">
                {m.name.replace(/_/g, ' ')}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-600 mt-0.5 truncate max-w-full">
                {m.path}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { menus, isLoading, error } = useMenuStore();
  const { profile } = useUserStore();

  return (
    <div className="flex flex-col h-full bg-transparent">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">Welcome back to your workspace.</p>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
             <Spinner size="lg" />
          </div>
        ) : error ? (
           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
             Failed to load workspace parameters.
           </div>
        ) : (
           <WelcomeScreen profile={profile} menus={menus} />
        )}
      </main>
    </div>
  );
}
