/**
 * Molecule: StatCard
 * Small info card for dashboard stats.
 */
export default function StatCard({ label, value, icon, trend }) {
  return (
    <div className="bg-white dark:bg-[#2c2d33] border border-zinc-200 dark:border-[#3a3b42] rounded-xl p-4 flex items-start justify-between gap-3 hover:border-zinc-300 dark:hover:border-[#44454d] shadow-sm dark:shadow-none transition-colors">
      <div>
        <p className="text-xs text-zinc-500 dark:text-[#64676f] font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{value}</p>
        {trend && (
          <p className="text-xs text-zinc-400 dark:text-[#a0a3ab] mt-1">{trend}</p>
        )}
      </div>
      {icon && (
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-base shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
